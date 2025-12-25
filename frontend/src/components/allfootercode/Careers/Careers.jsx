import React from 'react';
import './Careers.css';

export default function Careers() {
  return (
    <div className="careers-page">
      <div className="careers-hero">
        <h1>Join Our Team</h1>
        <p>Build your career with ShopSphere</p>
      </div>

      <div className="careers-container">
        
        {/* Why Join Us */}
        <section className="careers-section">
          <h2>Why Work With Us?</h2>
          <div className="benefits-grid">
            
            <div className="benefit-card">
              <div className="benefit-icon">💼</div>
              <h3>Career Growth</h3>
              <p>Clear career paths and learning opportunities</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">🏥</div>
              <h3>Health Benefits</h3>
              <p>Comprehensive health insurance for you and family</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">🏖️</div>
              <h3>Work-Life Balance</h3>
              <p>Flexible hours and work from home options</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">🎓</div>
              <h3>Learning Budget</h3>
              <p>Annual budget for courses and conferences</p>
            </div>

          </div>
        </section>

        {/* Open Positions */}
        <section className="careers-section">
          <h2>Current Openings</h2>
          
          <div className="job-card">
            <div className="job-header">
              <h3>Senior Full Stack Developer</h3>
              <span className="job-badge">Full-time</span>
            </div>
            <p className="job-location">📍 Bangalore, India (Remote Available)</p>
            <p className="job-description">
              We're looking for an experienced full stack developer to join our tech team. 
              Work on cutting-edge e-commerce solutions.
            </p>
            <button className="apply-btn">Apply Now</button>
          </div>

          <div className="job-card">
            <div className="job-header">
              <h3>UI/UX Designer</h3>
              <span className="job-badge">Full-time</span>
            </div>
            <p className="job-location">📍 Mumbai, India</p>
            <p className="job-description">
              Create beautiful and intuitive user experiences for millions of customers.
            </p>
            <button className="apply-btn">Apply Now</button>
          </div>

          <div className="job-card">
            <div className="job-header">
              <h3>Customer Support Executive</h3>
              <span className="job-badge">Full-time</span>
            </div>
            <p className="job-location">📍 Delhi, India</p>
            <p className="job-description">
              Help our customers have the best shopping experience. Great communication skills required.
            </p>
            <button className="apply-btn">Apply Now</button>
          </div>

        </section>

        {/* Application Process */}
        <section className="careers-section">
          <h2>Application Process</h2>
          <div className="process-timeline">
            
            <div className="process-step">
              <div className="process-number">1</div>
              <h3>Apply Online</h3>
              <p>Submit your resume and cover letter</p>
            </div>

            <div className="process-step">
              <div className="process-number">2</div>
              <h3>Initial Screening</h3>
              <p>Our team reviews your application</p>
            </div>

            <div className="process-step">
              <div className="process-number">3</div>
              <h3>Interviews</h3>
              <p>Technical and cultural fit discussions</p>
            </div>

            <div className="process-step">
              <div className="process-number">4</div>
              <h3>Offer</h3>
              <p>Welcome to the team!</p>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
