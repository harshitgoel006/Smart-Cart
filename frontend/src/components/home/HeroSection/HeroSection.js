import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
const cloudinaryHeroImages = {
    fashion: 'https://res.cloudinary.com/harshit-goel/image/upload/v1790178458/SmartCart/home-hero-v2/cjtqvx1t68p9x7ktfjtp.png',
    gadgets: 'https://res.cloudinary.com/harshit-goel/image/upload/v1790178458/SmartCart/home-hero-v2/zmb8lnr1qnxxoyhj7sl0.png',
    homeLiving: 'https://res.cloudinary.com/harshit-goel/image/upload/v1790178458/SmartCart/home-hero-v2/foblsayxuvczyilfcels.png',
};
const fallbackSlides = [
    {
        eyebrow: 'The style edit',
        title: 'Style that feels effortlessly you.',
        description: 'Timeless layers, standout accessories, and everyday pieces worth keeping.',
        image: cloudinaryHeroImages.fashion,
        cta: 'Shop fashion',
        href: '/categories/women',
    },
    {
        eyebrow: 'Smart everyday upgrades',
        title: 'Better tech for your everyday rhythm.',
        description: 'Useful gadgets, thoughtful accessories, and technology with a little more style.',
        image: cloudinaryHeroImages.gadgets,
        cta: 'Shop electronics',
        href: '/categories/electronics',
    },
    {
        eyebrow: 'Home, made warmer',
        title: 'Make space for better living.',
        description: 'Warm textures, thoughtful details, and everyday comforts for the way you live.',
        image: cloudinaryHeroImages.homeLiving,
        cta: 'Shop home & living',
        href: '/categories/home-and-living',
    },
];
export function HeroSection({ banners = [] }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const slides = useMemo(() => {
        return fallbackSlides.map((fallbackSlide, index) => {
            const banner = banners[index];
            return {
                eyebrow: banner ? 'SmartCart selection' : fallbackSlide.eyebrow,
                title: banner?.title || fallbackSlide.title,
                description: banner?.tagline || fallbackSlide.description,
                image: banner?.image?.url || fallbackSlide.image,
                cta: banner ? 'Shop now' : fallbackSlide.cta,
                href: banner?.redirectLink || fallbackSlide.href,
            };
        });
    }, [banners]);
    useEffect(() => {
        setActiveIndex(0);
    }, [slides.length]);
    useEffect(() => {
        if (slides.length < 2) {
            return;
        }
        const timer = window.setInterval(() => {
            setActiveIndex((current) => (current + 1) % slides.length);
        }, 6500);
        return () => window.clearInterval(timer);
    }, [slides.length]);
    const activeSlide = slides[activeIndex] || slides[0];
    const showPrevious = () => {
        setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
    };
    const showNext = () => {
        setActiveIndex((current) => (current + 1) % slides.length);
    };
    return (_jsxs("section", { className: "hero-slider", "aria-label": "Featured SmartCart collections", children: [_jsx("div", { className: "hero-slider__media", children: _jsx("img", { src: activeSlide.image, alt: "" }) }, activeSlide.image), _jsx("div", { className: "hero-slider__overlay" }), _jsxs("div", { className: "hero-slider__content", children: [_jsx("span", { className: "eyebrow hero-slider__eyebrow", children: activeSlide.eyebrow }), _jsx("h1", { children: activeSlide.title }), _jsx("p", { children: activeSlide.description }), _jsxs(Link, { className: "primary-button", to: activeSlide.href, children: [activeSlide.cta, _jsx(ArrowRight, { size: 16, "aria-hidden": "true" })] })] }), slides.length > 1 && (_jsxs(_Fragment, { children: [_jsx("button", { className: "hero-slider__control hero-slider__control--previous", type: "button", onClick: showPrevious, "aria-label": "Previous slide", children: _jsx(ChevronLeft, { size: 20 }) }), _jsx("button", { className: "hero-slider__control hero-slider__control--next", type: "button", onClick: showNext, "aria-label": "Next slide", children: _jsx(ChevronRight, { size: 20 }) }), _jsx("div", { className: "hero-slider__dots", "aria-label": "Hero slides", children: slides.map((slide, index) => (_jsx("button", { className: index === activeIndex ? 'is-active' : '', type: "button", onClick: () => setActiveIndex(index), "aria-label": `Show slide ${index + 1}`, "aria-current": index === activeIndex ? 'true' : undefined }, `${slide.title}-${index}`))) })] }))] }));
}
