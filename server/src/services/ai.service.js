import { Product } from "../models/product.model.js";
import { Review } from "../models/review.model.js";
import { Order } from "../models/order.model.js";
import mongoose from "mongoose";

const MAX_MESSAGE_LENGTH = 500;

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const extractBudget = (message) => {
  const match = message.match(/(?:under|below|less than|max(?:imum)?|within)\s*[₹rs.]?\s*(\d[\d,]*)/i);

  if (!match) {
    return null;
  }

  return toNumber(match[1].replace(/,/g, ""));
};

const getSearchTerms = (message) => {
  return message
    .toLowerCase()
    .replace(/(?:under|below|less than|max(?:imum)?|within)\s*[₹rs.]?\s*\d[\d,]*/gi, "")
    .replace(/[^a-z0-9\s]/gi, " ")
    .split(/\s+/)
    .filter((term) => term.length > 2)
    .filter(
      (term) =>
        ![
          "show",
          "find",
          "best",
          "good",
          "products",
          "product",
          "please",
          "want",
          "need",
          "under",
          "with",
          "for",
        ].includes(term),
    )
    .slice(0, 6);
};

const findRelevantProducts = async (message) => {
  const budget = extractBudget(message);
  const terms = getSearchTerms(message);
  const filter = {
    isDeleted: false,
    isActive: true,
    approvalStatus: "approved",
    stock: { $gt: 0 },
  };

  if (budget) {
    filter.finalPrice = { $lte: budget };
  }

  if (terms.length) {
    const pattern = terms.join("|");
    filter.$or = [
      { name: { $regex: pattern, $options: "i" } },
      { brand: { $regex: pattern, $options: "i" } },
      { description: { $regex: pattern, $options: "i" } },
      { tags: { $in: terms } },
    ];
  }

  return Product.find(filter)
    .sort({ ratings: -1, sold: -1 })
    .limit(6)
    .select("name slug brand finalPrice price discountPercentage ratings images stock");
};

const serializeProducts = (products) =>
  products.map((product) => ({
    id: product._id,
    name: product.name,
    slug: product.slug,
    brand: product.brand,
    price: product.finalPrice?.toString(),
    originalPrice: product.price?.toString(),
    discountPercentage: product.discountPercentage,
    rating: product.ratings,
    image: product.coverImage?.url || product.images?.[0]?.url || null,
    stock: product.stock,
  }));

const fallbackReply = (products, budget) => {
  if (!products.length) {
    return "I could not find a close match right now. Try a broader category, brand, or budget.";
  }

  const budgetText = budget ? ` within ₹${budget.toLocaleString("en-IN")}` : "";
  return `I found ${products.length} suitable option${products.length > 1 ? "s" : ""}${budgetText}. I have added them below for you to compare.`;
};

const getProductContext = (products) =>
  products
    .map(
      (product) =>
        `${product.name} by ${product.brand}, ₹${product.finalPrice}, rating ${product.ratings}`,
    )
    .join("\n");

const generateOpenAiReply = async (message, products) => {
  const apiKey = process.env.AI_API_KEY;

  if (!apiKey) {
    return null;
  }

  const model = process.env.AI_MODEL || "gpt-4o-mini";
  const endpoint =
    process.env.AI_API_URL ||
    "https://api.openai.com/v1/chat/completions";
  const productContext = products
    .map((product) => `${product.name} by ${product.brand}, ₹${product.finalPrice}, rating ${product.ratings}`)
    .join("\n");

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content:
            "You are SmartCart's concise shopping assistant. Only recommend products from the supplied context. Never invent price, stock, or specifications.",
        },
        {
          role: "user",
          content: `Customer request: ${message}\n\nAvailable products:\n${productContext}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    return null;
  }

  const body = await response.json();
  return body.choices?.[0]?.message?.content || null;
};

const generateGeminiReply = async (message, products) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return null;
  }

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const productContext = getProductContext(products);
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [
          {
            text: "You are SmartCart's concise shopping assistant. Only recommend products from the supplied context. Never invent price, stock, or specifications.",
          },
        ],
      },
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Customer request: ${message}\n\nAvailable products:\n${productContext}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 220,
      },
    }),
  });

  if (!response.ok) {
    return null;
  }

  const body = await response.json();
  return body.candidates?.[0]?.content?.parts?.[0]?.text || null;
};

const generateProviderReply = async (message, products) => {
  const provider = (process.env.AI_PROVIDER || "openai").toLowerCase();

  if (provider === "gemini") {
    return generateGeminiReply(message, products);
  }

  return generateOpenAiReply(message, products);
};

const generateTextReply = async (systemInstruction, userMessage) => {
  const provider = (process.env.AI_PROVIDER || "openai").toLowerCase();

  if (provider === "gemini" && process.env.GEMINI_API_KEY) {
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemInstruction }] },
        contents: [{ role: "user", parts: [{ text: userMessage }] }],
        generationConfig: { temperature: 0.35, maxOutputTokens: 260 },
      }),
    });

    if (!response.ok) return null;

    const body = await response.json();
    return body.candidates?.[0]?.content?.parts?.[0]?.text || null;
  }

  if (process.env.AI_API_KEY) {
    const endpoint = process.env.AI_API_URL || "https://api.openai.com/v1/chat/completions";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.AI_MODEL || "gpt-4o-mini",
        temperature: 0.35,
        max_tokens: 260,
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: userMessage },
        ],
      }),
    });

    if (!response.ok) return null;

    const body = await response.json();
    return body.choices?.[0]?.message?.content || null;
  }

  return null;
};

const productProjection =
  "name slug brand finalPrice price discountPercentage ratings reviews images coverImage stock category tags";

const serializeProduct = (product) => ({
  id: product._id,
  name: product.name,
  slug: product.slug,
  brand: product.brand,
  price: product.finalPrice?.toString(),
  originalPrice: product.price?.toString(),
  discountPercentage: product.discountPercentage,
  rating: product.ratings,
  reviewCount: product.reviews,
  image: product.coverImage?.url || product.images?.[0]?.url || null,
  stock: product.stock,
});

const fallbackReviewSummary = (reviews) => {
  if (!reviews.length) return "There are no approved reviews for this product yet.";

  const average = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const positive = reviews.filter((review) => review.rating >= 4).length;
  const sentiment = positive / reviews.length >= 0.7 ? "mostly positive" : "mixed";

  return `Customers rate this product ${average.toFixed(1)} out of 5. The feedback is ${sentiment}; read the individual reviews for detailed experiences.`;
};

export const aiService = {
  async assist(message) {
    const normalizedMessage = String(message || "").trim();

    if (!normalizedMessage) {
      return {
        reply: "Tell me what you are looking for and I will help you find it.",
        products: [],
        source: "fallback",
      };
    }

    const safeMessage = normalizedMessage.slice(0, MAX_MESSAGE_LENGTH);
    const budget = extractBudget(safeMessage);
    const products = await findRelevantProducts(safeMessage);
    let reply = null;
    let source = "fallback";

    try {
      reply = await generateProviderReply(safeMessage, products);
      source = reply ? "provider" : source;
    } catch {
      reply = null;
    }

    return {
      reply: reply || fallbackReply(products, budget),
      products: serializeProducts(products),
      source,
    };
  },

  async search(message) {
    const safeMessage = String(message || "").trim().slice(0, MAX_MESSAGE_LENGTH);
    const budget = extractBudget(safeMessage);
    const products = await findRelevantProducts(safeMessage);

    return {
      query: safeMessage,
      filters: { maxPrice: budget, terms: getSearchTerms(safeMessage) },
      products: serializeProducts(products),
    };
  },

  async getRecommendations(limit = 8, seedProductIds = [], userId = null) {
    const safeLimit = Math.min(Math.max(Number(limit) || 8, 1), 20);
    const validSeeds = seedProductIds.filter((id) => mongoose.Types.ObjectId.isValid(id));
    let personalizedSeeds = validSeeds;

    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      const previousOrders = await Order.find({
        user: userId,
        isDeleted: false,
      })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("items.product");

      personalizedSeeds = [
        ...new Set([
          ...personalizedSeeds,
          ...previousOrders.flatMap((order) => order.items.map((item) => item.product.toString())),
        ]),
      ].filter((id) => mongoose.Types.ObjectId.isValid(id));
    }

    let categoryIds = [];

    if (personalizedSeeds.length) {
      const seedProducts = await Product.find({ _id: { $in: personalizedSeeds } }).select("category");
      categoryIds = seedProducts.map((product) => product.category);
    }

    const filter = {
      isDeleted: false,
      isActive: true,
      approvalStatus: "approved",
      stock: { $gt: 0 },
      ...(personalizedSeeds.length ? { _id: { $nin: personalizedSeeds } } : {}),
      ...(categoryIds.length ? { category: { $in: categoryIds } } : {}),
    };

    const products = await Product.find(filter)
      .sort({ featured: -1, ratings: -1, sold: -1, createdAt: -1 })
      .limit(safeLimit)
      .select(productProjection);

    return products.map(serializeProduct);
  },

  async compareProducts(productIds) {
    const validIds = productIds.filter((id) => mongoose.Types.ObjectId.isValid(id)).slice(0, 4);
    const products = await Product.find({
      _id: { $in: validIds },
      isDeleted: false,
      isActive: true,
      approvalStatus: "approved",
    }).select(productProjection);

    const productData = products.map(serializeProduct);
    const comparisonText = await generateTextReply(
      "You are SmartCart's comparison assistant. Compare only the supplied products. Be concise and mention the best use case for each product.",
      JSON.stringify(productData),
    ).catch(() => null);

    return {
      products: productData,
      summary: comparisonText || "Compare the products by price, rating, discount, and availability below.",
    };
  },

  async getCartSuggestions(productIds) {
    const validIds = productIds.filter((id) => mongoose.Types.ObjectId.isValid(id));
    const cartProducts = await Product.find({ _id: { $in: validIds } }).select("category brand");
    const categories = cartProducts.map((product) => product.category);
    const brands = cartProducts.map((product) => product.brand);

    const suggestions = await Product.find({
      _id: { $nin: validIds },
      isDeleted: false,
      isActive: true,
      approvalStatus: "approved",
      stock: { $gt: 0 },
      $or: [
        ...(categories.length ? [{ category: { $in: categories } }] : []),
        ...(brands.length ? [{ brand: { $in: brands } }] : []),
      ],
    })
      .sort({ ratings: -1, sold: -1 })
      .limit(6)
      .select(productProjection);

    return suggestions.map(serializeProduct);
  },

  async getReviewSummary(productId) {
    if (!mongoose.Types.ObjectId.isValid(productId)) return null;

    const reviews = await Review.find({
      product: productId,
      status: "approved",
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .limit(30)
      .select("rating title comment isVerifiedPurchase");

    const reviewData = reviews.map((review) => ({
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      verified: review.isVerifiedPurchase,
    }));
    const summary = await generateTextReply(
      "Summarize customer reviews for an ecommerce product. Mention common strengths, concerns, and who the product suits. Do not invent facts.",
      JSON.stringify(reviewData),
    ).catch(() => null);

    return {
      reviewCount: reviews.length,
      averageRating: reviews.length
        ? Number((reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1))
        : 0,
      summary: summary || fallbackReviewSummary(reviews),
    };
  },

  async getOrderStatus(userId, orderId) {
    if (!mongoose.Types.ObjectId.isValid(orderId)) return null;

    const order = await Order.findOne({ _id: orderId, user: userId, isDeleted: false })
      .select("_id orderStatus paymentStatus createdAt statusHistory items.productSnapshot");

    if (!order) return null;

    return {
      orderId: order._id,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      items: order.items.map((item) => item.productSnapshot?.name).filter(Boolean),
      timeline: order.statusHistory,
    };
  },
};
