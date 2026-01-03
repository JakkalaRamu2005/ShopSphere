import React, { useState } from 'react';
import StarRating from './StarRating';
import './reviewform.css';
import { API_BASE_URL } from '../../config/api';

function ReviewForm({ productId, onReviewSubmitted, existingReview = null }) {
    const [rating, setRating] = useState(existingReview?.rating || 0);
    const [reviewText, setReviewText] = useState(existingReview?.review_text || '');
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(existingReview?.review_image || null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0 && (!reviewText || !reviewText.trim())) {
            setError('Please provide either a rating or a comment');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const url = existingReview
                ? `${API_BASE_URL}/reviews/${existingReview.id}`
                : `${API_BASE_URL}/reviews`;

            const method = existingReview ? 'PUT' : 'POST';

            const formData = new FormData();
            formData.append('productId', productId);
            formData.append('rating', rating);
            formData.append('reviewText', reviewText.trim() || '');
            if (image) {
                formData.append('reviewImage', image);
            }

            const response = await fetch(url, {
                method,
                credentials: 'include',
                body: formData
            });


            const data = await response.json();

            if (data.success) {
                if (!existingReview) {
                    setRating(0);
                    setReviewText('');
                    setImage(null);
                    setPreviewUrl(null);
                    const fileInput = document.getElementById('review-image-upload');
                    if (fileInput) fileInput.value = '';
                }

                // Show success feedback
                const btn = document.querySelector('.submit-review-btn');
                if (btn) {
                    const originalText = btn.innerHTML;
                    btn.innerHTML = '✓ Submitted Successfully!';
                    btn.classList.add('success-state');
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.classList.remove('success-state');
                        if (onReviewSubmitted) onReviewSubmitted();
                    }, 1500);
                } else if (onReviewSubmitted) {
                    onReviewSubmitted();
                }
            } else {
                setError(data.message || 'Failed to submit feedback');
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
            <h3 className="review-form-title">Post a Comment or Review</h3>
            <form onSubmit={handleSubmit} className="review-form">
                <div className="form-group">
                    <label className="form-label">Your Rating (Optional)</label>
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
                        placeholder="Write your comment or share your experience here..."
                        rows="5"
                        maxLength="1000"
                    />
                    <span className="char-count">{reviewText.length}/1000</span>
                </div>

                <div className="form-group">
                    <label className="form-label">Add a Photo (Optional)</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="review-file-input"
                        id="review-image-upload"
                    />
                    {previewUrl && (
                        <div className="image-preview-container">
                            <img src={previewUrl} alt="Review preview" className="review-image-preview" />
                            <button
                                type="button"
                                className="remove-image-btn"
                                onClick={() => {
                                    setImage(null);
                                    setPreviewUrl(null);
                                    document.getElementById('review-image-upload').value = '';
                                }}
                            >
                                Remove
                            </button>
                        </div>
                    )}
                </div>


                {error && <div className="error-message">{error}</div>}

                <button
                    type="submit"
                    className="submit-review-btn"
                    disabled={isSubmitting || (rating === 0 && !reviewText.trim())}
                >
                    {isSubmitting ? 'Submitting...' : (existingReview ? 'Update Feedback' : 'Submit Feedback')}
                </button>
            </form>
        </div>
    );
}

export default ReviewForm;
