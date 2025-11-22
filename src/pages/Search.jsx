import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import cinemeta from '../services/cinemeta';
import MediaGrid from '../components/MediaGrid';
import { Search as SearchIcon, Star } from 'lucide-react';
import './Search.css';

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const query = searchParams.get('q') || '';
    const [movieResults, setMovieResults] = useState([]);
    const [seriesResults, setSeriesResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState(query);

    // Live search state
    const [liveResults, setLiveResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const searchTimeout = useRef(null);

    // Debounced live search
    useEffect(() => {
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        if (searchTerm.trim().length > 2) {
            searchTimeout.current = setTimeout(async () => {
                const [movies, series] = await Promise.all([
                    cinemeta.search('movie', searchTerm),
                    cinemeta.search('series', searchTerm)
                ]);

                // Combine and sort by popularity/relevance (Cinemeta returns sorted)
                const combined = [
                    ...movies.map(m => ({ ...m, type: 'movie' })),
                    ...series.map(s => ({ ...s, type: 'series' }))
                ].slice(0, 8); // Limit to 8 results

                setLiveResults(combined);
                setShowDropdown(true);
            }, 300);
        } else {
            setLiveResults([]);
            setShowDropdown(false);
        }

        return () => {
            if (searchTimeout.current) {
                clearTimeout(searchTimeout.current);
            }
        };
    }, [searchTerm]);

    const handleSearch = (e) => {
        e.preventDefault();
        setShowDropdown(false);
        if (searchTerm.trim()) {
            setSearchParams({ q: searchTerm });
        }
    };

    const handleResultClick = (type, id) => {
        navigate(`/media/${type}/${id}`);
        setShowDropdown(false);
    };

    return (
        <div className="search-page">
            <div className="search-header">
                <div className="search-container">
                    <form onSubmit={handleSearch} className="search-form">
                        <SearchIcon className="search-icon" size={20} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={() => searchTerm.length > 2 && setShowDropdown(true)}
                            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                            placeholder="Search for movies or shows..."
                            className="search-input"
                            autoFocus
                        />
                    </form>

                    {showDropdown && liveResults.length > 0 && (
                        <div className="search-dropdown">
                            {liveResults.map((item) => (
                                <div
                                    key={item.id}
                                    className="search-result-item"
                                    onClick={() => handleResultClick(item.type, item.id)}
                                >
                                    <div className="result-info">
                                        <div className="result-title-row">
                                            <span className="result-title">{item.name}</span>
                                            {(item.year || item.releaseInfo) && (
                                                <span className="result-year">({item.year || item.releaseInfo})</span>
                                            )}
                                        </div>
                                        <div className="result-meta-row">
                                            <span className={`result-type ${item.type}`}>
                                                {item.type === 'series' ? 'Show' : 'Movie'}
                                            </span>
                                            {item.imdbRating && (
                                                <span className="result-rating">
                                                    <Star size={12} fill="#f5c518" strokeWidth={0} />
                                                    {item.imdbRating}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="result-poster">
                                        <img src={item.poster || '/placeholder.png'} alt={item.name} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="loading">Searching...</div>
            ) : (
                <>
                    {movieResults.length > 0 && (
                        <MediaGrid
                            title="Movies"
                            items={movieResults}
                        />
                    )}

                    {seriesResults.length > 0 && (
                        <MediaGrid
                            title="TV Shows"
                            items={seriesResults}
                        />
                    )}

                    {!loading && query && movieResults.length === 0 && seriesResults.length === 0 && (
                        <div className="no-results">
                            <p>No results found for "{query}"</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Search;
