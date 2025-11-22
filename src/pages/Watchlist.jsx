import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import trakt from '../services/trakt';
import cinemeta from '../services/cinemeta';
import useSettingsStore from '../store/settingsStore';
import MediaGrid from '../components/MediaGrid';
import './Watchlist.css';

const Watchlist = () => {
    const navigate = useNavigate();
    const { traktAccessToken, traktAccountInfo } = useSettingsStore();
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'movies', 'shows'
    const [watchHistory, setWatchHistory] = useState([]);

    useEffect(() => {
        if (!traktAccessToken || !traktAccountInfo) {
            navigate('/settings');
            return;
        }

        fetchWatchHistory();
        fetchWatchlist();
    }, [traktAccessToken, traktAccountInfo, filter, navigate]);

    const fetchWatchHistory = async () => {
        try {
            const history = await trakt.getHistory('all', 1, 100);
            const watchedIds = history.map(item => {
                const mediaItem = item.movie || item.show;
                return mediaItem.ids.imdb;
            });
            setWatchHistory(watchedIds);
        } catch (error) {
            console.error('Failed to fetch watch history:', error);
        }
    };

    const fetchWatchlist = async () => {
        setLoading(true);
        try {
            const data = await trakt.getWatchlist(filter === 'all' ? 'all' : filter);

            // Convert Trakt format to Cinemeta format for MediaGrid
            const converted = await Promise.all(data.map(async (item) => {
                const mediaItem = item.movie || item.show;
                const imdbId = mediaItem.ids.imdb;
                const mediaType = item.movie ? 'movie' : 'series';

                // Fetch meta from Cinemeta to get proper poster URL
                let poster = '/placeholder.png';
                try {
                    const metaData = await cinemeta.getMeta(mediaType, imdbId);
                    poster = metaData.poster;
                } catch (err) {
                    console.error('Failed to fetch meta for', imdbId, err);
                }

                return {
                    id: imdbId || mediaItem.ids.trakt.toString(),
                    name: mediaItem.title,
                    type: mediaType,
                    poster: poster,
                    year: mediaItem.year,
                    description: mediaItem.overview || '',
                    isWatched: watchHistory.includes(imdbId)
                };
            }));

            setWatchlist(converted);
        } catch (error) {
            console.error('Failed to fetch watchlist:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="watchlist-page">
                <h1>My Watchlist</h1>
                <div className="loading">Loading watchlist...</div>
            </div>
        );
    }

    return (
        <div className="watchlist-page">
            <div className="watchlist-header">
                <h1>My Watchlist</h1>
                <div className="filter-buttons">
                    <button
                        className={filter === 'all' ? 'active' : ''}
                        onClick={() => setFilter('all')}
                    >
                        All
                    </button>
                    <button
                        className={filter === 'movies' ? 'active' : ''}
                        onClick={() => setFilter('movies')}
                    >
                        Movies
                    </button>
                    <button
                        className={filter === 'shows' ? 'active' : ''}
                        onClick={() => setFilter('shows')}
                    >
                        TV Shows
                    </button>
                </div>
            </div>

            {watchlist.length === 0 ? (
                <div className="empty-watchlist">
                    <p>Your watchlist is empty</p>
                    <p className="hint">Add movies and shows from the details page</p>
                </div>
            ) : (
                <MediaGrid items={watchlist} />
            )}
        </div>
    );
};

export default Watchlist;
