import React, { useEffect, useState } from 'react';
import StarRating from '../Reviews/StarRating';
import './productratingbadge.css';
import API_BASE_URL from '../../config/api';

function ProductRatingBadge({ productId }) {
    const [rating, setRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRating();
    }, [productId]);

    const fetchRating = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/reviews/product/${productId}/rating`);
            const data = await response.json();

            if (data.success) {
                setRating(parseFloat(data.averageRating));
                setTotalReviews(data.totalReviews);
            }
        } catch (error) {
            console.error('Error fetching rating:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || totalReviews === 0) {
        return null;
    }

    return (
        <div className="product-rating-badge">
            <StarRating rating={rating} readonly size="small" />
            <span className="rating-text">
                {rating} ({totalReviews})
            </span>
        </div>
    );
}

export default ProductRatingBadge;
