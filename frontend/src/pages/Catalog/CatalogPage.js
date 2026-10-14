import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Filter, Sparkles, SlidersHorizontal, X } from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getJson } from '../../services/apiClient';
import { ProductCard } from '../../components/product/ProductCard/ProductCard';
const brands = ['Nike', 'Sony', 'Adidas', 'boAt', 'Titan', 'IKEA', 'Lakmé', 'Mamaearth'];
const categoryChips = [
    ['men', 'Men'], ['women', 'Women'], ['electronics', 'Electronics'], ['home-living', 'Home & Living'],
    ['beauty', 'Beauty'], ['groceries', 'Groceries'], ['sports-gym', 'Sports & Gym'], ['gifts', 'Gifts'],
];
const sortOptions = [
    ['newest', 'Newest first'],
    ['priceLowToHigh', 'Price: low to high'],
    ['priceHighToLow', 'Price: high to low'],
    ['ratingHighToLow', 'Top rated'],
    ['bestSelling', 'Best selling'],
    ['discountHighToLow', 'Biggest discount'],
];
const copyBySlug = {
    men: { title: 'Men', tagline: 'Sharp everyday pieces, built for your pace.' },
    women: { title: 'Women', tagline: 'Thoughtful styles for every version of you.' },
    electronics: { title: 'Electronics', tagline: 'Useful tech and clever upgrades for modern living.' },
    'home-living': { title: 'Home & Living', tagline: 'Make space for comfort, calm and good design.' },
    beauty: { title: 'Beauty', tagline: 'Everyday rituals and little luxuries worth keeping.' },
    groceries: { title: 'Groceries', tagline: 'Fresh, practical essentials for everyday life.' },
    'sports-gym': { title: 'Sports & Gym', tagline: 'Gear up, move better and keep going.' },
    gifts: { title: 'Gifts', tagline: 'Find something thoughtful for every kind of moment.' },
};
const emptyFilters = { minPrice: '', maxPrice: '', rating: '', discount: '', brand: '', tags: '', inStock: false };
function CatalogSelect({ value, options, onChange, ariaLabel, fullWidth = false }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const selected = options.find(([optionValue]) => optionValue === value)?.[1] || options[0][1];
    useEffect(() => {
        const close = (event) => {
            if (ref.current && !ref.current.contains(event.target))
                setOpen(false);
        };
        document.addEventListener('mousedown', close);
        return () => document.removeEventListener('mousedown', close);
    }, []);
    return (_jsxs("div", { className: `catalog-select ${open ? 'is-open' : ''} ${fullWidth ? 'catalog-select--full' : ''}`, ref: ref, children: [_jsxs("button", { type: "button", className: "catalog-select__trigger", "aria-label": ariaLabel, "aria-expanded": open, onClick: () => setOpen((current) => !current), children: [_jsx("span", { children: selected }), _jsx(ChevronDown, { size: 15 })] }), open && _jsx("div", { className: "catalog-select__menu", role: "listbox", children: options.map(([optionValue, label]) => _jsx("button", { type: "button", role: "option", "aria-selected": value === optionValue, className: value === optionValue ? 'is-selected' : '', onClick: () => { onChange(optionValue); setOpen(false); }, children: label }, optionValue)) })] }));
}
export function CatalogPage() {
    const [params, setParams] = useSearchParams();
    const { slug } = useParams();
    const navigate = useNavigate();
    const query = params.get('q') || params.get('query') || '';
    const [result, setResult] = useState({ products: [], total: 0, page: 1, totalPages: 0 });
    const [categoryName, setCategoryName] = useState('');
    const [subcategories, setSubcategories] = useState([]);
    const [rootCategories, setRootCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [filters, setFilters] = useState(emptyFilters);
    useEffect(() => {
        getJson('/categories')
            .then((categories) => setRootCategories(categories.filter((category) => !category.parent)))
            .catch(() => setRootCategories([]));
    }, []);
    useEffect(() => {
        setFilters({
            minPrice: params.get('minPrice') || '', maxPrice: params.get('maxPrice') || '',
            rating: params.get('rating') || '', discount: params.get('discountPercentage') || '',
            brand: params.get('brand') || '', tags: params.get('tags') || '', inStock: params.get('inStock') === 'true',
        });
    }, [params]);
    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError('');
        const load = async () => {
            try {
                const nextParams = new URLSearchParams(params);
                let categoryId = '';
                if (params.get('category')) {
                    const category = await getJson(`/categories/${params.get('category')}`);
                    categoryId = category._id;
                    if (!cancelled) {
                        setCategoryName(category.name);
                        setSubcategories(category.children || []);
                    }
                }
                else if (slug) {
                    const category = await getJson(`/categories/slug/${slug}`);
                    categoryId = category._id;
                    if (!cancelled) {
                        setCategoryName(category.name);
                        setSubcategories(category.children || []);
                    }
                }
                else if (!cancelled) {
                    setCategoryName('');
                    setSubcategories([]);
                }
                const queryParams = new URLSearchParams({
                    page: params.get('page') || '1', limit: '24', sort: params.get('sort') || 'newest',
                });
                if (query)
                    queryParams.set('search', query);
                if (categoryId)
                    queryParams.set('category', categoryId);
                ['brand', 'minPrice', 'maxPrice', 'rating', 'discountPercentage', 'tags'].forEach((key) => {
                    const value = nextParams.get(key);
                    if (value)
                        queryParams.set(key, value);
                });
                if (params.get('inStock') === 'true')
                    queryParams.set('inStock', 'true');
                const data = await getJson(`/products?${queryParams}`);
                if (!cancelled)
                    setResult(data);
            }
            catch (reason) {
                if (!cancelled)
                    setError(reason instanceof Error ? reason.message : 'Unable to load products.');
            }
            finally {
                if (!cancelled)
                    setLoading(false);
            }
        };
        void load();
        return () => { cancelled = true; };
    }, [params, query, slug]);
    const title = query ? `Results for “${query}”` : categoryName || (slug && copyBySlug[slug]?.title) || 'All products';
    const tagline = query ? `A considered edit of products matching your search.` : slug && copyBySlug[slug]?.tagline || 'Discover everyday favourites, useful upgrades and pieces worth keeping.';
    const activeFilterCount = useMemo(() => Object.entries(filters).filter(([key, value]) => key !== 'inStock' ? Boolean(value) : value).length, [filters]);
    const updateParam = (key, value) => {
        const next = new URLSearchParams(params);
        if (value)
            next.set(key, value);
        else
            next.delete(key);
        next.set('page', '1');
        setParams(next);
    };
    const applyFilters = () => {
        const next = new URLSearchParams(params);
        Object.entries(filters).forEach(([key, value]) => {
            const apiKey = key === 'discount' ? 'discountPercentage' : key;
            if (value)
                next.set(apiKey, String(value));
            else
                next.delete(apiKey);
        });
        next.set('page', '1');
        setParams(next);
        setFiltersOpen(false);
    };
    const clearFilters = () => {
        const next = new URLSearchParams(params);
        ['brand', 'minPrice', 'maxPrice', 'rating', 'discountPercentage', 'tags', 'inStock'].forEach((key) => next.delete(key));
        next.set('page', '1');
        setFilters(emptyFilters);
        setParams(next);
    };
    const setPage = (page) => {
        const next = new URLSearchParams(params);
        next.set('page', String(page));
        setParams(next);
    };
    return (_jsxs("main", { className: "catalog-page section", children: [_jsxs("div", { className: "catalog-heading", children: [_jsxs("div", { children: [_jsx("span", { className: "eyebrow", children: "SmartCart catalog" }), _jsx("h1", { children: title }), _jsx("p", { children: tagline })] }), _jsxs("button", { type: "button", className: "catalog-ai-link", onClick: () => navigate(`/ai-shopping${query ? `?prompt=${encodeURIComponent(query)}` : ''}`), children: [_jsx(Sparkles, { size: 16 }), " Ask AI to narrow it down"] })] }), _jsxs("nav", { className: "catalog-category-nav", "aria-label": slug || params.get('category') ? 'Explore subcategories' : 'Shop by category', children: [_jsx("span", { children: slug || params.get('category') ? `Shop ${categoryName}` : 'Explore categories' }), _jsxs("div", { className: "catalog-category-chips", children: [slug || params.get('category') ? subcategories.map((subcategory) => (_jsx("button", { type: "button", className: params.get('category') === subcategory._id ? 'is-active' : '', onClick: () => updateParam('category', subcategory._id), children: subcategory.name }, subcategory._id))) : (rootCategories.length ? rootCategories : categoryChips.map(([categorySlug, label]) => ({ _id: categorySlug, slug: categorySlug, name: label }))).map((category) => (_jsx("button", { type: "button", className: params.get('category') === category._id ? 'is-active' : '', onClick: () => category._id !== category.slug ? updateParam('category', category._id) : navigate(`/products/${category.slug}`), children: category.name }, category._id))), slug && !subcategories.length && _jsx("span", { className: "catalog-category-empty", children: "All products in this category" })] })] }), _jsxs("div", { className: "catalog-toolbar", children: [_jsxs("div", { className: "catalog-chips", "aria-label": "Quick filters", children: [_jsx("button", { className: params.get('sort') === 'bestSelling' ? 'is-active' : '', type: "button", onClick: () => updateParam('sort', 'bestSelling'), children: "Trending now" }), _jsx("button", { className: params.get('discountPercentage') === '20' ? 'is-active' : '', type: "button", onClick: () => updateParam('discountPercentage', '20'), children: "20% off & more" }), _jsx("button", { className: params.get('rating') === '4' ? 'is-active' : '', type: "button", onClick: () => updateParam('rating', '4'), children: "4\u2605 rated" }), _jsx("button", { className: params.get('inStock') === 'true' ? 'is-active' : '', type: "button", onClick: () => updateParam('inStock', 'true'), children: "In stock" })] }), _jsxs("div", { className: "catalog-toolbar__actions", children: [_jsxs("button", { type: "button", className: "catalog-filter-button", onClick: () => setFiltersOpen(true), children: [_jsx(SlidersHorizontal, { size: 16 }), " Filters ", activeFilterCount ? _jsx("b", { children: activeFilterCount }) : null] }), _jsx(CatalogSelect, { ariaLabel: "Sort products", value: params.get('sort') || 'newest', options: sortOptions, onChange: (value) => updateParam('sort', value) })] })] }), activeFilterCount > 0 && _jsxs("div", { className: "catalog-active-filters", children: [_jsxs("span", { children: [_jsx(Filter, { size: 14 }), " Active filters"] }), _jsxs("button", { type: "button", onClick: clearFilters, children: ["Clear all ", _jsx(X, { size: 14 })] })] }), error && _jsx("div", { className: "api-notice", children: error }), loading ? _jsx("div", { className: "product-grid catalog-grid", children: Array.from({ length: 8 }).map((_, index) => _jsx("div", { className: "product-skeleton" }, index)) }) : _jsxs(_Fragment, { children: [_jsx("div", { className: "product-grid catalog-grid", children: result.products.map((product) => _jsx(ProductCard, { product: product }, product._id)) }), !result.products.length && _jsx("div", { className: "section-empty", children: "No products found. Try another filter or ask SmartCart AI for help." }), _jsx("div", { className: "pagination", children: Array.from({ length: Math.min(result.totalPages, 7) }).map((_, index) => _jsx("button", { className: result.page === index + 1 ? 'active' : '', onClick: () => setPage(index + 1), children: index + 1 }, index)) })] }), filtersOpen && _jsx("div", { className: "catalog-filter-backdrop", onClick: () => setFiltersOpen(false), children: _jsxs("aside", { className: "catalog-filter-panel", onClick: (event) => event.stopPropagation(), children: [_jsxs("div", { className: "catalog-filter-panel__head", children: [_jsxs("div", { children: [_jsx("span", { className: "eyebrow", children: "Refine your edit" }), _jsx("h2", { children: "Find the right fit." })] }), _jsx("button", { type: "button", onClick: () => setFiltersOpen(false), "aria-label": "Close filters", children: _jsx(X, { size: 19 }) })] }), _jsxs("div", { className: "catalog-filter-panel__body", children: [_jsxs("label", { children: ["Brand", _jsx("input", { value: filters.brand, onChange: (event) => setFilters({ ...filters, brand: event.target.value }), placeholder: "Nike, Sony..." })] }), _jsx("div", { className: "catalog-brand-options", children: brands.map((brand) => _jsx("button", { type: "button", className: filters.brand.split(',').includes(brand) ? 'is-active' : '', onClick: () => setFilters({ ...filters, brand }), children: brand }, brand)) }), _jsxs("div", { className: "catalog-filter-row", children: [_jsxs("label", { children: ["Min price", _jsx("input", { inputMode: "numeric", value: filters.minPrice, onChange: (event) => setFilters({ ...filters, minPrice: event.target.value }), placeholder: "\u20B90" })] }), _jsxs("label", { children: ["Max price", _jsx("input", { inputMode: "numeric", value: filters.maxPrice, onChange: (event) => setFilters({ ...filters, maxPrice: event.target.value }), placeholder: "\u20B950,000" })] })] }), _jsxs("label", { children: ["Minimum rating", _jsx(CatalogSelect, { fullWidth: true, ariaLabel: "Minimum rating", value: filters.rating, options: [['', 'Any rating'], ['4', '4★ and above'], ['3', '3★ and above']], onChange: (value) => setFilters({ ...filters, rating: value }) })] }), _jsxs("label", { children: ["Minimum discount", _jsx(CatalogSelect, { fullWidth: true, ariaLabel: "Minimum discount", value: filters.discount, options: [['', 'Any discount'], ['10', '10% and above'], ['20', '20% and above'], ['30', '30% and above']], onChange: (value) => setFilters({ ...filters, discount: value }) })] }), _jsxs("label", { children: ["Tags", _jsx("input", { value: filters.tags, onChange: (event) => setFilters({ ...filters, tags: event.target.value }), placeholder: "running, cotton, wireless" })] }), _jsxs("label", { className: "catalog-check", children: [_jsx("input", { type: "checkbox", checked: filters.inStock, onChange: (event) => setFilters({ ...filters, inStock: event.target.checked }) }), " Only show in-stock products"] })] }), _jsxs("div", { className: "catalog-filter-panel__footer", children: [_jsx("button", { type: "button", onClick: clearFilters, children: "Reset" }), _jsx("button", { type: "button", className: "primary-button", onClick: applyFilters, children: "Show products" })] })] }) })] }));
}
