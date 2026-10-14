import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CATEGORY_IMAGES } from '../../../constants';
const slides = [
    {
        eyebrow: 'The smarter setup',
        title: 'Tech that',
        accent: 'keeps you moving.',
        description: 'Thoughtful devices and everyday tools that make your routines feel effortless.',
        href: '/categories/electronics',
        image: 'https://res.cloudinary.com/harshit-goel/image/upload/v1790334527/SmartCart/editorial/image_k0esv1.png',
        alt: 'Laptop, tablet, headphones, camera and smart devices arranged on a wooden desk',
    },
    {
        eyebrow: 'The finishing touch',
        title: 'Details that',
        accent: 'make the look.',
        description: 'Signature accessories and everyday essentials chosen to add character to your style.',
        href: '/categories/men',
        image: 'https://res.cloudinary.com/harshit-goel/image/upload/v1790334529/SmartCart/editorial/image2_wpkhcp.png',
        alt: 'Watches, fragrances, leather goods, sunglasses and accessories arranged in a warm editorial setting',
    },
    {
        eyebrow: 'For little ones',
        title: 'Gifts that',
        accent: 'spark bigger smiles.',
        description: 'Thoughtful finds for playtime, celebrations, and all the little moments worth remembering.',
        href: '/categories/gifts',
        image: CATEGORY_IMAGES.gifts,
        alt: 'Thoughtful gifts arranged in a warm editorial setting',
    },
];
export function EditorialFeature() {
    const [activeIndex, setActiveIndex] = useState(0);
    const activeSlide = slides[activeIndex];
    useEffect(() => {
        const timer = window.setInterval(() => {
            setActiveIndex((current) => (current + 1) % slides.length);
        }, 6500);
        return () => window.clearInterval(timer);
    }, []);
    const move = (direction) => {
        setActiveIndex((current) => (current + direction + slides.length) % slides.length);
    };
    return (_jsxs("section", { className: "editorial editorial--feature section", id: "offers", children: [_jsxs("div", { className: "editorial__copy", children: [_jsx("span", { className: "eyebrow", children: activeSlide.eyebrow }), _jsxs("h2", { children: [activeSlide.title, _jsx("br", {}), _jsx("em", { children: activeSlide.accent })] }), _jsx("p", { children: activeSlide.description }), _jsxs(Link, { className: "primary-button", to: activeSlide.href, children: ["Explore the edit ", _jsx(ArrowRight, { size: 19, strokeWidth: 2, "aria-hidden": "true" })] }), _jsxs("div", { className: "editorial__details", children: [_jsx("span", { children: "Thoughtfully selected" }), _jsx("span", { children: "Everyday essentials" })] })] }, `${activeIndex}-copy`), _jsxs("div", { className: "editorial__image", children: [_jsx("img", { src: activeSlide.image, alt: activeSlide.alt, loading: "lazy" }), _jsxs("div", { className: "editorial__controls", children: [_jsx("button", { type: "button", onClick: () => move(-1), "aria-label": "Previous editorial slide", children: _jsx(ArrowLeft, { size: 17, strokeWidth: 1.8 }) }), _jsx("button", { type: "button", onClick: () => move(1), "aria-label": "Next editorial slide", children: _jsx(ArrowRight, { size: 17, strokeWidth: 1.8 }) })] }), _jsx("div", { className: "editorial__dots", "aria-label": "Editorial slides", children: slides.map((slide, index) => (_jsx("button", { type: "button", className: index === activeIndex ? 'is-active' : '', onClick: () => setActiveIndex(index), "aria-label": `Show ${slide.eyebrow}` }, slide.eyebrow))) })] }, `${activeIndex}-image`)] }));
}
