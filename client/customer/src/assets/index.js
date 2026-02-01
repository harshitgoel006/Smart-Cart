// src/data/products/index.js

import men from "./men";
import women from "./women";
import fashion from "./fashion";
import electronics from "./electronics";
import grocery from "./grocery";
import beauty from "./beauty";
import kids from "./kids";
import sports from "./sports";
import homeLiving from "./homeliving";
import accessories from "./accessories";
import gifts from "./gifts";

// 🔥 MERGED PRODUCT LIST (SINGLE SOURCE OF TRUTH)
const allProducts = [
  ...men,
  ...women,
  ...fashion,
  ...electronics,
  ...grocery,
  ...beauty,
  ...kids,
  ...sports,
  ...homeLiving,
  ...accessories,
  ...gifts,
];

export default allProducts;