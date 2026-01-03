import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../../config/api';
import './megamenu.css';

/**
 * MegaMenu Component
 * Displays Flipkart-style navigation with dropdown mega menu
 */
function MegaMenu() {
    // State to store categories fetched from API
    const [categories, setCategories] = useState([]);

    // State to track which category dropdown is currently open
    const [activeCategory, setActiveCategory] = useState(null);

    // State to track which subcategory is being hovered (for level 2 dropdown)
    const [activeSubcategory, setActiveSubcategory] = useState(null);

    // State for loading status
    const [loading, setLoading] = useState(true);

    // Fetch categories when component mounts
    useEffect(() => {
        fetchCategories();
    }, []);

    /**
     * Fetch categories from backend API
     */
    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/categories/mega-menu`);
            const data = await response.json();

            if (data.success) {
                setCategories(data.categories);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handle mouse enter on category
     * Opens the dropdown for that category
     */
    const handleCategoryEnter = (categoryId) => {
        setActiveCategory(categoryId);
        setActiveSubcategory(null); // Reset subcategory when changing main category
    };

    /**
     * Handle mouse leave from entire mega menu area
     * Closes all dropdowns
     */
    const handleMenuLeave = () => {
        setActiveCategory(null);
        setActiveSubcategory(null);
    };

    /**
     * Handle mouse enter on subcategory
     * Shows level 2 dropdown
     */
    const handleSubcategoryEnter = (subcategoryId) => {
        setActiveSubcategory(subcategoryId);
    };

    if (loading) {
        return <div className="mega-menu-loading">Loading categories...</div>;
    }

    return (
        <div className="mega-menu-container" onMouseLeave={handleMenuLeave}>
            {/* Main Navigation Bar */}
            <nav className="mega-menu-nav">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        className="mega-menu-item"
                        onMouseEnter={() => handleCategoryEnter(category.id)}
                    >
                        {/* Category Icon and Name */}
                        <Link to={`/products?category=${category.name}`} className="mega-menu-link">
                            <div className="mega-menu-icon">
                                <img
                                    src={category.icon_url || 'https://cdn-icons-png.flaticon.com/512/2331/2331966.png'}
                                    alt={category.name}
                                    onError={(e) => { e.target.src = 'https://cdn-icons-png.flaticon.com/512/2331/2331966.png'; }}
                                />
                            </div>
                            <div className="mega-menu-text">
                                <span className="mega-menu-name">{category.name}</span>
                                {category.subcategories && category.subcategories.length > 0 && (
                                    <span className="mega-menu-arrow">▼</span>
                                )}
                            </div>
                        </Link>

                        {/* Dropdown Panel - Shows when category is active */}
                        {activeCategory === category.id && category.subcategories && category.subcategories.length > 0 && (
                            <div className="mega-menu-dropdown">
                                <div className="mega-menu-dropdown-inner">
                                    {/* Level 1 Subcategories (Left Side) */}
                                    <div className="mega-menu-level1">
                                        {category.subcategories.map((subcategory) => (
                                            <div
                                                key={subcategory.id}
                                                className={`mega-menu-subcategory ${activeSubcategory === subcategory.id ? 'active' : ''}`}
                                                onMouseEnter={() => handleSubcategoryEnter(subcategory.id)}
                                            >
                                                <Link
                                                    to={`/products?category=${subcategory.name}`}
                                                    className="mega-menu-subcategory-link"
                                                >
                                                    <span className="subcategory-name">{subcategory.name}</span>
                                                    {subcategory.subcategories && subcategory.subcategories.length > 0 && (
                                                        <span className="subcategory-arrow">›</span>
                                                    )}
                                                </Link>

                                                {/* Level 2 Subcategories (Right Side) - Shows when subcategory is hovered */}
                                                {activeSubcategory === subcategory.id && subcategory.subcategories && subcategory.subcategories.length > 0 && (
                                                    <div className="mega-menu-level2">
                                                        <div className="mega-menu-level2-header">
                                                            <h4>{subcategory.name}</h4>
                                                        </div>
                                                        <div className="mega-menu-level2-items">
                                                            {/* "All" option */}
                                                            <Link
                                                                to={`/products?category=${subcategory.name}`}
                                                                className="mega-menu-level2-link"
                                                            >
                                                                All
                                                            </Link>

                                                            {/* Individual sub-subcategories */}
                                                            {subcategory.subcategories.map((subSubcategory) => (
                                                                <Link
                                                                    key={subSubcategory.id}
                                                                    to={`/products?category=${subSubcategory.name}`}
                                                                    className="mega-menu-level2-link"
                                                                >
                                                                    {subSubcategory.name}
                                                                    {subSubcategory.product_count > 0 && (
                                                                        <span className="product-count">({subSubcategory.product_count})</span>
                                                                    )}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </nav>
        </div>
    );
}

export default MegaMenu;
