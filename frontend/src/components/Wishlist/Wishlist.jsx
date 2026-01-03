import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { FaHeart, FaShoppingCart, FaTrash } from "react-icons/fa";
import "./wishlist.css";

/**
 * Wishlist Component
 * Displays all wishlist items with options to move to cart or remove
 */
function Wishlist() {
    const navigate = useNavigate();
    const { wishlistItems, removeFromWishlist, moveToCart, clearWishlist, fetchWishlist } = useWishlist();
    const { fetchCart } = useCart();
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        loadWishlist();
    }, []);

    const loadWishlist = async () => {
        setLoading(true);
        await fetchWishlist();
        setLoading(false);
    };

    /**
     * Handle move to cart
     */
    const handleMoveToCart = async (productId) => {
        setActionLoading(productId);
        const result = await moveToCart(productId);

        if (result.success) {
            await fetchCart(); // Refresh cart count
        }

        setActionLoading(null);
    };

    /**
     * Handle remove from wishlist
     */
    const handleRemove = async (productId) => {
        setActionLoading(productId);
        await removeFromWishlist(productId);
        setActionLoading(null);
    };

    /**
     * Handle clear all
     */
    const handleClearAll = async () => {
        if (window.confirm("Are you sure you want to clear your entire wishlist?")) {
            await clearWishlist();
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="wishlist-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading your wishlist...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="wishlist-container">
            {/* Page Header */}
            <div className="wishlist-header">
                <div className="header-content">
                    <h1>
                        <FaHeart className="heart-icon" />
                        My Wishlist
                    </h1>
                    <p>{wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}</p>
                </div>
                {wishlistItems.length > 0 && (
                    <button onClick={handleClearAll} className="btn-clear-all">
                        <FaTrash /> Clear All
                    </button>
                )}
            </div>

            {/* Wishlist Items */}
            {wishlistItems.length === 0 ? (
                <div className="empty-wishlist">
                    <div className="empty-icon">💝</div>
                    <h2>Your Wishlist is Empty</h2>
                    <p>Add items you love to your wishlist and shop them later!</p>
                    <button onClick={() => navigate("/products")} className="btn-browse">
                        Browse Products
                    </button>
                </div>
            ) : (
                <div className="wishlist-grid">
                    {wishlistItems.map((item) => (
                        <div key={item.id} className="wishlist-card">
                            {/* Product Image */}
                            <div className="wishlist-image-wrapper">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    onClick={() => navigate(`/products/${item.product_id}`)}
                                />
                                <button
                                    className="btn-remove-icon"
                                    onClick={() => handleRemove(item.product_id)}
                                    disabled={actionLoading === item.product_id}
                                >
                                    <FaTrash />
                                </button>
                            </div>

                            {/* Product Info */}
                            <div className="wishlist-info">
                                <h3
                                    className="wishlist-title"
                                    onClick={() => navigate(`/products/${item.product_id}`)}
                                >
                                    {item.title}
                                </h3>
                                {item.category && (
                                    <span className="wishlist-category">{item.category}</span>
                                )}
                                <div className="wishlist-price">
                                    ₹{parseFloat(item.price).toFixed(2)}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="wishlist-actions">
                                <button
                                    className="btn-move-to-cart"
                                    onClick={() => handleMoveToCart(item.product_id)}
                                    disabled={actionLoading === item.product_id}
                                >
                                    {actionLoading === item.product_id ? (
                                        <span className="btn-loading">Moving...</span>
                                    ) : (
                                        <>
                                            <FaShoppingCart /> Move to Cart
                                        </>
                                    )}
                                </button>
                                <button
                                    className="btn-remove"
                                    onClick={() => handleRemove(item.product_id)}
                                    disabled={actionLoading === item.product_id}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Wishlist;
