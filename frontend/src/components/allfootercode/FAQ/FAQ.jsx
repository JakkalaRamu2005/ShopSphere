import { useState } from "react";
import styles from "./FAQ.module.css";

const faqData = [
  {
    category: "Orders & Shipping",
    questions: [
      {
        id: 1,
        question: "How can I track my order?",
        answer: "You can track your order by logging into your account and visiting the 'Order History' section. Click on the order number to see real-time tracking updates. You'll also receive tracking information via email once your order ships."
      },
      {
        id: 2,
        question: "What are the shipping charges?",
        answer: "We offer FREE shipping on orders above ₹999. For orders below ₹999, shipping charges are ₹99. Express shipping (1-2 days delivery) is available for ₹199 extra."
      },
      {
        id: 3,
        question: "How long will delivery take?",
        answer: "Standard delivery takes 3-7 business days. Express delivery takes 1-2 business days. Delivery time may vary based on your location and product availability."
      },
      {
        id: 4,
        question: "Do you ship internationally?",
        answer: "Currently, we only ship within India. We're working on expanding to international shipping soon. Subscribe to our newsletter to get updates."
      }
    ]
  },
  {
    category: "Returns & Refunds",
    questions: [
      {
        id: 5,
        question: "What is your return policy?",
        answer: "We accept returns within 7 days of delivery. Products must be unused, in original packaging with tags intact. To initiate a return, go to 'Order History' and click 'Return Item'."
      },
      {
        id: 6,
        question: "How do I get a refund?",
        answer: "Refunds are processed within 5-7 business days after we receive your returned item. The amount will be credited to your original payment method. For COD orders, refund will be via bank transfer."
      },
      {
        id: 7,
        question: "Can I exchange a product?",
        answer: "Yes! You can exchange products for different size/color within 7 days. Go to 'Order History', select the item, and choose 'Exchange'. We'll ship the new product once we receive the original item."
      }
    ]
  },
  {
    category: "Payment & Pricing",
    questions: [
      {
        id: 8,
        question: "What payment methods do you accept?",
        answer: "We accept Credit/Debit Cards (Visa, Mastercard, RuPay), UPI, Net Banking, Wallets (PayTM, PhonePe, Google Pay), and Cash on Delivery (COD)."
      },
      {
        id: 9,
        question: "Is it safe to use my card on your website?",
        answer: "Yes! We use SSL encryption and comply with PCI-DSS standards. Your card details are never stored on our servers. All transactions are processed through secure payment gateways."
      },
      {
        id: 10,
        question: "Do you offer EMI options?",
        answer: "Yes, we offer No Cost EMI on orders above ₹3,000 for 3, 6, and 9 months. EMI is available on major credit cards from HDFC, ICICI, SBI, and Axis Bank."
      }
    ]
  },
  {
    category: "Account & Orders",
    questions: [
      {
        id: 11,
        question: "How do I create an account?",
        answer: "Click 'Sign Up' at the top right, enter your email and password, and verify your email. You can also sign up using Google or Facebook for faster registration."
      },
      {
        id: 12,
        question: "I forgot my password. What should I do?",
        answer: "Click 'Forgot Password' on the login page, enter your registered email, and we'll send you a password reset link. The link is valid for 1 hour."
      },
      {
        id: 13,
        question: "Can I cancel my order?",
        answer: "Yes, you can cancel your order before it's shipped. Go to 'Order History', select the order, and click 'Cancel Order'. Refund will be processed within 3-5 business days."
      }
    ]
  },
  {
    category: "Products & Stock",
    questions: [
      {
        id: 14,
        question: "How do I know if a product is in stock?",
        answer: "Product availability is shown on each product page. If it says 'In Stock', you can order it immediately. For 'Out of Stock' items, click 'Notify Me' to get an email when it's back."
      },
      {
        id: 15,
        question: "Are your products authentic?",
        answer: "100% Yes! We source all products directly from authorized distributors and brands. Every product comes with original packaging, warranty card, and authenticity certificate."
      }
    ]
  }
];

export default function FAQ() {
  const [openId, setOpenId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleQuestion = (id) => {
    setOpenId(openId === id ? null : id);
  };

  const filteredData = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(q =>
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className={styles.faqPage}>
      <div className={styles.hero}>
        <h1>Frequently Asked Questions</h1>
        <p>Find answers to common questions about orders, shipping, and more</p>
      </div>

      <div className={styles.container}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search for answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          <span className={styles.searchIcon}>🔍</span>
        </div>

        {filteredData.length === 0 ? (
          <p className={styles.noResults}>No results found. Try a different search term.</p>
        ) : (
          filteredData.map((category, idx) => (
            <div key={idx} className={styles.category}>
              <h2 className={styles.categoryTitle}>{category.category}</h2>
              <div className={styles.questions}>
                {category.questions.map((item) => (
                  <div key={item.id} className={styles.faqItem}>
                    <button
                      className={`${styles.question} ${openId === item.id ? styles.active : ""}`}
                      onClick={() => toggleQuestion(item.id)}
                    >
                      <span>{item.question}</span>
                      <span className={styles.icon}>
                        {openId === item.id ? "−" : "+"}
                      </span>
                    </button>
                    <div className={`${styles.answer} ${openId === item.id ? styles.show : ""}`}>
                      <p>{item.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}

        <div className={styles.contactCta}>
          <h3>Still have questions?</h3>
          <p>Can't find what you're looking for? Our support team is here to help.</p>
          <a href="/contact" className={styles.contactBtn}>Contact Us</a>
        </div>
      </div>
    </div>
  );
}
