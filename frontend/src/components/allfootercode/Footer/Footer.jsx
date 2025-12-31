import { useState } from "react";
import styles from "./Footer.module.css";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const currentYear = new Date().getFullYear();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>

        {/* Column 1: Brand + Newsletter */}
        <div className={styles.column}>
          <h3 className={styles.brand}>ShopEase</h3>
          <p className={styles.tagline}>Your trusted online store</p>

          <div className={styles.newsletter}>
            <h4 className={styles.newsletterTitle}>Subscribe to our newsletter</h4>
            <form onSubmit={handleSubscribe} className={styles.form}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                required
                aria-label="Email for newsletter"
              />
              <button type="submit" className={styles.subscribeBtn}>
                Subscribe
              </button>
            </form>
            {subscribed && <p className={styles.success}>✓ Subscribed successfully!</p>}
          </div>

          <div className={styles.trustBadges}>
            <img src="https://img.icons8.com/color/48/visa.png" alt="Visa" />
            <img src="https://img.icons8.com/color/48/mastercard.png" alt="Mastercard" />
            <img src="https://img.icons8.com/color/48/paypal.png" alt="PayPal" />
            <img src="https://img.icons8.com/color/48/google-pay.png" alt="Google Pay" />
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className={styles.column}>
          <h4 className={styles.heading}>Shop</h4>
          <ul className={styles.list}>
            <li><a href="/products">All Products</a></li>
            <li><a href="/categories">Categories</a></li>
            <li><a href="/deals">Today's Deals</a></li>
            <li><a href="/new-arrivals">New Arrivals</a></li>
            <li><a href="/bestsellers">Best Sellers</a></li>
          </ul>
        </div>

        {/* Column 3: Customer Service */}
        <div className={styles.column}>
          <h4 className={styles.heading}>Customer Service</h4>
          <ul className={styles.list}>
            <li><a href="/contact">Contact Us</a></li>
            <li><a href="/faq">FAQ</a></li>
            <li><a href="/shipping">Shipping Info</a></li>
            <li><a href="/returns">Returns & Refunds</a></li>
            <li><a href="/track-order">Track Order</a></li>
            <li><a href="/size-guide">Size Guide</a></li>
          </ul>
        </div>

        {/* Column 4: About & Legal */}
        <div className={styles.column}>
          <h4 className={styles.heading}>Company</h4>
          <ul className={styles.list}>
            <li><a href="/about">About Us</a></li>
            <li><a href="/careers">Careers</a></li>
            <li><a href="/blog">Blog</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms & Conditions</a></li>
            <li><a href="/sitemap">Sitemap</a></li>
          </ul>
        </div>

        {/* Column 5: Contact Info */}
        <div className={styles.column}>
          <h4 className={styles.heading}>Get In Touch</h4>
          <div className={styles.contactInfo}>
            <p>
              <span className={styles.icon}>📍</span>
              <span>123 Shopping Street, Mumbai, India</span>
            </p>
            <p>
              <span className={styles.icon}>📞</span>
              <a href="tel:+911234567890">+91 12345 67890</a>
            </p>
            <p>
              <span className={styles.icon}>✉️</span>
              <a href="mailto:support@shopease.com">support@shopease.com</a>
            </p>
            <p className={styles.hours}>
              <span className={styles.icon}>🕒</span>
              <span>Mon-Sat: 9AM - 6PM</span>
            </p>
          </div>

          <div className={styles.socialLinks}>
            <h4 className={styles.heading}>Follow Us</h4>
            <div className={styles.social}>
              <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <FaFacebook size={20} />
              </a>
              <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <FaInstagram size={20} />
              </a>
              <a href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                <FaXTwitter size={20} />
              </a>
              <a href="https://youtube.com" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
                <FaYoutube size={20} />
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className={styles.bottom}>
        <p>© {currentYear} ShopEase. All rights reserved. Made with ❤️ in India</p>
        <div className={styles.bottomLinks}>
          <a href="/privacy">Privacy</a>
          <span>•</span>
          <a href="/terms">Terms</a>
          <span>•</span>
          <a href="/cookies">Cookies</a>
        </div>
      </div>
    </footer>
  );
}
