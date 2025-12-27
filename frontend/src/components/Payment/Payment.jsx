import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import API_BASE_URL from '../../config/api';
import './payment.css';

function Payment() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);

    useEffect(() => {
        // Get order details from location state
        if (location.state && location.state.orderDetails) {
            setOrderDetails(location.state.orderDetails);
        } else {
            navigate('/cart');
        }

        // Load Razorpay script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, [location, navigate]);

    const handlePayment = async () => {
        if (!orderDetails) return;

        setLoading(true);

        try {
            // Create Razorpay order
            const response = await fetch(`${API_BASE_URL}/payment/create-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    amount: orderDetails.totalAmount,
                    currency: 'INR'
                })
            });

            const data = await response.json();

            if (!data.success) {
                alert('Failed to create payment order');
                setLoading(false);
                return;
            }

            // Razorpay options
            const options = {
                key: data.key,
                amount: data.order.amount,
                currency: data.order.currency,
                name: 'ShopEase',
                description: `Order #${orderDetails.orderId}`,
                order_id: data.order.id,
                handler: async function (response) {
                    // Payment successful, verify on backend
                    await verifyPayment(response);
                },
                prefill: {
                    name: user?.name || '',
                    email: user?.email || '',
                },
                theme: {
                    color: '#667eea'
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
            setLoading(false);

        } catch (error) {
            console.error('Payment error:', error);
            alert('Payment failed. Please try again.');
            setLoading(false);
        }
    };

    const verifyPayment = async (paymentResponse) => {
        try {
            const response = await fetch(`${API_BASE_URL}/payment/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    razorpay_order_id: paymentResponse.razorpay_order_id,
                    razorpay_payment_id: paymentResponse.razorpay_payment_id,
                    razorpay_signature: paymentResponse.razorpay_signature,
                    order_id: orderDetails.orderId
                })
            });

            const data = await response.json();

            if (data.success) {
                navigate('/payment/success', {
                    state: { orderId: orderDetails.orderId }
                });
            } else {
                navigate('/payment/failure');
            }
        } catch (error) {
            console.error('Verification error:', error);
            navigate('/payment/failure');
        }
    };

    if (!orderDetails) {
        return <div className="payment-loading">Loading...</div>;
    }

    return (
        <div className="payment-container">
            <div className="payment-card">
                <h1>Complete Your Payment</h1>

                <div className="order-summary">
                    <h2>Order Summary</h2>
                    <div className="summary-row">
                        <span>Order ID:</span>
                        <strong>#{orderDetails.orderId}</strong>
                    </div>
                    <div className="summary-row">
                        <span>Total Amount:</span>
                        <strong className="amount">₹{orderDetails.totalAmount.toFixed(2)}</strong>
                    </div>
                </div>

                <div className="payment-info">
                    <p>🔒 Secure payment powered by Razorpay</p>
                    <p>✓ Test Mode: Use test card details</p>
                    <div className="test-card-info">
                        <h3>Test Card Details:</h3>
                        <p>Card Number: 4111 1111 1111 1111</p>
                        <p>CVV: Any 3 digits</p>
                        <p>Expiry: Any future date</p>
                    </div>
                </div>

                <button
                    onClick={handlePayment}
                    disabled={loading}
                    className="pay-btn"
                >
                    {loading ? 'Processing...' : `Pay ₹${orderDetails.totalAmount.toFixed(2)}`}
                </button>

                <button
                    onClick={() => navigate('/orders')}
                    className="cancel-btn"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default Payment;
