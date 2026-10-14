import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getJson } from '../../services/apiClient';
import { ProductDetailPage } from './ProductDetailPage';
import { ProductAiTools } from './ProductAiTools';
export function ProductDetailRoute() {
    const productId = useParams().id || '';
    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    useEffect(() => { Promise.all([getJson(`/products/product/${productId}`), getJson(`/products/product/${productId}/related?limit=4`)]).then(([item, items]) => { setProduct(item); setRelated(Array.isArray(items) ? items : []); }).catch(() => undefined); }, [productId]);
    return _jsxs(_Fragment, { children: [_jsx(ProductDetailPage, {}), product && _jsx(ProductAiTools, { product: product, related: related })] });
}
