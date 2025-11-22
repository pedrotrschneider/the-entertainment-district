import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import cinemeta from '../services/cinemeta';
import torrentio from '../services/torrentio';
import StreamList from '../components/StreamList';
import './Details.css';

const Details = () => {
    const { type, id } = useParams();
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [streams, setStreams] = useState([]);
    const [loadingStreams, setLoadingStreams] = useState(false);

    // Series state
    const [selectedSeason, setSelectedSeason] = useState(1);
    const [selectedEpisode, setSelectedEpisode] = useState(1);

    useEffect(() => {
        const fetchMeta = async () => {
            setLoading(true);
            const data = await cinemeta.getMeta(type, id);
            setMeta(data);
            setLoading(false);
        };

        if (type && id) {
            fetchMeta();
        }
    }, [type, id]);

    useEffect(() => {
        const fetchStreams = async () => {
            if (!meta) return;

            setLoadingStreams(true);
            let streamId = id;

            if (type === 'series') {
                streamId = `${id}:${selectedSeason}:${selectedEpisode}`;
            }

            const streamData = await torrentio.getStreams(type, streamId);
            setStreams(streamData);
            setLoadingStreams(false);
        };

        if (meta) {
            fetchStreams();
        }
    }, [meta, type, id, selectedSeason, selectedEpisode]);

    const handleStreamSelect = (stream, action) => {
        console.log('Selected stream:', stream, 'Action:', action);
        // TODO: Implement actions in Phase 4
        alert(`Action: ${action}\nStream: ${stream.title || 'Unknown'}`);
    };

    if (loading) {
        return <div className="loading">Loading details...</div>;
    }

    if (!meta) {
        return <div className="error">Media not found.</div>;
    }

    const { name, description, poster, background, imdbRating, releaseInfo, cast, videos } = meta;

    // Extract seasons if it's a series
    const seasons = type === 'series' && videos
        ? [...new Set(videos.map(v => v.season))].sort((a, b) => a - b)
        : [];

    const episodes = type === 'series' && videos
        ? videos.filter(v => v.season === selectedSeason).sort((a, b) => a.episode - b.episode)
        : [];

    return (
        <div className="details-page">
            <div
                className="details-background"
                style={{ backgroundImage: `url(${background})` }}
            />
            <div className="details-overlay" />

            <div className="details-content">
                <div className="details-poster">
                    <img src={poster} alt={name} />
                </div>

                <div className="details-info">
                    <h1 className="media-title">{name}</h1>

                    <div className="media-meta-row">
                        {imdbRating && <span className="imdb-rating">IMDb: {imdbRating}</span>}
                        {releaseInfo && <span className="release-year">{releaseInfo}</span>}
                        <span className="media-type">{type === 'series' ? 'TV Series' : 'Movie'}</span>
                    </div>

                    <p className="media-description">{description}</p>

                    {cast && cast.length > 0 && (
                        <div className="media-cast">
                            <h3>Cast</h3>
                            <p>{cast.slice(0, 5).map(c => c.name).join(', ')}</p>
                        </div>
                    )}

                    {type === 'series' && (
                        <div className="series-selector">
                            <div className="selector-group">
                                <label>Season</label>
                                <select
                                    value={selectedSeason}
                                    onChange={(e) => {
                                        setSelectedSeason(Number(e.target.value));
                                        setSelectedEpisode(1); // Reset episode on season change
                                    }}
                                >
                                    {seasons.map(s => (
                                        <option key={s} value={s}>Season {s}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="selector-group">
                                <label>Episode</label>
                                <select
                                    value={selectedEpisode}
                                    onChange={(e) => setSelectedEpisode(Number(e.target.value))}
                                >
                                    {episodes.map(e => (
                                        <option key={e.episode} value={e.episode}>
                                            {e.episode}. {e.name || `Episode ${e.episode}`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    <div className="streams-section">
                        {loadingStreams ? (
                            <div className="loading-streams">Searching for streams...</div>
                        ) : (
                            <StreamList streams={streams} onSelect={handleStreamSelect} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Details;
