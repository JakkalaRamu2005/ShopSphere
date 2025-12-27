import React from 'react';
import './PrivacyPolicy.css';

export default function PrivacyPolicy() {
  return (
    <div className="policy-page">
      <div className="policy-hero">
        <h1>Privacy Policy</h1>
        <p>Last updated: December 24, 2025</p>
      </div>

      <div className="policy-container">
        
        <section className="policy-section">
          <h2>1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us when you create an account, 
            make a purchase, or contact us for support. This includes:
          </p>
          <ul>
            <li>Name, email address, and phone number</li>
            <li>Shipping and billing addresses</li>
            <li>Payment information (processed securely by our payment partners)</li>
            <li>Purchase history and preferences</li>
            <li>Device information and IP address</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Process and fulfill your orders</li>
            <li>Send order confirmations and shipping updates</li>
            <li>Provide customer support</li>
            <li>Send promotional emails (you can opt-out anytime)</li>
            <li>Improve our website and services</li>
            <li>Prevent fraud and maintain security</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>3. Information Sharing</h2>
          <p>
            We do not sell your personal information to third parties. We may share 
            your information with:
          </p>
          <ul>
            <li>Service providers (shipping, payment processing)</li>
            <li>Law enforcement when required by law</li>
            <li>Business partners with your consent</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>4. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your personal 
            information, including SSL encryption, secure servers, and regular security 
            audits. However, no method of transmission over the internet is 100% secure.
          </p>
        </section>

        <section className="policy-section">
          <h2>5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of marketing communications</li>
            <li>Export your data</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>6. Cookies</h2>
          <p>
            We use cookies and similar technologies to enhance your browsing experience, 
            remember your preferences, and analyze site traffic. You can control cookies 
            through your browser settings.
          </p>
        </section>

        <section className="policy-section">
          <h2>7. Children's Privacy</h2>
          <p>
            Our services are not intended for children under 13. We do not knowingly 
            collect personal information from children.
          </p>
        </section>

        <section className="policy-section">
          <h2>8. Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of 
            any significant changes by email or through our website.
          </p>
        </section>

        <section className="policy-section contact-section">
          <h2>9. Contact Us</h2>
          <p>If you have questions about this privacy policy, contact us at:</p>
          <div className="contact-info">
            <p>📧 Email: privacy@shopsphere.com</p>
            <p>📞 Phone: +91 12345 67890</p>
            <p>📍 Address: ShopSphere HQ, Bangalore, India</p>
          </div>
        </section>

      </div>
    </div>
  );
}
