import React, { useState, useEffect, useRef } from 'react';
import cinemeta from '../services/cinemeta';
import MediaGrid from './MediaGrid';
import { MediaGridSkeleton } from './LoadingSkeleton';

const CategorySection = ({ title, type, category, genre }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [skip, setSkip] = useState(0);
    const [loadingMore, setLoadingMore] = useState(false);
    const loadedRef = useRef(false);

    useEffect(() => {
        if (!loadedRef.current) {
            fetchData();
            loadedRef.current = true;
        }
    }, []);

    const fetchData = async () => {
        try {
            // Fetch batch (Cinemeta usually returns ~100 items)
            const newItems = await cinemeta.getCatalog(type, category, genre, skip);

            if (newItems && newItems.length > 0) {
                setItems(prev => {
                    // Filter duplicates just in case
                    const existingIds = new Set(prev.map(i => i.id));
                    const uniqueNew = newItems.filter(i => !existingIds.has(i.id));
                    return [...prev, ...uniqueNew];
                });
            }
        } catch (error) {
            console.error('Error fetching category:', title, error);
        } finally {
            setLoading(false);
        }
    };

    const handleLoadMore = async () => {
        if (loadingMore) return;
        setLoadingMore(true);

        // Increment skip and fetch more
        // Assuming batch size is roughly 100
        const nextSkip = skip + 100;
        setSkip(nextSkip);

        // We need to fetch with the new skip
        // Note: setState is async, so we use the value directly or useEffect
        // But here we want to trigger it explicitly.
        // Let's just call fetch with explicit skip
        try {
            const newItems = await cinemeta.getCatalog(type, category, genre, nextSkip);
            if (newItems && newItems.length > 0) {
                setItems(prev => {
                    const existingIds = new Set(prev.map(i => i.id));
                    const uniqueNew = newItems.filter(i => !existingIds.has(i.id));
                    return [...prev, ...uniqueNew];
                });
            }
        } catch (error) {
            console.error('Error loading more:', error);
        } finally {
            setLoadingMore(false);
        }
    };

    if (loading && items.length === 0) {
        return <MediaGridSkeleton count={6} />;
    }

    if (items.length === 0) return null;

    return (
        <MediaGrid
            title={title}
            items={items}
            onLoadMore={handleLoadMore}
            loading={loadingMore}
        />
    );
};

export default CategorySection;
