import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './paymentsuccess.css';

function PaymentSuccess() {
    const navigate = useNavigate();
    const location = useLocation();
    const orderId = location.state?.orderId;

    return (
        <div className="payment-result-container">
            <div className="payment-result-card success">
                <div className="success-icon">✓</div>
                <h1>Payment Successful!</h1>
                <p>Your payment has been processed successfully.</p>

                {orderId && (
                    <div className="order-info">
                        <p>Order ID: <strong>#{orderId}</strong></p>
                    </div>
                )}

                <div className="result-actions">
                    <button
                        onClick={() => navigate('/orders')}
                        className="btn-primary"
                    >
                        View Orders
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

export default PaymentSuccess;
