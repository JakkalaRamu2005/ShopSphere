import { useState } from "react";
import styles from "./ContactUs.module.css";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your API call here
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className={styles.contactPage}>
      <div className={styles.hero}>
        <h1>Get In Touch</h1>
        <p>We'd love to hear from you. Our team is here to help!</p>
      </div>

      <div className={styles.container}>
        <div className={styles.grid}>
          
          {/* Contact Form */}
          <div className={styles.formSection}>
            <h2>Send us a message</h2>
            <p className={styles.subtitle}>Fill out the form and we'll get back to you within 24 hours</p>

            {submitted && (
              <div className={styles.successMessage}>
                ✓ Thank you! Your message has been sent successfully.
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 12345 67890"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="subject">Subject *</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="order">Order Related</option>
                  <option value="product">Product Inquiry</option>
                  <option value="shipping">Shipping & Delivery</option>
                  <option value="return">Returns & Refunds</option>
                  <option value="payment">Payment Issues</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button type="submit" className={styles.submitBtn}>
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className={styles.infoSection}>
            <div className={styles.infoCard}>
              <div className={styles.iconBox}>📍</div>
              <h3>Visit Us</h3>
              <p>123 Shopping Street</p>
              <p>Mumbai, Maharashtra 400001</p>
              <p>India</p>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.iconBox}>📞</div>
              <h3>Call Us</h3>
              <p><a href="tel:+911234567890">+91 12345 67890</a></p>
              <p className={styles.hours}>Mon-Sat: 9AM - 6PM</p>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.iconBox}>✉️</div>
              <h3>Email Us</h3>
              <p><a href="mailto:support@shopease.com">support@shopease.com</a></p>
              <p><a href="mailto:sales@shopease.com">sales@shopease.com</a></p>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.iconBox}>💬</div>
              <h3>Live Chat</h3>
              <p>Available 24/7</p>
              <button className={styles.chatBtn}>Start Chat</button>
            </div>

            <div className={styles.socialCard}>
              <h3>Follow Us</h3>
              <div className={styles.socialIcons}>
                <a href="#" aria-label="Facebook">📘</a>
                <a href="#" aria-label="Instagram">📷</a>
                <a href="#" aria-label="Twitter">🐦</a>
                <a href="#" aria-label="YouTube">▶️</a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
