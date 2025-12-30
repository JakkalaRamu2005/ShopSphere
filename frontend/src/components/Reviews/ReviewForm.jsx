import React, { useState } from 'react';
import StarRating from './StarRating';
import './reviewform.css';
<<<<<<< HEAD
import { API_BASE_URL } from '../../config/api';
=======
import API_BASE_URL from '../../config/api';
>>>>>>> master

function ReviewForm({ productId, onReviewSubmitted, existingReview = null }) {
    const [rating, setRating] = useState(existingReview?.rating || 0);
    const [reviewText, setReviewText] = useState(existingReview?.review_text || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            setError('Please select a rating');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const response = await fetch(`${API_BASE_URL}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    productId,
                    rating,
                    reviewText: reviewText.trim() || null
                })
            });

            const data = await response.json();

            if (data.success) {
                setRating(0);
                setReviewText('');
                if (onReviewSubmitted) {
                    onReviewSubmitted();
                }
            } else {
                setError(data.message || 'Failed to submit review');
            }
        } catch (err) {
            console.error('Error submitting review:', err);
            setError('Failed to submit review. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="review-form-container">
            <h3 className="review-form-title">Write a Review</h3>
            <form onSubmit={handleSubmit} className="review-form">
                <div className="form-group">
                    <label className="form-label">Your Rating *</label>
                    <StarRating
                        rating={rating}
                        onRatingChange={setRating}
                        size="large"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Your Review (Optional)</label>
                    <textarea
                        className="review-textarea"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Share your experience with this product..."
                        rows="5"
                        maxLength="1000"
                    />
                    <span className="char-count">{reviewText.length}/1000</span>
                </div>

                {error && <div className="error-message">{error}</div>}

                <button
                    type="submit"
                    className="submit-review-btn"
                    disabled={isSubmitting || rating === 0}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
            </form>
        </div>
    );
}

export default ReviewForm;
