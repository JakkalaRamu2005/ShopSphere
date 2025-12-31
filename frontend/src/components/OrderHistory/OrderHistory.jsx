import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config/api";
import "./orderhistory.css";

/**
 * OrderHistory Component
 * Displays a list of all orders placed by the authenticated user
 * Shows order summary, status, and allows viewing detailed order information
 */
function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState(null);
    const navigate = useNavigate();

    // Fetch orders on component mount and setup polling
    useEffect(() => {
        fetchOrders();
        fetchOrderStats();

        // Poll for updates every 5 seconds
        const intervalId = setInterval(() => {
            fetchOrders(true); // Polling mode (silent)
        }, 5000);

        return () => clearInterval(intervalId);
    }, []);

    /**
     * Fetch all orders for the current user
     * @param {boolean} isPolling - If true, suppresses loading state
     */
    const fetchOrders = async (isPolling = false) => {
        try {
            if (!isPolling) {
                setLoading(true);
                setError(null);
            }

            const response = await fetch(`${API_BASE_URL}/orders`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // If polling, we might want to check for changes before setting state
                // But simply setting state works fine for this requirement
                setOrders(data.orders);
            } else if (!isPolling) {
                setError(data.message || "Failed to fetch orders");
            }
        } catch (err) {
            console.error("Fetch orders error:", err);
            if (!isPolling) {
                setError("Unable to load orders. Please try again later.");
            }
        } finally {
            if (!isPolling) setLoading(false);
        }
    };

    /**
     * Fetch order statistics
     */
    const fetchOrderStats = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/orders/stats`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setStats(data.stats);
            }
        } catch (err) {
            console.error("Fetch stats error:", err);
        }
    };

    /**
     * Navigate to order details page
     */
    const viewOrderDetails = (orderId) => {
        navigate(`/orders/${orderId}`);
    };

    /**
     * Cancel an order
     */
    const cancelOrder = async (orderId, orderStatus) => {
        // Check if order can be cancelled
        if (!['pending', 'processing'].includes(orderStatus.toLowerCase())) {
            alert(`Cannot cancel order with status: ${orderStatus}`);
            return;
        }

        if (!confirm('Are you sure you want to cancel this order?')) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
                method: 'PUT',
                credentials: 'include'
            });

            const data = await response.json();

            if (data.success) {
                alert('Order cancelled successfully!');
                fetchOrders(); // Refresh orders list
            } else {
                alert(data.message || 'Failed to cancel order');
            }
        } catch (error) {
            console.error('Cancel order error:', error);
            alert('Failed to cancel order. Please try again.');
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
     * Get status badge class based on order status
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
     * Format status text for display
     */
    const formatStatus = (status) => {
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    // Loading state
    if (loading) {
        return (
            <div className="order-history-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading your orders...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="order-history-container">
                <div className="error-container">
                    <h2>⚠️ Error</h2>
                    <p>{error}</p>
                    <button onClick={fetchOrders} className="btn-retry">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="order-history-container">
            {/* Page Header */}
            <div className="order-history-header">
                <h1>Order History</h1>
                <p>View and track all your orders</p>
            </div>

            {/* Order Statistics */}
            {stats && (
                <div className="order-stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">📦</div>
                        <div className="stat-info">
                            <h3>{stats.total_orders}</h3>
                            <p>Total Orders</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">💰</div>
                        <div className="stat-info">
                            <h3>₹{parseFloat(stats.total_spent).toFixed(2)}</h3>
                            <p>Total Spent</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Orders List */}
            {orders.length === 0 ? (
                <div className="no-orders">
                    <div className="no-orders-icon">📦</div>
                    <h2>No Orders Yet</h2>
                    <p>You haven't placed any orders yet. Start shopping now!</p>
                    <button onClick={() => navigate("/products")} className="btn-shop-now">
                        Browse Products
                    </button>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <div key={order.id} className="order-card">
                            {/* Order Header */}
                            <div className="order-card-header">
                                <div className="order-info">
                                    <h3>Order #{order.id}</h3>
                                    <p className="order-date">{formatDate(order.created_at)}</p>
                                </div>
                                <div className="order-status">
                                    <span className={`status-badge ${getStatusClass(order.order_status)}`}>
                                        {formatStatus(order.order_status)}
                                    </span>
                                </div>
                            </div>

                            {/* Order Items Preview */}
                            <div className="order-items-preview">
                                {order.items.slice(0, 3).map((item, index) => (
                                    <div key={index} className="order-item-preview">
                                        <img src={item.image} alt={item.title} />
                                        <div className="item-preview-info">
                                            <p className="item-title">{item.title}</p>
                                            <p className="item-quantity">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                                {order.items.length > 3 && (
                                    <p className="more-items">+{order.items.length - 3} more items</p>
                                )}
                            </div>

                            {/* Order Summary */}
                            <div className="order-card-footer">
                                <div className="order-total">
                                    <span>Total Amount:</span>
                                    <strong>₹{parseFloat(order.total_amount).toFixed(2)}</strong>
                                </div>
                                <div className="order-actions">
                                    <button
                                        onClick={() => viewOrderDetails(order.id)}
                                        className="btn-view-details"
                                    >
                                        View Details
                                    </button>
                                    {['pending', 'processing'].includes(order.order_status.toLowerCase()) && (
                                        <button
                                            onClick={() => cancelOrder(order.id, order.order_status)}
                                            className="btn-cancel-order"
                                        >
                                            Cancel Order
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default OrderHistory;
