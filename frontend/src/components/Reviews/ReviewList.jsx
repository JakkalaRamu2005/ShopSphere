import React, { useEffect, useState } from 'react';
import StarRating from './StarRating';
import ReviewForm from './ReviewForm';
import { useAuth } from '../../context/AuthContext';
import './reviewlist.css';
import { API_BASE_URL } from '../../config/api';

function ReviewList({ productId }) {
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [ratingDistribution, setRatingDistribution] = useState({});
    const [editingReviewId, setEditingReviewId] = useState(null);

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
                setAverageRating(parseFloat(data.averageRating) || 0);
                setTotalReviews(data.totalReviews || 0);
                setRatingDistribution(data.distribution || {});
            }

        } catch (error) {
            console.error('Error fetching rating:', error);
        }
    };

    const handleDelete = async (reviewId) => {
        if (!window.confirm('Are you sure you want to delete this feedback?')) return;

        try {
            const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            const data = await response.json();
            if (data.success) {
                fetchReviews();
                fetchRating();
            }
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    const handleEditSuccess = () => {
        setEditingReviewId(null);
        fetchReviews();
        fetchRating();
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
                            <div className="rating-stars-info">
                                <StarRating rating={averageRating} readonly size="medium" />
                                <p className="total-reviews-text">{totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}</p>
                            </div>
                        </div>
                        <div className="rating-bars">
                            {[5, 4, 3, 2, 1].map((star) => {
                                const count = ratingDistribution?.[star] || 0;
                                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                                return (
                                    <div key={star} className="rating-bar-item">
                                        <span className="star-label">{star} ★</span>
                                        <div className="progress-bar-container">
                                            <div
                                                className="progress-bar-fill"
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                        <span className="count-label">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
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
                            {editingReviewId === review.id ? (
                                <div className="edit-form-container">
                                    <div className="edit-form-header">
                                        <h4>Edit Your Feedback</h4>
                                        <button
                                            className="close-edit-btn"
                                            onClick={() => setEditingReviewId(null)}
                                        >✕</button>
                                    </div>
                                    <ReviewForm
                                        productId={productId}
                                        existingReview={review}
                                        onReviewSubmitted={handleEditSuccess}
                                    />
                                </div>
                            ) : (
                                <>
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
                                        <div className="review-header-right">
                                            {review.rating > 0 && (
                                                <StarRating rating={review.rating} readonly size="small" />
                                            )}
                                            {(user && (user.id == review.user_id || user.role === 'admin')) && (
                                                <div className="review-actions">
                                                    {user.id == review.user_id && (
                                                        <button
                                                            className="edit-review-btn"
                                                            onClick={() => setEditingReviewId(review.id)}
                                                        >Edit</button>
                                                    )}
                                                    <button
                                                        className="delete-review-btn"
                                                        onClick={() => handleDelete(review.id)}
                                                    >Delete</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {review.review_text && (
                                        <p className="review-text">{review.review_text}</p>
                                    )}
                                    {review.review_image && (
                                        <div className="review-image-container">
                                            <img
                                                src={review.review_image}
                                                alt="Customer review photo"
                                                className="review-image"
                                                onClick={() => window.open(review.review_image, '_blank')}
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ReviewList;
