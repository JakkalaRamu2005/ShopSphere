import React, { useState } from 'react';
import './TrackOrder.css';

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const [trackingInfo, setTrackingInfo] = useState(null);

  const handleTrack = (e) => {
    e.preventDefault();
    if (orderId.trim()) {
      // Demo tracking info
      setTrackingInfo({
        orderId: orderId,
        status: 'In Transit',
        location: 'Mumbai Distribution Center',
        estimatedDelivery: 'Dec 27, 2025',
        statusCode: 'in-transit'
      });
    }
  };

  return (
    <div className="track-page">
      <div className="track-hero">
        <h1>📦 Track Your Order</h1>
        <p>Enter your order ID to check delivery status</p>
      </div>

      <div className="track-container">
        
        {/* Track Form */}
        <section className="track-section">
          <form className="track-form" onSubmit={handleTrack}>
            <input
              type="text"
              placeholder="Enter your Order ID (e.g., ORD123456)"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="track-input"
              required
            />
            <button type="submit" className="track-btn">Track Order</button>
          </form>

          {trackingInfo && (
            <div className="tracking-result">
              <div className="result-header">
                <h2>Order Status</h2>
                <span className={`status-badge ${trackingInfo.statusCode}`}>
                  {trackingInfo.status}
                </span>
              </div>
              
              <div className="tracking-details">
                <div className="detail-item">
                  <span className="detail-label">Order ID:</span>
                  <span className="detail-value">{trackingInfo.orderId}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Current Location:</span>
                  <span className="detail-value">{trackingInfo.location}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Estimated Delivery:</span>
                  <span className="detail-value">{trackingInfo.estimatedDelivery}</span>
                </div>
              </div>

              {/* Tracking Timeline */}
              <div className="tracking-timeline">
                <div className="timeline-item completed">
                  <div className="timeline-icon">✓</div>
                  <div className="timeline-content">
                    <h4>Order Confirmed</h4>
                    <p>Dec 22, 2025 - 10:30 AM</p>
                  </div>
                </div>

                <div className="timeline-item completed">
                  <div className="timeline-icon">✓</div>
                  <div className="timeline-content">
                    <h4>Shipped</h4>
                    <p>Dec 23, 2025 - 02:15 PM</p>
                  </div>
                </div>

                <div className="timeline-item active">
                  <div className="timeline-icon">🚚</div>
                  <div className="timeline-content">
                    <h4>In Transit</h4>
                    <p>Currently at Mumbai Distribution Center</p>
                  </div>
                </div>

                <div className="timeline-item">
                  <div className="timeline-icon">📍</div>
                  <div className="timeline-content">
                    <h4>Out for Delivery</h4>
                    <p>Expected Dec 27, 2025</p>
                  </div>
                </div>

                <div className="timeline-item">
                  <div className="timeline-icon">🏠</div>
                  <div className="timeline-content">
                    <h4>Delivered</h4>
                    <p>Awaiting delivery</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Help Section */}
        <section className="track-section">
          <h2>Need Help?</h2>
          <div className="help-grid">
            <div className="help-card">
              <div className="help-icon">❓</div>
              <h3>Where is my Order ID?</h3>
              <p>You can find it in your order confirmation email or in your account's "Order History".</p>
            </div>

            <div className="help-card">
              <div className="help-icon">📞</div>
              <h3>Contact Support</h3>
              <p>Call us at +91 12345 67890 or email support@shopsphere.com</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
