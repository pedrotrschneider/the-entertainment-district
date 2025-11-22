import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import cinemeta from '../services/cinemeta';
import MediaGrid from '../components/MediaGrid';
import { Search as SearchIcon } from 'lucide-react';
import './Search.css';

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState(query);

    useEffect(() => {
        const performSearch = async () => {
            if (!query) {
                setResults([]);
                return;
            }

            setLoading(true);
            const [movieResults, seriesResults] = await Promise.all([
                cinemeta.search('movie', query),
                cinemeta.search('series', query)
            ]);

            // Combine and deduplicate if necessary, or show sections
            // For now, let's combine them
            setResults([...movieResults, ...seriesResults]);
            setLoading(false);
        };

        performSearch();
    }, [query]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            setSearchParams({ q: searchTerm });
        }
    };

    return (
        <div className="search-page">
            <div className="search-header">
                <form onSubmit={handleSearch} className="search-form">
                    <SearchIcon className="search-icon" size={20} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search for movies or shows..."
                        className="search-input"
                        autoFocus
                    />
                </form>
            </div>

            {loading ? (
                <div className="loading">Searching...</div>
            ) : (
                <MediaGrid
                    title={query ? `Results for "${query}"` : 'Start searching'}
                    items={results}
                />
            )}
        </div>
    );
};

export default Search;
