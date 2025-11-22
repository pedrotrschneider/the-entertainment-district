import React, { useState, useEffect } from 'react';
import cinemeta from '../services/cinemeta';
import MediaGrid from '../components/MediaGrid';
import { MediaGridSkeleton } from '../components/LoadingSkeleton';
import { Film, Tv } from 'lucide-react';
import './Discover.css';

const GENRES = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime',
    'Documentary', 'Drama', 'Family', 'Fantasy', 'History',
    'Horror', 'Music', 'Mystery', 'Romance', 'Sci-Fi',
    'Sport', 'Thriller', 'War', 'Western'
];

const Discover = () => {
    const [type, setType] = useState('movie');
    const [selectedGenre, setSelectedGenre] = useState('Action');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [type, selectedGenre]);

    const fetchData = async () => {
        setLoading(true);
        const results = await cinemeta.getCatalog(type, 'top', selectedGenre);
        setItems(results);
        setLoading(false);
    };

    return (
        <div className="discover-page">
            <div className="discover-header">
                <h1 className="page-title">Discover</h1>

                <div className="type-selector">
                    <button
                        className={`type-btn ${type === 'movie' ? 'active' : ''}`}
                        onClick={() => setType('movie')}
                    >
                        <Film size={18} /> Movies
                    </button>
                    <button
                        className={`type-btn ${type === 'series' ? 'active' : ''}`}
                        onClick={() => setType('series')}
                    >
                        <Tv size={18} /> TV Shows
                    </button>
                </div>
            </div>

            <div className="genre-list">
                {GENRES.map(genre => (
                    <button
                        key={genre}
                        className={`genre-chip ${selectedGenre === genre ? 'active' : ''}`}
                        onClick={() => setSelectedGenre(genre)}
                    >
                        {genre}
                    </button>
                ))}
            </div>

            <div className="discover-content">
                {loading ? (
                    <MediaGridSkeleton count={18} />
                ) : (
                    <MediaGrid
                        title={`${selectedGenre} ${type === 'movie' ? 'Movies' : 'TV Shows'}`}
                        items={items}
                        initialRows={3}
                    />
                )}
            </div>
        </div>
    );
};

export default Discover;
