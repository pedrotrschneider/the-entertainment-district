import React, { useEffect, useState } from 'react';
import cinemeta from '../services/cinemeta';
import MediaGrid from '../components/MediaGrid';
import './Home.css';

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [series, setSeries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [moviesData, seriesData] = await Promise.all([
                cinemeta.getTrendingMovies(),
                cinemeta.getTrendingSeries()
            ]);
            setMovies(moviesData);
            setSeries(seriesData);
            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="loading">Loading content...</div>;
    }

    return (
        <div className="home-page">
            <div className="hero-section">
                <h1>Welcome to The Entertainment District</h1>
                <p>Discover your next obsession.</p>
            </div>

            <MediaGrid title="Trending Movies" items={movies} />
            <MediaGrid title="Trending Series" items={series} />
        </div>
    );
};

export default Home;
