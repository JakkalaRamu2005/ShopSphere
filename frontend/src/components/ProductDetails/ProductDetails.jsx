import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./productdetails.css";
import { useCart } from "../../context/CartContext";
import ProductReviews from "../Reviews/ProductReviews";
import { API_BASE_URL } from "../../config/api";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.product) {
          const p = data.product;
          // Backend ensures p.images is an array
          const images = p.images && p.images.length > 0 ? p.images : ['https://via.placeholder.com/300x300?text=No+Image'];

          const formattedProduct = {
            id: p.id,
            title: p.title,
            price: parseFloat(p.price) / 83, // Convert INR to USD
            description: p.description,
            category: p.category,
            images: images,
            image: images[0], // Main image
            rating: {
              rate: parseFloat(p.rating_rate) || 0,
              count: parseInt(p.rating_count) || 0
            }
          };
          setProduct(formattedProduct);
          setSelectedImage(formattedProduct.image);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching product details:', err);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
    setAddedToCart(true);

    // Reset button after 2 seconds
    setTimeout(() => {
      setAddedToCart(false);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="loading-container">
        <p className="loading-text">Product not found</p>
        <Link to="/products" className="details-back-button">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="details-container">

      {/* Image Section */}
      <div className="details-image-container">
        <div className="main-image-wrapper">
          <img src={selectedImage || product.image} alt={product.title} className="details-image" />
        </div>

        {/* Image Gallery Thumbnails */}
        {product.images && product.images.length > 1 && (
          <div className="details-gallery">
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${product.title} view ${index + 1}`}
                className={`gallery-thumb ${selectedImage === img ? 'active' : ''}`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="details-content">
        <h1 className="details-title">{product.title}</h1>

        <p className="details-category">
          <strong>Category:</strong> {product.category}
        </p>

        <p className="details-price">₹{(product.price * 83).toFixed(2)}</p>
        <p className="details-description">{product.description}</p>

        {/* Stock Indicator */}
        <div className="stock-indicator">
          <span>✓</span>
          <span>In Stock - Ready to Ship</span>
        </div>

        {/* Button Group */}
        <div className="button-group">
          <button
            onClick={handleAddToCart}
            className="details-add-to-cart-btn"
            disabled={addedToCart}
          >
            {addedToCart ? "✓ Added to Cart!" : "Add to Cart"}
          </button>

          <Link to="/products" className="details-back-button">
            ← Back to Products
          </Link>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="details-reviews">
        <ProductReviews productId={id} />
      </div>
    </div>
  );
}

export default ProductDetails;
