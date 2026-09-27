import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Product } from '../../types'
import { getJson } from '../../services/apiClient'
import { ProductDetailPage } from './ProductDetailPage'
import { ProductAiTools } from './ProductAiTools'

export function ProductDetailRoute() {
  const productId = useParams().id || ''
  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  useEffect(() => { Promise.all([getJson<Product>(`/products/product/${productId}`), getJson<Product[]>(`/products/product/${productId}/related?limit=4`)]).then(([item, items]) => { setProduct(item); setRelated(Array.isArray(items) ? items : []) }).catch(() => undefined) }, [productId])
  return <><ProductDetailPage />{product && <ProductAiTools product={product} related={related} />}</>
}
