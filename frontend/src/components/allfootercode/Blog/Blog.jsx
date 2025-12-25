import React from 'react';
import './Blog.css';

export default function Blog() {
  return (
    <div className="blog-page">
      <div className="blog-hero">
        <h1>ShopSphere Blog</h1>
        <p>Latest trends, tips, and shopping guides</p>
      </div>

      <div className="blog-container">
        
        {/* Featured Post */}
        <section className="featured-post">
          <div className="featured-image">
            <img src="https://images.unsplash.com/photo-1556742111-a301076d9d18?w=800&h=400&fit=crop" alt="Featured" />
          </div>
          <div className="featured-content">
            <span className="post-category">Fashion</span>
            <h2>Top 10 Fashion Trends for 2025</h2>
            <p>Discover the hottest fashion trends that will dominate 2025. From sustainable fashion to bold colors, we've got you covered.</p>
            <div className="post-meta">
              <span>📅 Dec 20, 2025</span>
              <span>👤 By Priya Sharma</span>
              <span>⏱️ 5 min read</span>
            </div>
            <button className="read-more-btn">Read More</button>
          </div>
        </section>

        {/* Recent Posts */}
        <section className="blog-section">
          <h2>Recent Articles</h2>
          <div className="blog-grid">
            
            <div className="blog-card">
              <div className="blog-image">
                <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=250&fit=crop" alt="Shopping tips" />
              </div>
              <div className="blog-content">
                <span className="post-category">Shopping Tips</span>
                <h3>How to Save Money While Shopping Online</h3>
                <p>Expert tips and tricks to get the best deals and save money on your online purchases.</p>
                <div className="post-meta">
                  <span>📅 Dec 18, 2025</span>
                  <span>⏱️ 4 min</span>
                </div>
              </div>
            </div>

            <div className="blog-card">
              <div className="blog-image">
                <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=250&fit=crop" alt="Tech gadgets" />
              </div>
              <div className="blog-content">
                <span className="post-category">Technology</span>
                <h3>Must-Have Gadgets for 2025</h3>
                <p>Check out the latest tech gadgets that will make your life easier and more enjoyable.</p>
                <div className="post-meta">
                  <span>📅 Dec 15, 2025</span>
                  <span>⏱️ 6 min</span>
                </div>
              </div>
            </div>

            <div className="blog-card">
              <div className="blog-image">
                <img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=250&fit=crop" alt="Style guide" />
              </div>
              <div className="blog-content">
                <span className="post-category">Style Guide</span>
                <h3>Winter Fashion: Stay Warm and Stylish</h3>
                <p>Your complete guide to winter fashion. Look great while staying cozy this season.</p>
                <div className="post-meta">
                  <span>📅 Dec 12, 2025</span>
                  <span>⏱️ 5 min</span>
                </div>
              </div>
            </div>

            <div className="blog-card">
              <div className="blog-image">
                <img src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=250&fit=crop" alt="Jewelry trends" />
              </div>
              <div className="blog-content">
                <span className="post-category">Jewelry</span>
                <h3>Jewelry Trends You Need to Know</h3>
                <p>From minimalist pieces to bold statement jewelry, explore what's trending this year.</p>
                <div className="post-meta">
                  <span>📅 Dec 10, 2025</span>
                  <span>⏱️ 4 min</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Categories */}
        <section className="blog-section">
          <h2>Browse by Category</h2>
          <div className="categories-grid">
            <div className="category-tag">🛍️ Shopping Tips</div>
            <div className="category-tag">👗 Fashion</div>
            <div className="category-tag">💻 Technology</div>
            <div className="category-tag">💎 Jewelry</div>
            <div className="category-tag">🏠 Home & Living</div>
            <div className="category-tag">🎁 Gift Ideas</div>
          </div>
        </section>

      </div>
    </div>
  );
}
