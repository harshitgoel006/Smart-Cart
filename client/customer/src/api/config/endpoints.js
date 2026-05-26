export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/users/login",
    REGISTER: "/users/register",
    LOGOUT: "/users/logout",
    SEND_OTP: "/users/send-otp",
    VERIFY_OTP: "/users/verify-otp",
    GET_USER: "/users/get-user",
  },

  CATEGORY: {
    GET_ALL: "/categories",
    GET_FEATURED: "/categories/featured",
    GET_BY_SLUG: (slug) =>
      `/categories/slug/${slug}`,
  },

  PRODUCT: {
    GET_ALL: "/products",

    GET_BY_ID: (id) =>
      `/products/product/${id}`,

    GET_BY_CATEGORY: (categoryId) =>
      `/products/category/${categoryId}`,

    SEARCH: "/products/search",

    NEW_ARRIVALS:
      "/products/new-arrivals",

    TOP_RATED:
      "/products/top-rated",
  },

  CART: {
    GET: "/cart",

    ADD: "/cart/add",

    CLEAR: "/cart/clear",

    UPDATE: (itemId) =>
      `/cart/update/${itemId}`,

    REMOVE: (itemId) =>
      `/cart/remove/${itemId}`,
  },

  WISHLIST: {
    GET: "/wishlist",

    ADD: "/wishlist/items",

    REMOVE: (itemId) =>
      `/wishlist/items/${itemId}`,
  },

  ORDER: {
    PLACE: "/orders/orders",

    HISTORY: "/orders/orders",

    DETAILS: (id) =>
      `/orders/orders/${id}`,
  },

  BANNERS: {
    GET_ALL: "/banners",
  },
};