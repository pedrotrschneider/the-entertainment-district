import React, { useState } from 'react';
import MediaCard from './MediaCard';
import { ChevronDown, ChevronUp } from 'lucide-react';
import './MediaGrid.css';

const MediaGrid = ({ items, title, initialRows = 1 }) => {
    // Estimate items per row based on typical screen width (responsive)
    // Mobile: 2-3, Tablet: 4-5, Desktop: 6-8
    // We'll use a conservative 6 for desktop calculation logic, 
    // but CSS grid handles the actual layout.
    const ITEMS_PER_ROW = 6;
    const INITIAL_COUNT = ITEMS_PER_ROW * initialRows;
    const LOAD_MORE_COUNT = ITEMS_PER_ROW * 4; // 4 more rows

    const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

    if (!items || items.length === 0) return null;

    const visibleItems = items.slice(0, visibleCount);
    const hasMore = visibleCount < items.length;
    const isExpanded = visibleCount > INITIAL_COUNT;

    const handleShowMore = () => {
        setVisibleCount(prev => Math.min(prev + LOAD_MORE_COUNT, items.length));
    };

    const handleShowLess = () => {
        setVisibleCount(INITIAL_COUNT);
        // Optional: scroll back to top of section
    };

    return (
        <div className="media-section">
            <div className="section-header">
                {title && <h2 className="section-title">{title}</h2>}
            </div>

            <div className="media-grid">
                {visibleItems.map((item) => (
                    <MediaCard key={item.id} item={item} />
                ))}
            </div>

            <div className="grid-actions">
                {hasMore && (
                    <button className="btn-show-more" onClick={handleShowMore}>
                        Show More <ChevronDown size={16} />
                    </button>
                )}
                {isExpanded && (
                    <button className="btn-show-less" onClick={handleShowLess}>
                        Show Less <ChevronUp size={16} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default MediaGrid;
