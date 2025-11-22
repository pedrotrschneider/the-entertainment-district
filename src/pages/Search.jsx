import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import cinemeta from '../services/cinemeta';
import MediaGrid from '../components/MediaGrid';
import { Search as SearchIcon } from 'lucide-react';
import './Search.css';

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [movieResults, setMovieResults] = useState([]);
    const [seriesResults, setSeriesResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState(query);

    useEffect(() => {
        const performSearch = async () => {
            if (!query) {
                setMovieResults([]);
                setSeriesResults([]);
                return;
            }

            setLoading(true);
            const [movies, series] = await Promise.all([
                cinemeta.search('movie', query),
                cinemeta.search('series', query)
            ]);

            setMovieResults(movies);
            setSeriesResults(series);
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
