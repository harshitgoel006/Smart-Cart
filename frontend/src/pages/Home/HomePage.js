import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { CategoryShowcase } from '../../components/home/CategoryShowcase/CategoryShowcase';
import { AiRecommendations } from '../../components/home/AiRecommendations/AiRecommendations';
import { BrandsShowcase } from '../../components/home/BrandsShowcase/BrandsShowcase';
import { EditorialFeature } from '../../components/home/EditorialFeature/EditorialFeature';
import { HeroSection } from '../../components/home/HeroSection/HeroSection';
import { OfferStrip } from '../../components/home/OfferStrip/OfferStrip';
import { Testimonials } from '../../components/home/Testimonials/Testimonials';
import { ProductSection } from '../../components/product/ProductCarousel/ProductCarousel';
import { getJson } from '../../services/apiClient';
import { useSiteSettings } from '../../app/providers/SiteSettingsProvider';
export function HomePage() {
    const [banners, setBanners] = useState([]);
    const [categories, setCategories] = useState([]);
    const [trending, setTrending] = useState([]);
    const [newArrivals, setNewArrivals] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState('');
    const siteSettings = useSiteSettings();
    const sectionEnabled = (key) => siteSettings.homepage?.sections?.find((section) => section.key === key)?.enabled !== false;
    useEffect(() => {
        Promise.all([
            getJson('/banners'),
            getJson('/categories'),
            getJson('/products/trending?limit=8'),
            getJson('/products/new-arrivals?limit=8'),
            getJson('/products/top-rated?limit=8'),
        ])
            .then(([loadedBanners, loadedCategories, trendingProducts, arrivals, rated]) => {
            setBanners(Array.isArray(loadedBanners) ? loadedBanners : []);
            setCategories(Array.isArray(loadedCategories) ? loadedCategories : []);
            setTrending(Array.isArray(trendingProducts) ? trendingProducts : []);
            setNewArrivals(Array.isArray(arrivals) ? arrivals : []);
            setTopRated(Array.isArray(rated) ? rated : []);
        })
            .catch((error) => setApiError(error.message))
            .finally(() => setLoading(false));
    }, []);
    const visibleCategories = useMemo(() => {
        const priority = new Map([
            ['men', 1],
            ['women', 2],
            ['electronics', 3],
            ['home-and-living', 4],
            ['beauty-and-grooming', 5],
            ['groceries', 6],
            ['sports-and-gym', 7],
            ['gifts', 8],
        ]);
        return categories
            .filter((category) => category.slug && !category.parent && (category.productCount == null || category.productCount > 0))
            .sort((left, right) => {
            const countDifference = (right.productCount || 0) - (left.productCount || 0);
            return countDifference || (priority.get(left.slug) || 99) - (priority.get(right.slug) || 99);
        })
            .slice(0, 8);
    }, [categories]);
    return (_jsxs("main", { children: [_jsx(HeroSection, { banners: banners }), sectionEnabled('offers') && _jsx(OfferStrip, {}), apiError && (_jsx("div", { className: "api-notice", children: "Catalog connection is taking a moment. Refresh once the backend is awake." })), sectionEnabled('categories') && _jsx(CategoryShowcase, { categories: visibleCategories }), sectionEnabled('trending') && _jsx("div", { id: "trending-products", children: _jsx(ProductSection, { eyebrow: "Trending now", title: "What\u2019s moving fast.", subtitle: "Popular picks, standout essentials, and everyday favourites shoppers are reaching for today.", products: trending, loading: loading, linkTo: "/products?sort=bestSelling", linkText: "Shop trending", variant: "featured" }) }), sectionEnabled('ai-recommendations') && siteSettings.features?.aiRecommendations !== false && _jsx(AiRecommendations, { fallbackProducts: trending }), sectionEnabled('new-arrivals') && _jsx("div", { id: "new-arrivals", children: _jsx(ProductSection, { eyebrow: "Freshly picked", title: "New arrivals", subtitle: "Just in: thoughtful essentials and fresh favourites for the days ahead.", products: newArrivals, loading: loading, linkTo: "/products?sort=newest", linkText: "View new arrivals", variant: "featured" }) }), sectionEnabled('editorial') && _jsx("div", { className: "editorial-transition", children: _jsx(EditorialFeature, {}) }), sectionEnabled('top-rated') && _jsx("div", { id: "top-rated", children: _jsx(ProductSection, { eyebrow: "Top rated", title: "Loved by the community", subtitle: "Discover tried-and-loved essentials, rated highly by shoppers who know what works.", products: topRated, loading: loading, linkTo: "/products?sort=ratingHighToLow", linkText: "View top rated", variant: "featured" }) }), sectionEnabled('brands') && _jsx(BrandsShowcase, {}), sectionEnabled('testimonials') && _jsx(Testimonials, {})] }));
}
