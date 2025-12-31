import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { API_BASE_URL } from '../../config/api';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './admindashboard.css';

function AdminDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');

    useEffect(() => {
        // Check if user is admin
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }

        fetchAnalytics();
    }, [user, navigate]);

    const fetchAnalytics = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/analytics`, {
                credentials: 'include'
            });
            const data = await response.json();

            if (data.success) {
                setAnalytics(data.analytics);
            }
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return `₹${parseFloat(amount).toFixed(2)}`;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="loading-spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
                <p>Welcome back, {user?.name}!</p>
            </div>

            <div className="admin-tabs">
                <button
                    className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                    onClick={() => setActiveTab('dashboard')}
                >
                    📊 Dashboard
                </button>
                <button
                    className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
                    onClick={() => navigate('/admin/products')}
                >
                    📦 Products
                </button>
                <button
                    className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
                    onClick={() => navigate('/admin/orders')}
                >
                    🛒 Orders
                </button>
                <button
                    className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => navigate('/admin/users')}
                >
                    👥 Users
                </button>
            </div>

            {/* Analytics Cards */}
            <div className="stats-grid">
                <div className="stat-card sales">
                    <div className="stat-icon">💰</div>
                    <div className="stat-info">
                        <h3>Total Sales</h3>
                        <p className="stat-value">{formatCurrency(analytics?.totalSales || 0)}</p>
                    </div>
                </div>

                <div className="stat-card orders">
                    <div className="stat-icon">📦</div>
                    <div className="stat-info">
                        <h3>Total Orders</h3>
                        <p className="stat-value">{analytics?.totalOrders || 0}</p>
                    </div>
                </div>

                <div className="stat-card users">
                    <div className="stat-icon">👥</div>
                    <div className="stat-info">
                        <h3>Total Users</h3>
                        <p className="stat-value">{analytics?.totalUsers || 0}</p>
                    </div>
                </div>

                <div className="stat-card products">
                    <div className="stat-icon">🏷️</div>
                    <div className="stat-info">
                        <h3>Total Products</h3>
                        <p className="stat-value">{analytics?.totalProducts || 0}</p>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="charts-grid">
                {/* Sales Over Time Chart */}
                <div className="chart-container">
                    <h3>Sales Over Time (Last 30 Days)</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={analytics?.salesLast30Days || []}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="date"
                                tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            />
                            <YAxis />
                            <Tooltip
                                formatter={(value) => [`₹${value}`, 'Revenue']}
                                labelFormatter={(date) => new Date(date).toLocaleDateString()}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke="#667eea"
                                activeDot={{ r: 8 }}
                                name="Revenue"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Orders per Category Chart */}
                <div className="chart-container">
                    <h3>Orders per Category</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={analytics?.salesByCategory || []}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="category" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#10b981" name="Number of Orders" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="dashboard-section">
                <h2>Recent Orders</h2>
                <div className="table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {analytics?.recentOrders?.map((order) => (
                                <tr key={order.id}>
                                    <td>#{order.id}</td>
                                    <td>{order.user_name}</td>
                                    <td>{formatCurrency(order.total_amount)}</td>
                                    <td>
                                        <span className={`status-badge ${order.order_status}`}>
                                            {order.order_status}
                                        </span>
                                    </td>
                                    <td>{formatDate(order.created_at)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Orders by Status */}
            <div className="dashboard-section">
                <h2>Orders by Status</h2>
                <div className="status-grid">
                    {analytics?.ordersByStatus?.map((item) => (
                        <div key={item.order_status} className="status-card">
                            <h4>{item.order_status}</h4>
                            <p className="status-count">{item.count}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
