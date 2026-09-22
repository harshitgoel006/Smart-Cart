export type ImageRef = { url?: string }
export type Product = { _id: string; name: string; brand?: string; description?: string; finalPrice?: number | string | { $numberDecimal?: string }; price?: number | string | { $numberDecimal?: string }; discountPercentage?: number; ratings?: number; reviews?: number; images?: ImageRef[]; coverImage?: ImageRef; stock?: number; badges?: string[] }
export type Category = { _id: string; name: string; slug: string; image?: ImageRef; description?: string }
export type Banner = { _id: string; title?: string; tagline?: string; image?: ImageRef; redirectLink?: string }
export type ProductList = { products: Product[]; total: number; page: number; totalPages: number }
export type Cart = { items: Array<{ _id: string; quantity: number; unitPriceSnapshot?: Product['price']; lineTotalSnapshot?: Product['price']; product?: Product }>; totalItems: number; subtotal: Product['price']; discountAmount: Product['price']; finalAmount: Product['price'] }
export type AuthUser = { _id: string; fullname?: string; username?: string; email: string; role: string; avatar?: string }
export type Wishlist = { items: Array<{ _id: string; product?: Product; isAvailable?: boolean }> }
