import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config/api';
import './adminorders.css';

function AdminOrders() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }
        fetchOrders();
    }, [user, navigate]);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: '', type: '' });
        }, 3000);
    };

    const fetchOrders = async () => {
        try {
            console.log('Fetching orders from:', `${API_BASE_URL}/admin/orders`);
            const response = await fetch(`${API_BASE_URL}/admin/orders`, {
                credentials: 'include'
            });
            const data = await response.json();
            console.log('Orders response:', data);

            if (data.success) {
                setOrders(data.orders);
                console.log('Orders loaded:', data.orders.length);
            } else {
                console.error('Failed to fetch orders:', data.message);
                showToast(data.message || 'Failed to load orders', 'error');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            showToast('Network error: ' + error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ status: newStatus })
            });

            const data = await response.json();

            if (data.success) {
                showToast(`Order #${orderId} status updated to ${newStatus}!`, 'success');
                fetchOrders();
            } else {
                showToast(data.message, 'error');
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            showToast('Failed to update order status', 'error');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount) => {
        return `₹${parseFloat(amount).toFixed(2)}`;
    };

    if (loading) {
        return <div className="admin-loading"><div className="loading-spinner"></div></div>;
    }

    return (
        <div className="admin-page">
            {/* Toast Notification */}
            {toast.show && (
                <div className={`toast toast-${toast.type}`}>
                    {toast.type === 'success' ? '✓' : '✕'} {toast.message}
                </div>
            )}

            <div className="admin-page-header">
                <button onClick={() => navigate('/admin')} className="back-btn">← Back to Dashboard</button>
                <h1>Order Management</h1>
            </div>

            <div className="orders-table-container desktop-view">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Email</th>
                            <th>Items</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td>#{order.id}</td>
                                <td>{order.user_name}</td>
                                <td>{order.user_email}</td>
                                <td>{order.item_count}</td>
                                <td>{formatCurrency(order.total_amount)}</td>
                                <td>
                                    <span className={`status-badge ${order.order_status}`}>
                                        {order.order_status}
                                    </span>
                                </td>
                                <td>{formatDate(order.created_at)}</td>
                                <td>
                                    <select
                                        value={order.order_status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        className="status-select"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile View Cards */}
            <div className="orders-mobile-grid mobile-view">
                {orders.map((order) => (
                    <div key={order.id} className="order-mobile-card">
                        <div className="card-top">
                            <div className="order-id">#{order.id}</div>
                            <span className={`status-badge ${order.order_status}`}>
                                {order.order_status}
                            </span>
                        </div>
                        <div className="card-info">
                            <p className="customer-name">{order.user_name}</p>
                            <p className="customer-email">{order.user_email}</p>
                        </div>
                        <div className="card-details">
                            <div className="detail-row">
                                <span>Items: {order.item_count}</span>
                                <span className="order-amount">{formatCurrency(order.total_amount)}</span>
                            </div>
                            <p className="order-date">{formatDate(order.created_at)}</p>
                        </div>
                        <div className="order-card-actions">
                            <label>Update Status:</label>
                            <select
                                value={order.order_status}
                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                className="status-select"
                            >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                ))}
            </div>

            {orders.length === 0 && !loading && (
                <div className="no-data">
                    <p>No orders found</p>
                </div>
            )}
        </div>
    );
}

export default AdminOrders;
