// src/data/products/men.js

 const MEN_IMAGES = [
  // Casual / Street
  "https://i.pinimg.com/1200x/6b/2f/d8/6b2fd88b4065fc417cf1c7267d9c0892.jpg",
  "https://i.pinimg.com/1200x/87/8b/51/878b514cbf74837c2cb5c0fb598b96d2.jpg",
  "https://i.pinimg.com/1200x/80/28/e4/8028e4627b84d16f84581f0bc379e0ad.jpg",
  "https://i.pinimg.com/1200x/05/01/c8/0501c8efd52bda19b729247bcaee987b.jpg",
  "https://i.pinimg.com/1200x/50/7c/11/507c11dd5cae613163d93dc9ceb82305.jpg",
  "https://i.pinimg.com/736x/42/9c/e8/429ce897ccbaa3efc122d47ab18eebe5.jpg",
  "https://i.pinimg.com/736x/68/57/cf/6857cfe09ac733044062402556e84109.jpg",
  "https://i.pinimg.com/736x/17/ec/e0/17ece08130b1c3f72ec8d73e8bb97bd8.jpg",

  // Formal / Smart
  "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1521334884684-d80222895322?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1600&auto=format&fit=crop",

  // Ethnic / Kurta / Festive
  "https://i.pinimg.com/736x/fd/1c/4f/fd1c4fa5b789bdcf930494e47e17b79a.jpg",
  "https://i.pinimg.com/736x/90/c2/53/90c253609dd4970f8b2f95f8ea566253.jpg",
  "https://i.pinimg.com/736x/11/76/88/11768892bf8c9a6c694e524610475593.jpg",
  "https://i.pinimg.com/736x/07/7b/0a/077b0a88062a4921eac04b489de49d93.jpg",
  "https://i.pinimg.com/736x/ee/af/28/eeaf28115cb7c67b9357e9bb1669d143.jpg",

  // Jackets / Winter / Street Luxe
  "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1614031679232-0dae779a706e?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1618354691373-d8b90d1b1c3c?q=80&w=1600&auto=format&fit=crop",

  // Shoes / Accessories / Detail shots
  "https://images.unsplash.com/photo-1528701800489-20beeb96d9bb?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519744346361-3f4b42709c09?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1528701800489-20beeb96d9bb?q=80&w=1600&auto=format&fit=crop",

  // Extra fillers (for 1000+ products reuse)
  "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1520974735194-9f8c94c8a24a?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1520975698519-59e6b3c61d7b?q=80&w=1600&auto=format&fit=crop"
];


const SUB_CATEGORIES = ["T-Shirts","Shirts","Jeans","Trousers","Cargos","Hoodies","Sweatshirts","Jackets","Ethnic Wear","Innerwear","Footwear","Accessories"];

const BRANDS = ["Nike", "Puma", "Adidas", "H&M", "Zara", "Levis"];

let idCounter = 1;

const menProducts = [];

/* 🔁 GENERATE ~240 PRODUCTS (frontend mock) */
SUB_CATEGORIES.forEach((subCategory) => {
  MEN_IMAGES.forEach((img, index) => {
    for (let i = 0; i < 3; i++) {
      const price = 999 + i * 300;
      const discount = i % 2 === 0 ? 20 : 0;

      menProducts.push({
        id: `men-${idCounter++}`,

        name: `${subCategory} Premium ${i + 1}`,
        slug: `men-${subCategory.toLowerCase().replace(/\s/g, "-")}-${idCounter}`,

        description:
          "Premium quality fabric with modern fit. Designed for everyday comfort and style.",

        brand: BRANDS[index % BRANDS.length],

        category: "men",
        subCategory,

        price,
        discount,
        finalPrice: price - (price * discount) / 100,

        stock: 50 + i * 10,
        sold: Math.floor(Math.random() * 200),

        rating: (Math.random() * 1.5 + 3.5).toFixed(1),
        reviews: Math.floor(Math.random() * 300),

        image: img,
        images: [
          { url: img },
          { url: img },
          { url: img },
        ],

        tags: ["men", subCategory.toLowerCase(), "fashion"],

        featured: i === 0,
        isActive: true,

        variants: [
          {
            label: "Size",
            options: [
              { value: "S", stock: 10, price },
              { value: "M", stock: 15, price },
              { value: "L", stock: 20, price },
              { value: "XL", stock: 12, price },
            ],
          },
        ],
      });
    }
  });
});

export default menProducts;