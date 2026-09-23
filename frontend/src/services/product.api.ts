import { getJson } from './apiClient'
import type { Product, ProductList } from '../types'

export const productApi = {
  getProduct: (productId: string) => getJson<Product>(`/products/product/${productId}`),
  getProducts: (query = '') => getJson<ProductList>(`/products${query}`),
  getNewArrivals: (limit = 8) => getJson<Product[]>(`/products/new-arrivals?limit=${limit}`),
  getTopRated: (limit = 8) => getJson<Product[]>(`/products/top-rated?limit=${limit}`),
}
