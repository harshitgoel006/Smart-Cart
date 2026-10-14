import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { CATEGORY_IMAGES } from '../../../constants';
const homeCategoryOrder = [
    { slugs: ['men'], slug: 'men', imageKey: 'men', label: 'Men' },
    { slugs: ['women'], slug: 'women', imageKey: 'women', label: 'Women' },
    { slugs: ['electronics'], slug: 'electronics', imageKey: 'electronics', label: 'Electronics' },
    { slugs: ['home-living', 'home-and-living', 'home-lifestyle'], slug: 'home-living', imageKey: 'home-living', label: 'Home & Living' },
    { slugs: ['beauty', 'beauty-grooming', 'beauty-and-grooming'], slug: 'beauty', imageKey: 'beauty', label: 'Beauty' },
    { slugs: ['groceries', 'grocery'], slug: 'groceries', imageKey: 'groceries', label: 'Groceries' },
    { slugs: ['sports', 'sports-gym', 'sports-and-gym'], slug: 'sports', imageKey: 'sports', label: 'Sports & Gym' },
    { slugs: ['gifts', 'gift'], slug: 'gifts', imageKey: 'gifts', label: 'Gifts' },
];
export function CategoryShowcase({ categories }) {
    const visibleCategories = homeCategoryOrder
        .map((wantedCategory) => {
        const category = categories.find((item) => wantedCategory.slugs.includes(item.slug));
        return category
            ? { ...category, name: wantedCategory.label }
            : {
                _id: `home-${wantedCategory.slug}`,
                name: wantedCategory.label,
                slug: wantedCategory.slug,
                image: { url: CATEGORY_IMAGES[wantedCategory.imageKey] },
            };
    });
    return (_jsxs("section", { className: "category-showcase section", id: "categories", children: [_jsxs("div", { className: "category-showcase__intro", children: [_jsxs("div", { className: "category-showcase__heading", children: [_jsx("span", { className: "eyebrow", children: "Shop by category" }), _jsx("h2", { children: "Curated finds for the way you live." }), _jsx("p", { children: "Explore thoughtful essentials, made for every mood and everyday moment." })] }), _jsxs(Link, { className: "section-link", to: "/products", children: ["View all categories ", _jsx(ArrowRight, { size: 16, strokeWidth: 1.8 })] })] }), _jsx("div", { className: "category-showcase__grid", children: visibleCategories.map((category) => {
                    // Once uploaded, the Cloudinary image stored in the category wins.
                    // The theme mapping remains a safe fallback for older records.
                    const image = category.image?.url || category.bannerImage?.url || CATEGORY_IMAGES[category.slug];
                    return (_jsxs(Link, { className: "category-tile", to: `/categories/${category.slug}`, children: [image ? _jsx("img", { src: image, alt: category.name, loading: "lazy" }) : _jsx("div", { className: "category-tile__fallback" }), _jsx("span", { className: "category-tile__shade" }), _jsxs("span", { className: "category-tile__content", children: [_jsx("span", { className: "category-tile__eyebrow", children: "Explore" }), _jsx("span", { className: "category-tile__name", children: category.name }), _jsx("span", { className: "category-tile__arrow", children: _jsx(ArrowUpRight, { size: 18, strokeWidth: 1.8 }) })] })] }, category._id));
                }) })] }));
}
