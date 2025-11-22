import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import cinemeta from '../services/cinemeta';
import torrentio from '../services/torrentio';
import realdebrid from '../services/realdebrid';
import rdtclient from '../services/rdtclient';
import StreamList from '../components/StreamList';
import CastCarousel from '../components/CastCarousel';
import './Details.css';

const Details = () => {
    const { type, id } = useParams();
    const navigate = useNavigate();
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [streams, setStreams] = useState([]);
    const [loadingStreams, setLoadingStreams] = useState(false);

    // Series state
    const [selectedSeason, setSelectedSeason] = useState(1);
    const [selectedEpisode, setSelectedEpisode] = useState(1);

    // Action state
    const [processing, setProcessing] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

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

    const handleStreamSelect = async (stream, action) => {
        if (processing) return;
        setProcessing(true);
        setStatusMessage(`Processing ${action}...`);

        try {
            const magnetLink = stream.url || `magnet:?xt=urn:btih:${stream.infoHash}`;

            if (action === 'download') {
                await rdtclient.addTorrent(magnetLink, type);
                alert('Added to Home Server!');
            } else if (action === 'debrid') {
                const added = await realdebrid.addMagnet(magnetLink);
                await realdebrid.selectFiles(added.id, 'all');
                alert('Added to Real-Debrid!');
            } else if (action === 'watch') {
                setStatusMessage('Adding to Debrid...');
                const added = await realdebrid.addMagnet(magnetLink);

                setStatusMessage('Selecting files...');
                await realdebrid.selectFiles(added.id, 'all');

                // Wait a moment for Real-Debrid to process
                await new Promise(resolve => setTimeout(resolve, 2000));

                setStatusMessage('Getting streaming link...');
                const info = await realdebrid.getTorrentInfo(added.id);

                // Find the largest video file (highest quality)
                if (info.links && info.links.length > 0) {
                    setStatusMessage('Unrestricting link...');
                    const unrestricted = await realdebrid.unrestrictLink(info.links[0]);

                    // Open the streamable link - Real-Debrid's download link can be streamed directly
                    // Or we can construct the streaming page URL from the unrestricted data
                    if (unrestricted.streamable === 1) {
                        // Use Real-Debrid's streaming interface
                        window.open(`https://real-debrid.com/streaming-${unrestricted.id}`, '_blank');
                    } else {
                        // Fallback: just open the download link which can still be streamed in browser
                        window.open(unrestricted.download, '_blank');
                    }
                } else {
                    alert('No links found in torrent.');
                }
            }
        } catch (error) {
            console.error('Action failed:', error);
            alert(`Action failed: ${error.message}`);
        } finally {
            setProcessing(false);
            setStatusMessage('');
        }
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

                    <CastCarousel cast={cast} />

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

            {processing && (
                <div className="processing-overlay">
                    <div className="processing-content">
                        <div className="spinner"></div>
                        <p>{statusMessage}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Details;
