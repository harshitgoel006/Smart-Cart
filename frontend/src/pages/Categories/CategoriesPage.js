import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, ChevronRight, Search, Sparkles } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { getJson } from '../../services/apiClient';
import { CATEGORY_IMAGES } from '../../constants';
import { ProductCard } from '../../components/product/ProductCard/ProductCard';
function flatten(categories) {
    return categories.flatMap((category) => [category, ...flatten(category.children || [])]);
}
function categoryImage(category) {
    const fallbackBySlug = {
        topwear: CATEGORY_IMAGES.men,
        bottomwear: CATEGORY_IMAGES.sports,
        footwear: CATEGORY_IMAGES.women,
        'ethnic-wear': CATEGORY_IMAGES.gifts,
        'formal-wear': CATEGORY_IMAGES['home-living'],
        accessories: CATEGORY_IMAGES.electronics,
        mobiles: CATEGORY_IMAGES.electronics,
        audio: CATEGORY_IMAGES.electronics,
        kitchen: CATEGORY_IMAGES['home-living'],
        decor: CATEGORY_IMAGES.gifts,
        skincare: CATEGORY_IMAGES.beauty,
        groceries: CATEGORY_IMAGES.groceries,
    };
    return category.image?.url || category.bannerImage?.url || CATEGORY_IMAGES[category.slug] || fallbackBySlug[category.slug] || CATEGORY_IMAGES.electronics;
}
export function CategoriesPage() {
    const { slug } = useParams();
    const [categories, setCategories] = useState([]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(false);
    const [error, setError] = useState('');
    useEffect(() => {
        getJson('/categories')
            .then(setCategories)
            .catch((reason) => setError(reason.message))
            .finally(() => setLoading(false));
    }, []);
    const allCategories = useMemo(() => flatten(categories), [categories]);
    const parents = categories.filter((category) => !category.parent);
    const selected = allCategories.find((category) => category.slug === slug) || parents[0];
    const children = selected?.children || [];
    const visibleParents = parents.filter((category) => category.name.toLowerCase().includes(query.toLowerCase()));
    useEffect(() => {
        if (!selected?._id)
            return;
        setProductsLoading(true);
        getJson(`/products?category=${selected._id}&limit=4&sort=bestSelling`)
            .then((data) => setFeaturedProducts(data.products || []))
            .catch(() => setFeaturedProducts([]))
            .finally(() => setProductsLoading(false));
    }, [selected?._id]);
    if (loading)
        return _jsx("main", { className: "categories-page section", children: _jsx("div", { className: "categories-loading", children: "Loading categories..." }) });
    return (_jsxs("main", { className: "categories-page section", children: [_jsxs("section", { className: "categories-hero", children: [_jsxs("div", { className: "categories-hero__copy", children: [_jsxs("span", { className: "eyebrow", children: [_jsx(Sparkles, { size: 14 }), " SmartCart directory"] }), _jsx("h1", { children: "Find your next everyday favourite." }), _jsx("p", { children: "Explore curated categories, discover useful essentials and browse at your own pace." }), _jsxs(Link, { className: "primary-button", to: "/products", children: ["Browse all products ", _jsx(ArrowUpRight, { size: 16 })] })] }), _jsxs("div", { className: "categories-hero__visual", children: [_jsx("img", { src: CATEGORY_IMAGES['home-living'], alt: "Warmly curated SmartCart essentials" }), _jsx("span", { className: "categories-hero__visual-shade" }), _jsxs("div", { className: "categories-hero__visual-copy", children: [_jsx("span", { children: "Thoughtfully curated" }), _jsxs("strong", { children: ["Everyday", _jsx("br", {}), "essentials"] }), _jsx("small", { children: "Made to fit your way of living" })] })] })] }), error ? _jsx("div", { className: "api-notice", children: error }) : null, _jsxs("section", { className: "categories-explorer", "aria-label": "Category explorer", children: [_jsxs("aside", { className: "categories-sidebar", children: [_jsxs("div", { className: "categories-sidebar__head", children: [_jsx("span", { className: "eyebrow", children: "Explore" }), _jsx("h2", { children: "Categories" })] }), _jsxs("label", { className: "categories-search", children: [_jsx(Search, { size: 15 }), _jsx("input", { value: query, onChange: (event) => setQuery(event.target.value), placeholder: "Find a category", "aria-label": "Find a category" })] }), _jsx("nav", { children: visibleParents.map((category) => (_jsxs(Link, { className: selected?._id === category._id ? 'is-active' : '', to: `/categories/${category.slug}`, children: [_jsx("span", { children: category.name }), _jsx(ChevronRight, { size: 15 })] }, category._id))) })] }), _jsx("div", { className: "categories-content", children: selected ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "categories-content__heading", children: [_jsxs("div", { children: [_jsx("span", { className: "eyebrow", children: selected.parent ? 'Explore collection' : 'Shop by department' }), _jsx("h2", { children: selected.name }), _jsx("p", { children: selected.description || selected.tagline || `A considered edit of ${selected.name.toLowerCase()} for everyday living, gifting and the moments in between.` })] }), _jsxs(Link, { className: "categories-content__browse", to: `/products?category=${selected._id}`, children: ["Browse the edit ", _jsx(ArrowUpRight, { size: 15 })] })] }), children.length ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "categories-section-intro", children: [_jsxs("div", { children: [_jsx("span", { className: "eyebrow", children: "Ways to shop" }), _jsx("h3", { children: "Find your kind of everyday" })] }), _jsx("p", { children: "Start with a mood, a need or a style direction. We\u2019ll take you to the right collection." })] }), _jsx("div", { className: "subcategory-grid", children: children.map((child) => (_jsxs(Link, { className: "subcategory-card", to: `/categories/${child.slug}`, children: [_jsx("img", { src: categoryImage(child), alt: "", loading: "lazy" }), _jsx("span", { className: "subcategory-card__shade" }), _jsxs("span", { className: "subcategory-card__copy", children: [_jsx("small", { children: child.tagline || child.description || 'Explore the collection' }), _jsx("strong", { children: child.name }), _jsx(ArrowUpRight, { size: 17 })] })] }, child._id))) })] })) : (_jsxs("div", { className: "categories-leaf-state", children: [_jsx("span", { className: "eyebrow", children: "Ready to browse" }), _jsxs("h3", { children: ["Explore ", selected.name] }), _jsx("p", { children: "See all available products in this category with filters, sorting and AI shopping help." }), _jsxs(Link, { className: "primary-button", to: `/products?category=${selected._id}`, children: ["View products ", _jsx(ArrowUpRight, { size: 16 })] })] })), _jsxs("section", { className: "categories-edit", "aria-label": `${selected.name} product edit`, children: [_jsxs("div", { className: "categories-section-intro categories-section-intro--edit", children: [_jsxs("div", { children: [_jsxs("span", { className: "eyebrow", children: [_jsx(Sparkles, { size: 14 }), " Curated for you"] }), _jsxs("h3", { children: ["Shop the ", selected.name.toLowerCase(), " edit"] })] }), _jsxs(Link, { className: "categories-content__browse", to: `/products?category=${selected._id}`, children: ["See everything ", _jsx(ArrowUpRight, { size: 15 })] })] }), productsLoading ? (_jsx("div", { className: "categories-products-loading", children: "Finding a few good picks..." })) : featuredProducts.length ? (_jsx("div", { className: "product-grid categories-product-grid", children: featuredProducts.map((product) => _jsx(ProductCard, { product: product }, product._id)) })) : (_jsx("div", { className: "categories-edit__empty", children: "This edit is being refreshed. Browse the full department to see what\u2019s available." }))] })] })) : _jsx("div", { className: "categories-leaf-state", children: _jsx("h3", { children: "No categories found." }) }) })] })] }));
}
