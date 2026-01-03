import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config/api';
import { useCart } from '../../context/CartContext';
import { FaFire, FaShoppingCart } from 'react-icons/fa';
import './DealsSection.css';



function DealsSection({ limit = 4 }) {
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/products`);
                const data = await response.json();

                if (data.success && data.products) {
                    // Get products with highest ratings for deals
                    const topRated = [...data.products]
                        .sort((a, b) => parseFloat(b.rating_rate) - parseFloat(a.rating_rate))
                        .slice(0, limit)
                        .map(p => ({
                            id: p.id,
                            title: p.title,
                            price: parseFloat(p.price) / 83,
                            image: (p.images && p.images.length > 0) ? p.images[0] : 'https://via.placeholder.com/300',
                            rating: {
                                rate: parseFloat(p.rating_rate) || 4.5,
                                count: parseInt(p.rating_count) || 100
                            }
                        }));
                    setDeals(topRated);
                }
            } catch (error) {
                console.error('Error fetching deals:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDeals();
    }, [limit]);

    const handleProductClick = (id) => {
        navigate(`/products/${id}`);
    };

    const handleAddToCart = (e, product) => {
        e.stopPropagation();
        addToCart(product);
    };

    if (loading) {
        return (
            <div className="deals-grid">
                {[...Array(limit)].map((_, i) => (
                    <div key={i} className="deal-skeleton">
                        <div className="skeleton-image"></div>
                        <div className="skeleton-text"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="deals-grid">
            {deals.map((deal) => {
                const priceINR = deal.price * 83;
                const discount = Math.floor(Math.random() * 40) + 30; // 30-70% off for deals
                const discountedPrice = priceINR * (1 - discount / 100);

                return (
                    <div
                        key={deal.id}
                        className="deal-card"
                        onClick={() => handleProductClick(deal.id)}
                    >
                        {/* Hot Deal Badge */}
                        <div className="hot-deal-badge">
                            <FaFire />
                            <span>HOT</span>
                        </div>

                        {/* Discount Badge */}
                        <div className="deal-discount-badge">
                            {discount}% OFF
                        </div>

                        {/* Product Image */}
                        <div className="deal-image">
                            <img src={deal.image} alt={deal.title} />
                        </div>

                        {/* Product Info */}
                        <div className="deal-info">
                            <h3 className="deal-title">{deal.title}</h3>

                            {/* Price */}
                            <div className="deal-price">
                                <div className="price-row">
                                    <span className="deal-current-price">₹{discountedPrice.toFixed(0)}</span>
                                    <span className="deal-original-price">₹{priceINR.toFixed(0)}</span>
                                </div>
                                <div className="deal-savings">
                                    Save ₹{(priceINR - discountedPrice).toFixed(0)}
                                </div>
                            </div>

                            {/* Rating */}
                            <div className="deal-rating">
                                <span className="rating-stars">★ {deal.rating.rate}</span>
                                <span className="rating-count">({deal.rating.count})</span>
                            </div>

                            {/* Add to Cart Button */}
                            <button
                                className="deal-add-to-cart"
                                onClick={(e) => handleAddToCart(e, deal)}
                            >
                                <FaShoppingCart />
                                Add to Cart
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default DealsSection;
