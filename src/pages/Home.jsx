import React, { useEffect, useState } from 'react';
import cinemeta from '../services/cinemeta';
import trakt from '../services/trakt';
import useSettingsStore from '../store/settingsStore';
import MediaGrid from '../components/MediaGrid';
import { MediaGridSkeleton } from '../components/LoadingSkeleton';
import './Home.css';

const Home = () => {
    const { traktAccessToken } = useSettingsStore();
    const [movies, setMovies] = useState([]);
    const [series, setSeries] = useState([]);
    const [continueWatching, setContinueWatching] = useState([]);
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [traktLoading, setTraktLoading] = useState(false);

    const [genres, setGenres] = useState({});

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (traktAccessToken) {
            fetchTraktData();
        }
    }, [traktAccessToken]);

    const fetchData = async () => {
        setLoading(true);

        // Fetch trending
        const [moviesData, seriesData] = await Promise.all([
            cinemeta.getTrendingMovies(),
            cinemeta.getTrendingSeries()
        ]);
        setMovies(moviesData);
        setSeries(seriesData);

        // Fetch genres
        const genreList = ['Action', 'Comedy', 'Horror', 'Romance', 'Sci-Fi'];
        const genreResults = {};

        // Fetch movies for each genre
        await Promise.all(genreList.map(async (genre) => {
            const results = await cinemeta.getCatalog('movie', 'top', genre);
            genreResults[genre] = results;
        }));

        setGenres(genreResults);
        setLoading(false);
    };

    const fetchTraktData = async () => {
        setTraktLoading(true);
        try {
            // Fetch watch history for Continue Watching
            // Fetch more items to ensure we have enough unique shows after filtering
            const history = await trakt.getHistory('all', 1, 50);

            const uniqueItems = [];
            const seenIds = new Set();

            for (const item of history) {
                const mediaItem = item.movie || item.show;
                const imdbId = mediaItem.ids.imdb;

                if (!seenIds.has(imdbId)) {
                    seenIds.add(imdbId);
                    uniqueItems.push(item);
                }

                if (uniqueItems.length >= 10) break;
            }

            const continueItems = await Promise.all(
                uniqueItems.map(async (item) => {
                    const mediaItem = item.movie || item.show;
                    const imdbId = mediaItem.ids.imdb;
                    const mediaType = item.movie ? 'movie' : 'series';

                    let poster = '/placeholder.png';
                    try {
                        const metaData = await cinemeta.getMeta(mediaType, imdbId);
                        poster = metaData.poster;
                    } catch (err) {
                        console.error('Failed to fetch meta:', err);
                    }

                    // Extract episode info if available
                    let episodeInfo = null;
                    if (item.episode) {
                        episodeInfo = `S${item.episode.season} E${item.episode.number}`;
                    }

                    return {
                        id: imdbId,
                        name: mediaItem.title,
                        type: mediaType,
                        poster: poster,
                        isWatched: true,
                        episodeInfo: episodeInfo
                    };
                })
            );
            setContinueWatching(continueItems);

            // Fetch watchlist
            const watchlistData = await trakt.getWatchlist('all');
            const watchlistItems = await Promise.all(
                watchlistData.slice(0, 20).map(async (item) => {
                    const mediaItem = item.movie || item.show;
                    const imdbId = mediaItem.ids.imdb;
                    const mediaType = item.movie ? 'movie' : 'series';

                    let poster = '/placeholder.png';
                    try {
                        const metaData = await cinemeta.getMeta(mediaType, imdbId);
                        poster = metaData.poster;
                    } catch (err) {
                        console.error('Failed to fetch meta:', err);
                    }

                    return {
                        id: imdbId,
                        name: mediaItem.title,
                        type: mediaType,
                        poster: poster
                    };
                })
            );
            setWatchlist(watchlistItems);
        } catch (error) {
            console.error('Failed to fetch Trakt data:', error);
        } finally {
            setTraktLoading(false);
        }
    };

    return (
        <div className="home-page">
            <div className="hero-section">
                <h1>Welcome to The Entertainment District</h1>
                <p>Discover your next obsession.</p>
            </div>

            {traktAccessToken && (
                <>
                    {traktLoading ? (
                        <>
                            <MediaGridSkeleton count={10} />
                            <MediaGridSkeleton count={10} />
                        </>
                    ) : (
                        <>
                            {continueWatching.length > 0 && (
                                <MediaGrid title="Continue Watching" items={continueWatching} />
                            )}
                            {watchlist.length > 0 && (
                                <MediaGrid title="My Watchlist" items={watchlist} />
                            )}
                        </>
                    )}
                </>
            )}

            {loading ? (
                <>
                    <MediaGridSkeleton count={12} />
                    <MediaGridSkeleton count={12} />
                    <MediaGridSkeleton count={12} />
                </>
            ) : (
                <>
                    <MediaGrid title="Trending Movies" items={movies} />
                    <MediaGrid title="Trending Series" items={series} />

                    {Object.entries(genres).map(([genre, items]) => (
                        <MediaGrid
                            key={genre}
                            title={`${genre} Movies`}
                            items={items}
                        />
                    ))}
                </>
            )}
        </div>
    );
};

export default Home;
