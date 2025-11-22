import React from 'react';
import './LoadingSkeleton.css';

export const MediaCardSkeleton = () => {
    return (
        <div className="media-card-skeleton">
            <div className="skeleton-poster"></div>
        </div>
    );
};

export const MediaGridSkeleton = ({ count = 12 }) => {
    return (
        <div className="media-grid">
            {Array.from({ length: count }).map((_, index) => (
                <MediaCardSkeleton key={index} />
            ))}
        </div>
    );
};

export const DetailsSkeleton = () => {
    return (
        <div className="details-skeleton">
            <div className="skeleton-poster-large"></div>
            <div className="skeleton-info">
                <div className="skeleton-title"></div>
                <div className="skeleton-meta"></div>
                <div className="skeleton-description"></div>
                <div className="skeleton-description short"></div>
            </div>
        </div>
    );
};
