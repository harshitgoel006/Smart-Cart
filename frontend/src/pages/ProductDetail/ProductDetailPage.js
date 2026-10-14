import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getJson, sendJson } from '../../services/apiClient';
import { formatPrice, getNumber, productImage } from '../../utils/formatters';
import { ProductSection } from '../../components/product/ProductCarousel/ProductCarousel';
import { useAuth } from '../../app/providers/AuthProvider';
export function ProductDetailPage() {
    const productId = useParams().id || '';
    const navigate = useNavigate();
    const { user } = useAuth();
    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [selectedImage, setSelectedImage] = useState('');
    const [question, setQuestion] = useState('');
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewTitle, setReviewTitle] = useState('');
    const [reviewComment, setReviewComment] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [reviewSending, setReviewSending] = useState(false);
    useEffect(() => {
        let cancelled = false;
        Promise.all([
            getJson(`/products/product/${productId}`),
            getJson(`/products/product/${productId}/related?limit=4`),
            getJson(`/products/product/${productId}/reviews?limit=8`),
            getJson(`/products/product/${productId}/qna?limit=8`),
        ]).then(([data, relatedData, reviewData, qnaData]) => {
            if (cancelled)
                return;
            setProduct(data);
            setSelectedImage(productImage(data));
            setRelated(Array.isArray(relatedData) ? relatedData : []);
            setReviews(reviewData.reviews || []);
            setQuestions(qnaData.qna || []);
        }).catch((error) => setMessage(error.message)).finally(() => { if (!cancelled)
            setLoading(false); });
        return () => { cancelled = true; };
    }, [productId]);
    if (loading)
        return _jsx("main", { className: "detail-page section", children: _jsx("div", { className: "product-skeleton detail-skeleton" }) });
    if (!product)
        return _jsxs("main", { className: "section empty-page", children: [_jsx("h1", { children: "Product unavailable" }), _jsx("p", { children: message }), _jsx(Link, { className: "primary-button", to: "/products", children: "Back to products" })] });
    const images = product.images?.map((image) => image.url).filter(Boolean) || [productImage(product)];
    const price = getNumber(product.finalPrice || product.price);
    const addToCart = async () => { try {
        await sendJson('/carts/add', 'POST', { productId: product._id, quantity: 1 });
        window.dispatchEvent(new CustomEvent('smartcart:cart-updated'));
        navigate('/cart');
    }
    catch (error) {
        setMessage(error.message);
    } };
    const askQuestion = async (event) => { event.preventDefault(); if (!question.trim())
        return; setSending(true); setMessage(''); try {
        await sendJson(`/products/product/${product._id}/qna`, 'POST', { question });
        setQuestions((current) => [{ _id: `pending-${Date.now()}`, question, status: 'pending', createdAt: new Date().toISOString(), user: { fullname: user?.fullname || 'You' } }, ...current]);
        setQuestion('');
        setMessage('Your question has been sent to the seller.');
    }
    catch (error) {
        setMessage(error.message);
    }
    finally {
        setSending(false);
    } };
    const submitReview = async (event) => { event.preventDefault(); setReviewSending(true); setMessage(''); try {
        await sendJson(`/products/product/${product._id}/reviews`, 'POST', { rating: reviewRating, title: reviewTitle, comment: reviewComment });
        setReviewTitle('');
        setReviewComment('');
        setMessage('Review submitted for approval.');
    }
    catch (error) {
        setMessage(error.message);
    }
    finally {
        setReviewSending(false);
    } };
    return _jsxs("main", { className: "detail-page section", children: [_jsxs("div", { className: "detail-layout", children: [_jsxs("div", { className: "gallery", children: [_jsx("div", { className: "gallery-main", children: _jsx("img", { src: selectedImage || productImage(product), alt: product.name }) }), _jsx("div", { className: "gallery-thumbs", children: images.map((image) => _jsx("button", { className: selectedImage === image ? 'selected' : '', onClick: () => setSelectedImage(image), children: _jsx("img", { src: image, alt: "" }) }, image)) })] }), _jsxs("div", { className: "detail-copy", children: [_jsx("span", { className: "eyebrow", children: product.brand || 'SmartCart selection' }), _jsx("h1", { children: product.name }), _jsxs("div", { className: "detail-rating", children: ["\u2605 ", Number(product.ratings || 0).toFixed(1), " ", _jsxs("span", { children: ["(", product.reviews || 0, " reviews)"] })] }), _jsxs("div", { className: "detail-price", children: [formatPrice(price), " ", getNumber(product.price) > price && _jsx("del", { children: formatPrice(product.price) })] }), _jsx("p", { children: product.description }), _jsx("div", { className: "stock-note", children: (product.stock || 0) > 0 ? `In stock - ${product.stock} available` : 'Currently out of stock' }), _jsxs("button", { className: "primary-button detail-add", onClick: addToCart, disabled: !product.stock, children: ["Add to bag ", _jsx("span", { children: "\u2197" })] }), message && _jsx("div", { className: "inline-message", children: message }), _jsxs("div", { className: "detail-promises", children: [_jsx("span", { children: "Free delivery over Rs 999" }), _jsx("span", { children: "Easy 7-day returns" }), _jsx("span", { children: "Secure checkout" })] })] })] }), _jsxs("section", { className: "detail-feedback", children: [_jsxs("div", { className: "feedback-column", children: [_jsx("div", { className: "section-heading", children: _jsxs("div", { children: [_jsx("span", { className: "eyebrow", children: "Verified voices" }), _jsx("h2", { children: "Reviews" })] }) }), user && _jsxs("form", { className: "review-form", onSubmit: submitReview, children: [_jsx("div", { className: "review-stars", children: [1, 2, 3, 4, 5].map((star) => _jsx("button", { type: "button", className: star <= reviewRating ? 'selected' : '', onClick: () => setReviewRating(star), children: "\u2605" }, star)) }), _jsx("input", { value: reviewTitle, onChange: (event) => setReviewTitle(event.target.value), placeholder: "Review title" }), _jsx("textarea", { value: reviewComment, onChange: (event) => setReviewComment(event.target.value), placeholder: "What did you think?", required: true, minLength: 5 }), _jsxs("button", { className: "primary-button", disabled: reviewSending, children: [reviewSending ? 'Submitting...' : 'Submit review', " ", _jsx("span", { children: "\u2197" })] })] }), reviews.length ? reviews.map((review) => _jsxs("article", { className: "feedback-card", children: [_jsxs("div", { className: "feedback-card__top", children: [_jsx("strong", { children: '*'.repeat(review.rating) }), _jsx("small", { children: review.user?.fullname || review.user?.username || 'SmartCart customer' })] }), review.title && _jsx("h3", { children: review.title }), _jsx("p", { children: review.comment || 'A thoughtful purchase.' }), review.isVerifiedPurchase && _jsx("span", { className: "eyebrow", children: "Verified purchase" })] }, review._id)) : _jsx("div", { className: "section-empty", children: "No reviews yet. Be the first to share your experience after delivery." })] }), _jsxs("div", { className: "feedback-column", children: [_jsx("div", { className: "section-heading", children: _jsxs("div", { children: [_jsx("span", { className: "eyebrow", children: "Ask the seller" }), _jsx("h2", { children: "Questions" })] }) }), user ? _jsxs("form", { className: "question-form", onSubmit: askQuestion, children: [_jsx("textarea", { value: question, onChange: (event) => setQuestion(event.target.value), placeholder: "Ask about size, material, delivery or care", minLength: 5, required: true }), _jsxs("button", { className: "primary-button", disabled: sending, children: [sending ? 'Sending...' : 'Ask question', " ", _jsx("span", { children: "\u2197" })] })] }) : _jsx("p", { className: "muted", children: "Sign in to ask the seller a question." }), questions.length ? questions.map((item) => _jsxs("article", { className: "feedback-card", children: [_jsxs("strong", { children: ["Q. ", item.question] }), item.answer ? _jsxs("p", { children: [_jsx("b", { children: "A." }), " ", item.answer] }) : _jsx("small", { children: "Awaiting seller response" })] }, item._id)) : _jsx("div", { className: "section-empty", children: "No questions yet." })] })] }), related.length > 0 && _jsx(ProductSection, { title: "You may also like", subtitle: "More considered finds from this collection.", products: related, loading: false })] });
}
