import type { Product } from './types'
export function getNumber(value: Product['price']) { if (typeof value === 'object' && value !== null) return Number(value.$numberDecimal || 0); return Number(value || 0) }
export function formatPrice(value: Product['price']) { return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(getNumber(value)) }
export function productImage(product: Product) { return product.coverImage?.url || product.images?.[0]?.url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1800&q=85' }
