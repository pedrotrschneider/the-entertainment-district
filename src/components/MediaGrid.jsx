import React from 'react';
import MediaCard from './MediaCard';
import './MediaGrid.css';

const MediaGrid = ({ items, title }) => {
    if (!items || items.length === 0) return null;

    return (
        <div className="media-section">
            {title && <h2 className="section-title">{title}</h2>}
            <div className="media-grid">
                {items.map((item) => (
                    <MediaCard key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
};

export default MediaGrid;
