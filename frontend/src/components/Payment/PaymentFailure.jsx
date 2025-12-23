import React from 'react';
import { useNavigate } from 'react-router-dom';
import './paymentfailure.css';

function PaymentFailure() {
    const navigate = useNavigate();

    return (
        <div className="payment-result-container">
            <div className="payment-result-card failure">
                <div className="failure-icon">✕</div>
                <h1>Payment Failed</h1>
                <p>We couldn't process your payment. Please try again.</p>

                <div className="result-actions">
                    <button
                        onClick={() => navigate('/cart')}
                        className="btn-primary"
                    >
                        Retry Payment
                    </button>
                    <button
                        onClick={() => navigate('/products')}
                        className="btn-secondary"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PaymentFailure;
