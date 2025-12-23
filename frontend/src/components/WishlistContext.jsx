import React, { createContext, useState, useContext, useEffect } from "react";
import { API_BASE_URL } from "../config/api";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [wishlistCount, setWishlistCount] = useState(0);

    // Fetch wishlist on mount
    useEffect(() => {
        fetchWishlist();
    }, []);

    // Update wishlist count whenever items change
    useEffect(() => {
        setWishlistCount(wishlistItems.length);
    }, [wishlistItems]);

    /**
     * Fetch all wishlist items
     */
    const fetchWishlist = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/wishlist`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setWishlistItems(data.wishlistItems || []);
            }
        } catch (error) {
            console.error("Fetch wishlist error:", error);
        }
    };

    /**
     * Add item to wishlist
     */
    const addToWishlist = async (product) => {
        try {
            const response = await fetch(`${API_BASE_URL}/wishlist`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    product_id: product.id,
                    title: product.title,
                    price: product.price,
                    image: product.image,
                    category: product.category,
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                await fetchWishlist(); // Refresh wishlist
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error("Add to wishlist error:", error);
            return { success: false, message: "Failed to add to wishlist" };
        }
    };

    /**
     * Remove item from wishlist
     */
    const removeFromWishlist = async (productId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/wishlist/${productId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            const data = await response.json();

            if (response.ok && data.success) {
                await fetchWishlist(); // Refresh wishlist
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error("Remove from wishlist error:", error);
            return { success: false, message: "Failed to remove from wishlist" };
        }
    };

    /**
     * Move item from wishlist to cart
     */
    const moveToCart = async (productId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/wishlist/${productId}/move-to-cart`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            const data = await response.json();

            if (response.ok && data.success) {
                await fetchWishlist(); // Refresh wishlist
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error("Move to cart error:", error);
            return { success: false, message: "Failed to move to cart" };
        }
    };

    /**
     * Clear entire wishlist
     */
    const clearWishlist = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/wishlist/clear/all`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setWishlistItems([]);
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error("Clear wishlist error:", error);
            return { success: false, message: "Failed to clear wishlist" };
        }
    };

    /**
     * Check if product is in wishlist
     */
    const isInWishlist = (productId) => {
        return wishlistItems.some(item => item.product_id === productId);
    };

    /**
     * Get wishlist count
     */
    const getWishlistCount = () => {
        return wishlistCount;
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlistItems,
                wishlistCount,
                addToWishlist,
                removeFromWishlist,
                moveToCart,
                clearWishlist,
                isInWishlist,
                getWishlistCount,
                fetchWishlist,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
};
