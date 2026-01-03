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
    const [imageFiles, setImageFiles] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

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

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 5) {
            alert('Maximum 5 images allowed');
            return;
        }
        setImageFiles(files);

        // Create preview URLs
        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    const removeExistingImage = (index) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeNewImage = (index) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const url = editingProduct
                ? `${API_BASE_URL}/admin/products/${editingProduct.id}`
                : `${API_BASE_URL}/admin/products`;

            const method = editingProduct ? 'PUT' : 'POST';

            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('stock', formData.stock);

            // Add existing images for update
            if (editingProduct && existingImages.length > 0) {
                formDataToSend.append('existingImages', JSON.stringify(existingImages));
            }

            // Add new image files
            imageFiles.forEach(file => {
                formDataToSend.append('images', file);
            });

            const response = await fetch(url, {
                method,
                credentials: 'include',
                body: formDataToSend
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
        setExistingImages(product.images || []);
        setFormData({
            title: product.title,
            description: product.description || '',
            price: product.price,
            category: product.category || '',
            stock: product.stock || 0
        });
        setImageFiles([]);
        setImagePreviews([]);
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
        setImageFiles([]);
        setExistingImages([]);
        setImagePreviews([]);
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
                                <label>Product Images (Max 5)</label>

                                {/* Show existing images for edit */}
                                {editingProduct && existingImages.length > 0 && (
                                    <div className="existing-images">
                                        <p style={{ fontSize: '14px', marginBottom: '8px', color: '#666' }}>Existing Images:</p>
                                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
                                            {existingImages.map((img, index) => (
                                                <div key={index} className="image-preview" style={{ position: 'relative', width: '80px', height: '80px' }}>
                                                    <img
                                                        src={img}
                                                        alt={`Product ${index + 1}`}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px', border: '2px solid #ddd' }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeExistingImage(index)}
                                                        style={{
                                                            position: 'absolute',
                                                            top: '-8px',
                                                            right: '-8px',
                                                            background: '#ff4444',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '50%',
                                                            width: '24px',
                                                            height: '24px',
                                                            cursor: 'pointer',
                                                            fontSize: '16px',
                                                            lineHeight: '1',
                                                            fontWeight: 'bold'
                                                        }}
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* File input for new images */}
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                    style={{
                                        marginTop: '10px',
                                        padding: '10px',
                                        border: '2px dashed #ddd',
                                        borderRadius: '4px',
                                        width: '100%',
                                        cursor: 'pointer'
                                    }}
                                />
                                <small style={{ color: '#888', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                                    Select up to 5 images (JPG, PNG, WebP, max 5MB each)
                                </small>

                                {/* Preview selected files */}
                                {imagePreviews.length > 0 && (
                                    <div style={{ marginTop: '15px' }}>
                                        <p style={{ fontSize: '14px', marginBottom: '8px', color: '#666' }}>New Images ({imagePreviews.length}):</p>
                                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                            {imagePreviews.map((preview, index) => (
                                                <div key={index} style={{ position: 'relative', width: '80px', height: '80px' }}>
                                                    <img
                                                        src={preview}
                                                        alt={`New ${index + 1}`}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px', border: '2px solid #4CAF50' }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeNewImage(index)}
                                                        style={{
                                                            position: 'absolute',
                                                            top: '-8px',
                                                            right: '-8px',
                                                            background: '#ff4444',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '50%',
                                                            width: '24px',
                                                            height: '24px',
                                                            cursor: 'pointer',
                                                            fontSize: '16px',
                                                            lineHeight: '1',
                                                            fontWeight: 'bold'
                                                        }}
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
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
