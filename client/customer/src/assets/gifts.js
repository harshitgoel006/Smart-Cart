// src/data/products/gifts.js

const GIFT_IMAGES = [
  // 1–10 : Gift Boxes / Flatlays
  "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1607344645866-009c320b63e0?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1513884923967-4b182ef167ab?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1606312619344-0a3b0fdcc7b4?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1576174464184-fb78fe882bfd?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1607344645861-009c320b63e0?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1513885535751-8b9238cd48f?q=80&w=1600&auto=format&fit=crop",

  // 11–20 : Birthday / Celebration Gifts
  "https://images.unsplash.com/photo-1607344646449-009c320b63e0?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1526040652367-ac003a0475fe?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1606813907361-3e9c1f4a5d77?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1607344645853-009c320b63e0?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1549057446-9f5c6ac91a04?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519682337058-a94d519337bc?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1607344645860-009c320b63e0?q=80&w=1600&auto=format&fit=crop",

  // 21–30 : Romantic / Personal Gifts
  "https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1515165562835-c3b8c3d6f7c9?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1526040652367-ac003a0475fe?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1513884923967-4b182ef167ab?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1549057446-9f5c6ac91a04?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519682337058-a94d519337bc?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1606312619344-0a3b0fdcc7b4?q=80&w=1600&auto=format&fit=crop",

  // 31–40 : Festive / Premium Gifts
  "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1607344645866-009c320b63e0?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1513885535751-8b9238cd48f?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1515165562835-c3b8c3d6f7c9?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1607344645853-009c320b63e0?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1576174464184-fb78fe882bfd?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1606813907361-3e9c1f4a5d77?q=80&w=1600&auto=format&fit=crop",
];

const SUB_CATEGORIES = [
  "Birthday",
  "Anniversary",
  "Wedding",
  "Festival",
  "Romantic",
  "Personalized",
  "Corporate",
  "Kids Gifts",
  "Luxury Gifts",
  "Handmade"
];

const BRANDS = [
  "Giftify",
  "Momento",
  "SurpriseBox",
  "LoveCraft",
  "OccasionHub",
];

let idCounter = 1;
const giftsProducts = [];

/* 🔁 AUTO GENERATE GIFTS PRODUCTS */
SUB_CATEGORIES.forEach((subCategory) => {
  GIFT_IMAGES.forEach((img, index) => {
    for (let i = 0; i < 4; i++) {
      const price = 699 + i * 450;
      const discount = i % 2 === 0 ? 20 : 0;

      giftsProducts.push({
        id: `gifts-${idCounter++}`,

        name: `${subCategory} Gift Box ${i + 1}`,
        slug: `gift-${subCategory.toLowerCase()}-${idCounter}`,

        description:
          "Beautifully curated gift set perfect for special occasions and memorable moments.",

        brand: BRANDS[index % BRANDS.length],

        category: "gifts",
        subCategory,

        price,
        discount,
        finalPrice: price - (price * discount) / 100,

        stock: 40 + i * 10,
        sold: Math.floor(Math.random() * 400),

        rating: (Math.random() * 1.3 + 3.7).toFixed(1),
        reviews: Math.floor(Math.random() * 600),

        image: img,
        images: [
          { url: img },
          { url: img },
          { url: img },
        ],

        tags: [
          "gift",
          subCategory.toLowerCase(),
          "special",
          "occasion",
        ],

        featured: i === 0,
        isActive: true,

        variants: [
          {
            label: "Packaging",
            options: [
              { value: "Standard", stock: 20, price },
              { value: "Premium", stock: 15, price: price + 299 },
            ],
          },
        ],
      });
    }
  });
});

export default giftsProducts;