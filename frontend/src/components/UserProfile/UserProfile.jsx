import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config/api";
import { useAuth } from "../AuthContext";
import AddressManagement from "./AddressManagement";
import "./userprofile.css";

/**
 * UserProfile Component
 * Displays user profile information and allows editing
 * Features: View profile, edit name/email, change password
 */
function UserProfile() {
    const { updateUser } = useAuth();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const navigate = useNavigate();

    // Form states
    const [profileForm, setProfileForm] = useState({
        name: "",
        email: ""
    });

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    // Fetch user profile on mount
    useEffect(() => {
        fetchUserProfile();
    }, []);

    /**
     * Fetch user profile data
     */
    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${API_BASE_URL}/auth/profile`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            const data = await response.json();

            if (response.ok && data.user) {
                setUser(data.user);
                setProfileForm({
                    name: data.user.name || "",
                    email: data.user.email || ""
                });
            } else {
                setError(data.message || "Failed to fetch profile");
            }
        } catch (err) {
            console.error("Fetch profile error:", err);
            setError("Unable to load profile. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handle profile form input changes
     */
    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    /**
     * Handle password form input changes
     */
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    /**
     * Update user profile
     */
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/update-profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(profileForm)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSuccess("Profile updated successfully!");
                setUser(data.user);
                updateUser(data.user); // Update AuthContext
                setIsEditing(false);
                setTimeout(() => setSuccess(null), 3000);
            } else {
                setError(data.message || "Failed to update profile");
            }
        } catch (err) {
            console.error("Update profile error:", err);
            setError("Unable to update profile. Please try again.");
        }
    };

    /**
     * Change user password
     */
    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // Validate passwords match
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setError("New passwords do not match");
            return;
        }

        // Validate password length
        if (passwordForm.newPassword.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    currentPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSuccess("Password changed successfully!");
                setPasswordForm({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                });
                setIsChangingPassword(false);
                setTimeout(() => setSuccess(null), 3000);
            } else {
                setError(data.message || "Failed to change password");
            }
        } catch (err) {
            console.error("Change password error:", err);
            setError("Unable to change password. Please try again.");
        }
    };

    /**
     * Cancel editing
     */
    const handleCancelEdit = () => {
        setProfileForm({
            name: user.name || "",
            email: user.email || ""
        });
        setIsEditing(false);
        setError(null);
    };

    /**
     * Cancel password change
     */
    const handleCancelPasswordChange = () => {
        setPasswordForm({
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        });
        setIsChangingPassword(false);
        setError(null);
    };

    /**
     * Format date
     */
    const formatDate = (dateString) => {
        const options = {
            year: "numeric",
            month: "long",
            day: "numeric"
        };
        return new Date(dateString).toLocaleDateString("en-IN", options);
    };

    // Loading state
    if (loading) {
        return (
            <div className="profile-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading profile...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (!user && error) {
        return (
            <div className="profile-container">
                <div className="error-container">
                    <h2>⚠️ Error</h2>
                    <p>{error}</p>
                    <button onClick={fetchUserProfile} className="btn-retry">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-container">
            {/* Page Header */}
            <div className="profile-header">
                <h1>My Profile</h1>
                <p>Manage your account information</p>
            </div>

            {/* Success/Error Messages */}
            {success && (
                <div className="alert alert-success">
                    ✓ {success}
                </div>
            )}
            {error && (
                <div className="alert alert-error">
                    ⚠ {error}
                </div>
            )}

            <div className="profile-content">
                {/* Profile Information Card */}
                <div className="profile-card">
                    <div className="card-header">
                        <h2>Profile Information</h2>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="btn-edit"
                            >
                                ✏️ Edit Profile
                            </button>
                        )}
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleProfileUpdate} className="profile-form">
                            <div className="form-group">
                                <label htmlFor="name">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={profileForm.name}
                                    onChange={handleProfileChange}
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={profileForm.email}
                                    onChange={handleProfileChange}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn-save">
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="btn-cancel"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="profile-info">
                            <div className="info-row">
                                <span className="info-label">Full Name:</span>
                                <span className="info-value">{user.name || "Not provided"}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Email:</span>
                                <span className="info-value">{user.email}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Member Since:</span>
                                <span className="info-value">{formatDate(user.created_at)}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Password Change Card */}
                <div className="profile-card">
                    <div className="card-header">
                        <h2>Security</h2>
                        {!isChangingPassword && (
                            <button
                                onClick={() => setIsChangingPassword(true)}
                                className="btn-edit"
                            >
                                🔒 Change Password
                            </button>
                        )}
                    </div>

                    {isChangingPassword ? (
                        <form onSubmit={handlePasswordUpdate} className="profile-form">
                            <div className="form-group">
                                <label htmlFor="currentPassword">Current Password</label>
                                <input
                                    type="password"
                                    id="currentPassword"
                                    name="currentPassword"
                                    value={passwordForm.currentPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Enter current password"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="newPassword">New Password</label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    name="newPassword"
                                    value={passwordForm.newPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Enter new password"
                                    required
                                    minLength="6"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm New Password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={passwordForm.confirmPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Confirm new password"
                                    required
                                    minLength="6"
                                />
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn-save">
                                    Update Password
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancelPasswordChange}
                                    className="btn-cancel"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="profile-info">
                            <div className="info-row">
                                <span className="info-label">Password:</span>
                                <span className="info-value">••••••••</span>
                            </div>
                            <p className="security-note">
                                Keep your password secure and change it regularly
                            </p>
                        </div>
                    )}
                </div>

                {/* Quick Actions Card */}
                <div className="profile-card">
                    <div className="card-header">
                        <h2>Quick Actions</h2>
                    </div>
                    <div className="quick-actions">
                        <button
                            onClick={() => navigate("/orders")}
                            className="action-btn"
                        >
                            <span className="action-icon">📦</span>
                            <span className="action-text">View Orders</span>
                        </button>
                        <button
                            onClick={() => navigate("/cart")}
                            className="action-btn"
                        >
                            <span className="action-icon">🛒</span>
                            <span className="action-text">View Cart</span>
                        </button>
                        <button
                            onClick={() => navigate("/products")}
                            className="action-btn"
                        >
                            <span className="action-icon">🛍️</span>
                            <span className="action-text">Browse Products</span>
                        </button>
                    </div>
                </div>

                {/* Address Management Card */}
                <AddressManagement />
            </div>
        </div>
    );
}

export default UserProfile;
