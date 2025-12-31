import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./productdetails.css";
import { useCart } from "../CartContext";
import ProductReviews from "../Reviews/ProductReviews";
import { API_BASE_URL } from "../../config/api";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.product) {
          // Format product to match expected structure
          const formattedProduct = {
            id: data.product.id,
            title: data.product.title,
            price: parseFloat(data.product.price) / 83, // Convert INR to USD
            description: data.product.description,
            category: data.product.category,
            image: data.product.image,

            rating: {
              rate: parseFloat(data.product.rating_rate) || 0,
              count: parseInt(data.product.rating_count) || 0
            }
          };
          setProduct(formattedProduct);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
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

        <img src={product.image} alt={product.title} className="details-image" />
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
