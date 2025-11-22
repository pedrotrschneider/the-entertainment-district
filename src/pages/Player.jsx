import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './Player.css';

const Player = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { streamUrl, title } = location.state || {};

    if (!streamUrl) {
        return (
            <div className="player-error">
                <p>No stream URL provided.</p>
                <button onClick={() => navigate(-1)} className="btn-back">Go Back</button>
            </div>
        );
    }

    return (
        <div className="player-page">
            <div className="player-header">
                <button onClick={() => navigate(-1)} className="btn-back-icon">
                    <ArrowLeft size={24} />
                </button>
                <span className="player-title">{title || 'Playing...'}</span>
            </div>

            <div className="video-container">
                <video
                    controls
                    autoPlay
                    src={streamUrl}
                    className="video-element"
                >
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
    );
};

export default Player;
