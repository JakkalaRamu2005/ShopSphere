import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import './productreviews.css';
import { API_BASE_URL } from '../../config/api';

function ProductReviews({ productId }) {
    const { user } = useAuth();
    const [hasReviewed, setHasReviewed] = useState(false);
    const [userReview, setUserReview] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        if (user) {
            checkUserReview();
        }
    }, [productId, user]);

    const checkUserReview = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/reviews/check/${productId}`, {
                credentials: 'include'
            });

            const data = await response.json();
            if (data.success) {
                setHasReviewed(data.hasReviewed);
                setUserReview(data.review);
            }
        } catch (error) {
            console.error('Error checking user review:', error);
        }
    };

    const handleReviewSubmitted = () => {
        setShowForm(false);
        setRefreshKey(prev => prev + 1);
        checkUserReview();
    };

    return (
        <div className="product-reviews-section">
            {user ? (
                <div className="review-action-section">
                    {!showForm ? (
                        <button
                            className="write-review-btn"
                            onClick={() => setShowForm(true)}
                        >
                            ✍️ Post a Comment
                        </button>
                    ) : (
                        <div className="review-form-wrapper">
                            <button
                                className="cancel-review-btn"
                                onClick={() => setShowForm(false)}
                            >
                                ✕ Close
                            </button>
                            <ReviewForm
                                productId={productId}
                                onReviewSubmitted={handleReviewSubmitted}
                            />
                        </div>
                    )}
                </div>
            ) : (
                <div className="login-prompt">
                    <p className="login-prompt-icon">🔒</p>
                    <p className="login-prompt-text">Please log in to write a review</p>
                </div>
            )}

            <ReviewList key={refreshKey} productId={productId} />
        </div>
    );
}

export default ProductReviews;
