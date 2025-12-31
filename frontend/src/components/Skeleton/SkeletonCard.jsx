import React from 'react';
import './skeleton.css';

const SkeletonCard = () => {
    return (
        <div className="skeleton-card">
            <div className="skeleton-image"></div>
            <div className="skeleton-content">
                <div className="skeleton-text skeleton-title"></div>
                <div className="skeleton-text skeleton-category"></div>
                <div className="skeleton-text skeleton-price"></div>
                <div className="skeleton-button"></div>
            </div>
        </div>
    );
};

export default SkeletonCard;
