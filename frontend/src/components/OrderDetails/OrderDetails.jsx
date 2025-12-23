import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config/api";
import "./orderdetails.css";

/**
 * OrderDetails Component
 * Displays detailed information about a specific order
 * Shows all items, shipping address, payment method, and order status
 */
function OrderDetails() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch order details on component mount
    useEffect(() => {
        fetchOrderDetails();
    }, [orderId]);

    /**
     * Fetch specific order details
     */
    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setOrder(data.order);
            } else {
                setError(data.message || "Failed to fetch order details");
            }
        } catch (err) {
            console.error("Fetch order details error:", err);
            setError("Unable to load order details. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    /**
     * Format date to readable string
     */
    const formatDate = (dateString) => {
        const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        };
        return new Date(dateString).toLocaleDateString("en-IN", options);
    };

    /**
     * Get status badge class
     */
    const getStatusClass = (status) => {
        const statusClasses = {
            pending: "status-pending",
            processing: "status-processing",
            shipped: "status-shipped",
            delivered: "status-delivered",
            cancelled: "status-cancelled",
        };
        return statusClasses[status.toLowerCase()] || "status-default";
    };

    /**
     * Format status text
     */
    const formatStatus = (status) => {
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    /**
     * Calculate item subtotal
     */
    const calculateItemSubtotal = (price, quantity) => {
        return (parseFloat(price) * quantity).toFixed(2);
    };

    // Loading state
    if (loading) {
        return (
            <div className="order-details-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading order details...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="order-details-container">
                <div className="error-container">
                    <h2>⚠️ Error</h2>
                    <p>{error}</p>
                    <button onClick={() => navigate("/orders")} className="btn-back">
                        Back to Orders
                    </button>
                </div>
            </div>
        );
    }

    // No order found
    if (!order) {
        return (
            <div className="order-details-container">
                <div className="error-container">
                    <h2>Order Not Found</h2>
                    <p>The order you're looking for doesn't exist.</p>
                    <button onClick={() => navigate("/orders")} className="btn-back">
                        Back to Orders
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="order-details-container">
            {/* Back Button */}
            <button onClick={() => navigate("/orders")} className="btn-back-arrow">
                ← Back to Orders
            </button>

            {/* Order Header */}
            <div className="order-details-header">
                <div className="order-header-info">
                    <h1>Order #{order.id}</h1>
                    <p className="order-date">Placed on {formatDate(order.created_at)}</p>
                </div>
                <div className="order-status-badge">
                    <span className={`status-badge ${getStatusClass(order.order_status)}`}>
                        {formatStatus(order.order_status)}
                    </span>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="order-details-grid">
                {/* Left Column - Order Items */}
                <div className="order-items-section">
                    <h2>Order Items</h2>
                    <div className="order-items-list">
                        {order.items.map((item, index) => (
                            <div key={index} className="order-item-card">
                                <div className="item-image-wrapper">
                                    <img src={item.image} alt={item.title} />
                                </div>
                                <div className="item-details">
                                    <h3>{item.title}</h3>
                                    <div className="item-meta">
                                        <span className="item-price">₹{parseFloat(item.price).toFixed(2)}</span>
                                        <span className="item-quantity">Quantity: {item.quantity}</span>
                                    </div>
                                    <div className="item-subtotal">
                                        Subtotal: <strong>₹{calculateItemSubtotal(item.price, item.quantity)}</strong>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column - Order Summary & Info */}
                <div className="order-info-section">
                    {/* Order Summary */}
                    <div className="info-card">
                        <h2>Order Summary</h2>
                        <div className="summary-row">
                            <span>Items Total:</span>
                            <span>₹{parseFloat(order.total_amount).toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping:</span>
                            <span className="free-shipping">FREE</span>
                        </div>
                        <div className="summary-divider"></div>
                        <div className="summary-row summary-total">
                            <strong>Total Amount:</strong>
                            <strong>₹{parseFloat(order.total_amount).toFixed(2)}</strong>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="info-card">
                        <h2>Shipping Address</h2>
                        <div className="address-details">
                            <p><strong>{order.shipping_address.fullName}</strong></p>
                            <p>{order.shipping_address.address}</p>
                            <p>
                                {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}
                            </p>
                            <p>Phone: {order.shipping_address.phone}</p>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="info-card">
                        <h2>Payment Method</h2>
                        <div className="payment-details">
                            <p className="payment-method-text">
                                {order.payment_method === "cod" ? "Cash on Delivery" : order.payment_method}
                            </p>
                        </div>
                    </div>

                    {/* Order Timeline */}
                    <div className="info-card">
                        <h2>Order Timeline</h2>
                        <div className="timeline">
                            <div className="timeline-item active">
                                <div className="timeline-dot"></div>
                                <div className="timeline-content">
                                    <p className="timeline-title">Order Placed</p>
                                    <p className="timeline-date">{formatDate(order.created_at)}</p>
                                </div>
                            </div>
                            {order.order_status !== "pending" && (
                                <div className="timeline-item active">
                                    <div className="timeline-dot"></div>
                                    <div className="timeline-content">
                                        <p className="timeline-title">Order Confirmed</p>
                                        <p className="timeline-date">{formatDate(order.updated_at)}</p>
                                    </div>
                                </div>
                            )}
                            <div className={`timeline-item ${order.order_status === "shipped" || order.order_status === "delivered" ? "active" : ""}`}>
                                <div className="timeline-dot"></div>
                                <div className="timeline-content">
                                    <p className="timeline-title">Shipped</p>
                                    <p className="timeline-date">
                                        {order.order_status === "shipped" || order.order_status === "delivered" ? formatDate(order.updated_at) : "Pending"}
                                    </p>
                                </div>
                            </div>
                            <div className={`timeline-item ${order.order_status === "delivered" ? "active" : ""}`}>
                                <div className="timeline-dot"></div>
                                <div className="timeline-content">
                                    <p className="timeline-title">Delivered</p>
                                    <p className="timeline-date">
                                        {order.order_status === "delivered" ? formatDate(order.updated_at) : "Pending"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderDetails;
