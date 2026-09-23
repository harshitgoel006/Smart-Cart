import { Product } from "../models/product.model.js";

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

const generateProviderReply = async (message, products) => {
  const apiKey = process.env.AI_API_KEY;

  if (!apiKey) {
    return null;
  }

  const model = process.env.AI_MODEL || "gpt-4o-mini";
  const endpoint = process.env.AI_API_URL || "https://api.openai.com/v1/chat/completions";
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
};
