import { useState } from "react";
import { useCart } from "../CartContext";
import { useNavigate } from "react-router-dom";
import API_URL from "../../config/api";
import "./checkout.css";

function Checkout() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress({
      ...shippingAddress,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!shippingAddress.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!shippingAddress.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(shippingAddress.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid 10-digit phone number";
    }

    if (!shippingAddress.addressLine1.trim()) {
      newErrors.addressLine1 = "Address is required";
    }

    if (!shippingAddress.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!shippingAddress.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!shippingAddress.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^[0-9]{6}$/.test(shippingAddress.pincode)) {
      newErrors.pincode = "Please enter a valid 6-digit pincode";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Please fix the errors in the form");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/checkout/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          shippingAddress,
          paymentMethod,
          cartItems,
          totalAmount: getCartTotal(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Order placed successfully! Order ID: ${data.orderId}`);
        clearCart();
        navigate("/orders");
      } else {
        alert(data.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-container">
        <div className="empty-checkout">
          <h1>Your cart is empty</h1>
          <p>Add items to your cart before checking out</p>
          <button onClick={() => navigate("/products")} className="continue-shopping-btn">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h1 className="checkout-title">Checkout</h1>

      <div className="checkout-content">
        {/* Left Side - Forms */}
        <div className="checkout-form-section">
          <form onSubmit={handleSubmit}>
            {/* Shipping Address */}
            <div className="form-section">
              <h2>Shipping Address</h2>

              <div className="form-group">
                <label htmlFor="fullName">
                  Full Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={shippingAddress.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className={errors.fullName ? "error" : ""}
                />
                {errors.fullName && <span className="error-message">{errors.fullName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">
                  Phone Number <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={shippingAddress.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="10-digit mobile number"
                  maxLength="10"
                  className={errors.phoneNumber ? "error" : ""}
                />
                {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="addressLine1">
                  Address Line 1 <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="addressLine1"
                  name="addressLine1"
                  value={shippingAddress.addressLine1}
                  onChange={handleInputChange}
                  placeholder="House/Flat No., Building Name"
                  className={errors.addressLine1 ? "error" : ""}
                />
                {errors.addressLine1 && <span className="error-message">{errors.addressLine1}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="addressLine2">Address Line 2 (Optional)</label>
                <input
                  type="text"
                  id="addressLine2"
                  name="addressLine2"
                  value={shippingAddress.addressLine2}
                  onChange={handleInputChange}
                  placeholder="Street, Landmark"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">
                    City <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className={errors.city ? "error" : ""}
                  />
                  {errors.city && <span className="error-message">{errors.city}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="state">
                    State <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleInputChange}
                    placeholder="State"
                    className={errors.state ? "error" : ""}
                  />
                  {errors.state && <span className="error-message">{errors.state}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="pincode">
                  Pincode <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  value={shippingAddress.pincode}
                  onChange={handleInputChange}
                  placeholder="6-digit pincode"
                  maxLength="6"
                  className={errors.pincode ? "error" : ""}
                />
                {errors.pincode && <span className="error-message">{errors.pincode}</span>}
              </div>
            </div>

            {/* Payment Method */}
            <div className="form-section">
              <h2>Payment Method</h2>
              <div className="payment-options">
                <label className={`radio-option ${paymentMethod === "cod" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="payment-icon">💵</span>
                  <span className="payment-label">Cash on Delivery</span>
                </label>

                <label className={`radio-option ${paymentMethod === "upi" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === "upi"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="payment-icon">📱</span>
                  <span className="payment-label">UPI</span>
                </label>

                <label className={`radio-option ${paymentMethod === "card" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="payment-icon">💳</span>
                  <span className="payment-label">Credit/Debit Card</span>
                </label>
              </div>
            </div>

            <button type="submit" className="place-order-btn" disabled={loading}>
              {loading ? "Placing Order..." : `Place Order - ₹${getCartTotal().toFixed(2)}`}
            </button>
          </form>
        </div>

        {/* Right Side - Order Summary */}
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-items">
            {cartItems.map((item) => (
              <div key={item.id} className="summary-item">
                <img src={item.image} alt={item.title} />
                <div className="summary-item-details">
                  <p className="summary-item-title">{item.title}</p>
                  <p className="summary-item-quantity">Qty: {item.quantity}</p>
                  <p className="summary-item-price">₹{((item.price * 83) * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="summary-totals">
            <div className="summary-row">
              <span>Subtotal ({cartItems.length} items)</span>
              <span>₹{getCartTotal().toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span className="free-badge">Free</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{getCartTotal().toFixed(2)}</span>
            </div>
          </div>

          <div className="trust-badges">
            <div className="trust-badge">
              <span>🔒</span>
              <p>Secure Checkout</p>
            </div>
            <div className="trust-badge">
              <span>↩️</span>
              <p>Easy Returns</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
