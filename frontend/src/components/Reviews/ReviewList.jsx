import React, { useEffect, useState } from 'react';
import StarRating from './StarRating';
import './reviewlist.css';
<<<<<<< HEAD
import { API_BASE_URL } from '../../config/api';
=======
import API_BASE_URL from '../../config/api';
>>>>>>> master

function ReviewList({ productId }) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);

    useEffect(() => {
        fetchReviews();
        fetchRating();
    }, [productId]);

    const fetchReviews = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/reviews/product/${productId}`);
            const data = await response.json();

            if (data.success) {
                setReviews(data.reviews);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRating = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/reviews/product/${productId}/rating`);
            const data = await response.json();

            if (data.success) {
                setAverageRating(parseFloat(data.averageRating));
                setTotalReviews(data.totalReviews);
            }
        } catch (error) {
            console.error('Error fetching rating:', error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="reviews-loading">
                <div className="loading-spinner"></div>
                <p>Loading reviews...</p>
            </div>
        );
    }

    return (
        <div className="review-list-container">
            <div className="reviews-header">
                <h3 className="reviews-title">Customer Reviews</h3>
                {totalReviews > 0 && (
                    <div className="rating-summary">
                        <div className="average-rating">
                            <span className="rating-number">{averageRating}</span>
                            <StarRating rating={averageRating} readonly size="medium" />
                        </div>
                        <p className="total-reviews">Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}</p>
                    </div>
                )}
            </div>

            {reviews.length === 0 ? (
                <div className="no-reviews">
                    <p className="no-reviews-icon">📝</p>
                    <p className="no-reviews-text">No reviews yet. Be the first to review this product!</p>
                </div>
            ) : (
                <div className="reviews-list">
                    {reviews.map((review) => (
                        <div key={review.id} className="review-card">
                            <div className="review-header">
                                <div className="reviewer-info">
                                    <div className="reviewer-avatar">
                                        {review.user_name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="reviewer-name">{review.user_name}</h4>
                                        <p className="review-date">{formatDate(review.created_at)}</p>
                                    </div>
                                </div>
                                <StarRating rating={review.rating} readonly size="small" />
                            </div>
                            {review.review_text && (
                                <p className="review-text">{review.review_text}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ReviewList;
