import React from 'react';
import './ReturnsRefunds.css';

export default function ReturnsRefunds() {
  return (
    <div className="returns-page">
      <div className="returns-hero">
        <h1>↩️ Returns & Refunds</h1>
        <p>Hassle-free returns within 7 days</p>
      </div>

      <div className="returns-container">
        
        {/* Return Policy */}
        <section className="returns-section">
          <h2>Our Return Policy</h2>
          <div className="policy-grid">
            
            <div className="policy-card">
              <div className="policy-icon">📅</div>
              <h3>7-Day Return</h3>
              <p>Return any product within 7 days of delivery if you're not satisfied.</p>
            </div>

            <div className="policy-card">
              <div className="policy-icon">💯</div>
              <h3>100% Refund</h3>
              <p>Full refund guaranteed. No questions asked for damaged/defective items.</p>
            </div>

            <div className="policy-card">
              <div className="policy-icon">🔄</div>
              <h3>Easy Exchange</h3>
              <p>Exchange for different size, color, or product at no extra cost.</p>
            </div>

          </div>
        </section>

        {/* How to Return */}
        <section className="returns-section">
          <h2>How to Return an Item</h2>
          <div className="steps-grid">
            
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Login to Your Account</h3>
              <p>Go to "Order History" in your account dashboard.</p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Select Order</h3>
              <p>Find the order and click "Return Item" button.</p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Choose Reason</h3>
              <p>Select the reason for return and upload photos if needed.</p>
            </div>

            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Schedule Pickup</h3>
              <p>We'll arrange free pickup from your address.</p>
            </div>

          </div>
        </section>

        {/* Refund Timeline */}
        <section className="returns-section">
          <h2>Refund Processing Time</h2>
          <table className="refund-table">
            <thead>
              <tr>
                <th>Payment Method</th>
                <th>Refund Time</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>UPI / Wallet</td>
                <td>2-3 business days</td>
              </tr>
              <tr>
                <td>Credit/Debit Card</td>
                <td>5-7 business days</td>
              </tr>
              <tr>
                <td>Net Banking</td>
                <td>7-10 business days</td>
              </tr>
              <tr>
                <td>Cash on Delivery</td>
                <td>Bank transfer in 7-10 days</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Non-returnable */}
        <section className="returns-section">
          <h2>Non-Returnable Items</h2>
          <div className="non-returnable">
            <ul>
              <li>❌ Personalized or customized products</li>
              <li>❌ Intimate wear and cosmetics</li>
              <li>❌ Products with broken seal or tampered packaging</li>
              <li>❌ Gift cards and vouchers</li>
            </ul>
          </div>
        </section>

      </div>
    </div>
  );
}
