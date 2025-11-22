import React, { useState } from 'react';
import MediaCard from './MediaCard';
import { MediaCardSkeleton } from './LoadingSkeleton';
import { ChevronDown, ChevronUp } from 'lucide-react';
import './MediaGrid.css';

const MediaGrid = ({ items, title, initialRows = 1, onLoadMore, loading }) => {
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
    // Check if we have more items locally OR if we can load more from server
    const hasMore = visibleCount < items.length || (onLoadMore && items.length > 0);
    const isExpanded = visibleCount > INITIAL_COUNT;

    const handleShowMore = () => {
        const newCount = visibleCount + LOAD_MORE_COUNT;
        setVisibleCount(newCount);

        // If we're showing all local items (or close to it), trigger load more
        if (onLoadMore && newCount >= items.length) {
            onLoadMore();
        }
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
                {loading && Array.from({ length: ITEMS_PER_ROW }).map((_, i) => (
                    <MediaCardSkeleton key={`skeleton-${i}`} />
                ))}
            </div>

            <div className="grid-actions">
                {hasMore && !loading && (
                    <button className="btn-show-more" onClick={handleShowMore}>
                        Show More <ChevronDown size={16} />
                    </button>
                )}
                {loading && (
                    <div className="loading-indicator">Loading...</div>
                )}
                {isExpanded && !loading && (
                    <button className="btn-show-less" onClick={handleShowLess}>
                        Show Less <ChevronUp size={16} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default MediaGrid;
