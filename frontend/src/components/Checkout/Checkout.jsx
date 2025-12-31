import { useState } from "react";
import { useCart } from "../CartContext";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config/api";
import "./checkout.css";

function Checkout() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

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
  const [upiId, setUpiId] = useState("");

  const getSubtotal = () => getCartTotal();
  const getDiscount = () => appliedCoupon ? appliedCoupon.discountAmount : 0;
  const getFinalTotal = () => getSubtotal() - getDiscount();

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/coupon/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          code: couponCode,
          orderAmount: getSubtotal()
        })
      });

      const data = await response.json();

      if (data.success) {
        setAppliedCoupon(data.coupon);
        setCouponError('');
      } else {
        setCouponError(data.message);
        setAppliedCoupon(null);
      }
    } catch (error) {
      console.error('Coupon validation error:', error);
      setCouponError('Failed to validate coupon');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

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

    // Validate UPI ID if method is UPI
    if (paymentMethod === 'upi' && !upiId.trim()) {
      alert("Please enter a valid UPI ID to proceed.");
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Load Razorpay Script
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Alert handled in validateForm for UPI, general validation here
      if (!Object.values(errors).length) return;
      alert("Please fix the errors in the form");
      return;
    }

    setLoading(true);
    try {
      // 1. Create Order in Backend (Database)
      const response = await fetch(`${API_BASE_URL}/checkout/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          shippingAddress,
          paymentMethod,
          cartItems,
          totalAmount: getFinalTotal(),
          couponCode: appliedCoupon ? appliedCoupon.code : null,
          discountAmount: getDiscount()
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to place order");
      }

      const { orderId } = data;

      // 2. Handle Payment based on Method
      if (paymentMethod === 'cod') {
        alert(`Order placed successfully! Order ID: ${orderId}`);
        clearCart();
        navigate("/orders");
      } else {
        // Online Payment (Razorpay)
        const res = await loadRazorpay();
        if (!res) {
          alert('Razorpay SDK failed to load. Are you online?');
          return;
        }

        // Create Razorpay Order
        const paymentRes = await fetch(`${API_BASE_URL}/payment/create-order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ amount: getFinalTotal() })
        });

        const paymentData = await paymentRes.json();
        if (!paymentData.success) {
          alert(paymentData.message || "Could not create payment order");
          return;
        }

        const options = {
          key: paymentData.key,
          amount: paymentData.order.amount,
          currency: paymentData.order.currency,
          name: "ShopSphere",
          description: `Order #${orderId}`,
          image: "https://via.placeholder.com/150",
          order_id: paymentData.order.id,
          handler: async function (response) {
            // Verify Payment
            const verifyRes = await fetch(`${API_BASE_URL}/payment/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                order_id: orderId
              })
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              alert("Payment Successful!");
              clearCart();
              navigate("/orders");
            } else {
              alert("Payment Verification Failed");
              navigate("/payment/failure");
            }
          },
          prefill: {
            name: shippingAddress.fullName,
            contact: shippingAddress.phoneNumber,
            email: "",
            vpa: paymentMethod === 'upi' ? upiId : undefined // Prefill UPI VPA if available
          },
          theme: {
            color: "#667eea"
          }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      }

    } catch (error) {
      console.error("Checkout error:", error);
      alert(error.message || "An error occurred. Please try again.");
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
                  <div className="payment-method-details">
                    <span className="payment-icon">📱</span>
                    <span className="payment-label">UPI (PhonePe / GPay / Paytm)</span>
                    {paymentMethod === "upi" && (
                      <div className="upi-input-container">
                        <input
                          type="text"
                          placeholder="Enter your UPI ID (e.g. 9876543210@ybl)"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="upi-input"
                        />
                        <p className="upi-helper">We'll send a payment request to your UPI app.</p>
                      </div>
                    )}
                  </div>
                </label>

                <label className={`radio-option ${paymentMethod === "card" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="payment-method-details">
                    <span className="payment-icon">💳</span>
                    <span className="payment-label">Credit / Debit Card</span>
                    {paymentMethod === "card" && (
                      <div className="card-info">
                        <p>You will be redirected to the secure payment gateway to enter card details.</p>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>

            <button type="submit" className="place-order-btn" disabled={loading}>
              {loading ? "Processing..." : `Pay ₹${getFinalTotal().toFixed(2)}`}
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
              <span>₹{getSubtotal().toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span className="free-badge">Free</span>
            </div>
            {appliedCoupon && (
              <div className="summary-row discount">
                <span>Discount ({appliedCoupon.code})</span>
                <span className="discount-amount">-₹{getDiscount().toFixed(2)}</span>
              </div>
            )}
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{getFinalTotal().toFixed(2)}</span>
            </div>
          </div>

          {/* Coupon Section */}
          <div className="coupon-section">
            <h3>Have a Coupon?</h3>
            {!appliedCoupon ? (
              <div className="coupon-input-group">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value.toUpperCase());
                    setCouponError('');
                  }}
                  className="coupon-input"
                />
                <button onClick={handleApplyCoupon} className="apply-coupon-btn">
                  Apply
                </button>
              </div>
            ) : (
              <div className="applied-coupon">
                <span className="coupon-badge">
                  🎉 {appliedCoupon.code} Applied!
                </span>
                <button onClick={handleRemoveCoupon} className="remove-coupon-btn">
                  ✕
                </button>
              </div>
            )}
            {couponError && <p className="coupon-error">{couponError}</p>}
            {appliedCoupon && (
              <p className="coupon-success">You saved ₹{getDiscount().toFixed(2)}!</p>
            )}
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
