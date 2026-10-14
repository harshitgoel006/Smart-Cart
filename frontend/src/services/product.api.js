import { getJson } from './apiClient';
export const productApi = {
    getProduct: (productId) => getJson(`/products/product/${productId}`),
    getProducts: (query = '') => getJson(`/products${query}`),
    getNewArrivals: (limit = 8) => getJson(`/products/new-arrivals?limit=${limit}`),
    getTopRated: (limit = 8) => getJson(`/products/top-rated?limit=${limit}`),
};
