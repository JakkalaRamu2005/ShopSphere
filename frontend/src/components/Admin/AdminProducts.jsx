import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config/api';
import './adminproducts.css';

function AdminProducts() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: '',
        image: '',
        stock: ''
    });

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }
        fetchProducts();
    }, [user, navigate]);

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/products`, {
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                setProducts(data.products);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const url = editingProduct
                ? `${API_BASE_URL}/admin/products/${editingProduct.id}`
                : `${API_BASE_URL}/admin/products`;

            const method = editingProduct ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                alert(editingProduct ? 'Product updated!' : 'Product added!');
                setShowModal(false);
                resetForm();
                fetchProducts();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Failed to save product');
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        // Convert images array to comma-separated string for editing
        const imageString = product.images && product.images.length > 0
            ? product.images.join(', ')
            : '';
        setFormData({
            title: product.title,
            description: product.description || '',
            price: product.price,
            category: product.category || '',
            image: imageString,
            stock: product.stock || 0
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            const data = await response.json();

            if (data.success) {
                alert('Product deleted!');
                fetchProducts();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product');
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            price: '',
            category: '',
            image: '',
            stock: ''
        });
        setEditingProduct(null);
    };

    const handleAddNew = () => {
        resetForm();
        setShowModal(true);
    };

    if (loading) {
        return <div className="admin-loading"><div className="loading-spinner"></div></div>;
    }

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <button onClick={() => navigate('/admin')} className="back-btn">← Back to Dashboard</button>
                <h1>Product Management</h1>
                <button onClick={handleAddNew} className="add-btn">+ Add Product</button>
            </div>

            <div className="products-table-container desktop-view">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Image</th>
                            <th>Title</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td>#{product.id}</td>
                                <td>
                                    <img
                                        src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/50x50?text=No+Image'}
                                        alt={product.title}
                                        className="product-thumb"
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/50x50?text=No+Image'; }}
                                    />
                                </td>
                                <td>{product.title}</td>
                                <td>₹{parseFloat(product.price).toFixed(2)}</td>
                                <td>{product.category}</td>
                                <td>{product.stock}</td>
                                <td>
                                    <button onClick={() => handleEdit(product)} className="edit-btn">Edit</button>
                                    <button onClick={() => handleDelete(product.id)} className="delete-btn">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile View Cards */}
            <div className="products-mobile-grid mobile-view">
                {products.map((product) => (
                    <div key={product.id} className="product-mobile-card">
                        <div className="card-top">
                            <img
                                src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/100x100?text=No+Image'}
                                alt={product.title}
                                className="mobile-product-img"
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/100x100?text=No+Image'; }}
                            />
                            <div className="card-info">
                                <h3>{product.title}</h3>
                                <p className="category-badge">{product.category}</p>
                            </div>
                        </div>
                        <div className="card-details">
                            <div className="detail-item">
                                <span className="label">Price:</span>
                                <span className="value">₹{parseFloat(product.price).toFixed(2)}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Stock:</span>
                                <span className="value">{product.stock}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">ID:</span>
                                <span className="value">#{product.id}</span>
                            </div>
                        </div>
                        <div className="product-card-actions">
                            <button onClick={() => handleEdit(product)} className="edit-btn">Edit</button>
                            <button onClick={() => handleDelete(product.id)} className="delete-btn">Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Price *</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        step="0.01"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Stock</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="form-control"
                                >
                                    <option value="">Select Category</option>
                                    {[...new Set(products.map(p => p.category))].filter(Boolean).sort().map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Image URLs (comma-separated for multiple images)</label>
                                <input
                                    type="text"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleInputChange}
                                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                                />
                                <small style={{ color: '#888', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                                    Enter one or more image URLs separated by commas
                                </small>
                            </div>

                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowModal(false)} className="cancel-btn">
                                    Cancel
                                </button>
                                <button type="submit" className="submit-btn">
                                    {editingProduct ? 'Update' : 'Add'} Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminProducts;
