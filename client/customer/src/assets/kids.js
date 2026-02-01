// src/data/products/kids.js

const kidsProducts = [];

const kidsImages = [
  // 1–10 : Kids Fashion / Studio
  "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1541698444083-023c97d3f4b6?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522771930-78848d9293e8?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519340333755-506d1c9b5b35?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1604916287784-c3242027f93b?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1520975698519-59c0e0f01a88?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=1600&auto=format&fit=crop",

  // 11–20 : Toys / Play / Lifestyle
  "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1607453998774-d533f65dac99?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1601582589872-35b6b1f1c4b9?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542816417-098367d22a8c?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1596079890744-cb4e8b4e87b6?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1604917018615-7bff6fa63f2b?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=1600&auto=format&fit=crop",

  // 21–30 : School / Casual Wear
  "https://images.unsplash.com/photo-1601933470096-0e34634ffcde?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1536640712-4d4c36ff0e4e?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1604147495798-57beb5d6af73?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1529758146491-1e11fd721f77?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1601758123927-1964c8b6f4d7?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1540479859555-17af45c78602?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1603946877690-d4101c1c1b49?q=80&w=1600&auto=format&fit=crop",

  // 31–40 : Premium / Editorial
  "https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1580974928064-f0aeef70895a?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1609250291996-fdebe6020a8f?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542315192-1f61a179df5f?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1590865131043-c1f9c6788a38?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1559181567-c3190ca9959b?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1589810261950-24ed3f964cfd?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1536640712-4d4c36ff0e4e?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1587652432438-7e6d8cc2a5c6?q=80&w=1600&auto=format&fit=crop"
];

const subCategories = [
  "boys-clothing",
  "girls-clothing",
  "baby-wear",
  "toys",
  "footwear",
  "school-essentials",
  "winter-wear",
  "ethnic-wear",
  "accessories",
];

// ~270 products (9 × 30)
let idCounter = 3801;

subCategories.forEach((sub) => {
  for (let i = 1; i <= 30; i++) {
    const price = 399 + i * 15;
    const discount =
      i % 4 === 0 ? 25 : i % 6 === 0 ? 15 : 0;

    kidsProducts.push({
      id: idCounter++,
      name: `${sub.replace("-", " ").toUpperCase()} Item ${i}`,
      slug: `${sub}-kids-${i}`,
      category: "kids",
      subCategory: sub,
      brand: "SmartCart Kids",
      price,
      discount,
      finalPrice: Math.round(price - (price * discount) / 100),
      rating: (Math.random() * (5 - 4.2) + 4.2).toFixed(1),
      reviews: Math.floor(Math.random() * 400 + 40),
      image: kidsImages[i % kidsImages.length],
    });
  }
});

export default kidsProducts;