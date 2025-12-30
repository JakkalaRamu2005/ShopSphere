import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
<<<<<<< HEAD
import {API_BASE_URL} from '../../config/api';
=======
import API_BASE_URL from '../../config/api';
>>>>>>> master
import './adminusers.css';

function AdminUsers() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }
        fetchUsers();
    }, [user, navigate]);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/users`, {
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                setUsers(data.users);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (userId, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
        const action = newStatus === 'blocked' ? 'block' : 'unblock';

        if (!confirm(`Are you sure you want to ${action} this user?`)) return;

        try {
            const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ status: newStatus })
            });

            const data = await response.json();

            if (data.success) {
                alert(data.message);
                fetchUsers();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error updating user status:', error);
            alert('Failed to update user status');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return <div className="admin-loading"><div className="loading-spinner"></div></div>;
    }

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <button onClick={() => navigate('/admin')} className="back-btn">← Back to Dashboard</button>
                <h1>User Management</h1>
            </div>

            <div className="users-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Orders</th>
                            <th>Joined</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id}>
                                <td>#{u.id}</td>
                                <td>{u.name || 'N/A'}</td>
                                <td>{u.email}</td>
                                <td>
                                    <span className={`role-badge ${u.role}`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td>
                                    <span className={`status-badge ${u.status}`}>
                                        {u.status}
                                    </span>
                                </td>
                                <td>{u.order_count}</td>
                                <td>{formatDate(u.created_at)}</td>
                                <td>
                                    {u.id !== user.id && u.role !== 'admin' && (
                                        <button
                                            onClick={() => handleToggleStatus(u.id, u.status)}
                                            className={u.status === 'active' ? 'block-btn' : 'unblock-btn'}
                                        >
                                            {u.status === 'active' ? 'Block' : 'Unblock'}
                                        </button>
                                    )}
                                    {u.id === user.id && <span className="self-label">You</span>}
                                    {u.role === 'admin' && u.id !== user.id && <span className="admin-label">Admin</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {users.length === 0 && (
                    <div className="no-data">
                        <p>No users found</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminUsers;
