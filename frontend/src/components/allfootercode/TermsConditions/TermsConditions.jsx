import React from 'react';
import './TermsConditions.css';

export default function TermsConditions() {
  return (
    <div className="terms-page">
      <div className="terms-hero">
        <h1>Terms & Conditions</h1>
        <p>Last updated: December 24, 2025</p>
      </div>

      <div className="terms-container">
        
        <section className="terms-section">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using ShopSphere, you accept and agree to be bound by these 
            Terms and Conditions. If you do not agree, please do not use our services.
          </p>
        </section>

        <section className="terms-section">
          <h2>2. Use of Service</h2>
          <p>You agree to use our services only for lawful purposes. You must not:</p>
          <ul>
            <li>Violate any laws or regulations</li>
            <li>Infringe on intellectual property rights</li>
            <li>Transmit harmful code or viruses</li>
            <li>Attempt unauthorized access to our systems</li>
            <li>Engage in fraudulent activities</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>3. Account Registration</h2>
          <p>
            You must create an account to make purchases. You are responsible for 
            maintaining the confidentiality of your account credentials and for all 
            activities under your account.
          </p>
        </section>

        <section className="terms-section">
          <h2>4. Product Information</h2>
          <p>
            We strive to provide accurate product descriptions and images. However, 
            we do not warrant that product descriptions are error-free, complete, or 
            current. Colors may vary slightly due to screen settings.
          </p>
        </section>

        <section className="terms-section">
          <h2>5. Pricing and Payment</h2>
          <ul>
            <li>All prices are in Indian Rupees (INR)</li>
            <li>Prices are subject to change without notice</li>
            <li>Payment must be made in full before order processing</li>
            <li>We accept various payment methods as listed on our site</li>
            <li>Failed payments may result in order cancellation</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>6. Shipping and Delivery</h2>
          <p>
            Delivery times are estimates and not guaranteed. We are not liable for 
            delays caused by shipping carriers, weather, or other factors beyond our 
            control. Risk of loss transfers to you upon delivery.
          </p>
        </section>

        <section className="terms-section">
          <h2>7. Returns and Refunds</h2>
          <p>
            Please refer to our Returns & Refunds policy for detailed information. 
            Returns must be made within 7 days of delivery in original condition.
          </p>
        </section>

        <section className="terms-section">
          <h2>8. Intellectual Property</h2>
          <p>
            All content on ShopSphere, including text, graphics, logos, and images, 
            is our property or licensed to us and protected by copyright laws. 
            Unauthorized use is prohibited.
          </p>
        </section>

        <section className="terms-section">
          <h2>9. Limitation of Liability</h2>
          <p>
            ShopSphere shall not be liable for any indirect, incidental, special, or 
            consequential damages arising from your use of our services. Our total 
            liability is limited to the amount you paid for the product.
          </p>
        </section>

        <section className="terms-section">
          <h2>10. Governing Law</h2>
          <p>
            These terms are governed by the laws of India. Any disputes shall be 
            subject to the exclusive jurisdiction of courts in Bangalore, India.
          </p>
        </section>

        <section className="terms-section highlight-section">
          <h2>11. Contact Information</h2>
          <p>For questions about these terms, contact us at:</p>
          <div className="contact-box">
            <p>📧 legal@shopsphere.com</p>
            <p>📞 +91 12345 67890</p>
          </div>
        </section>

      </div>
    </div>
  );
}
