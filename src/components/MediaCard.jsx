import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import './MediaCard.css';

const MediaCard = ({ item }) => {
    const { id, name, poster, type, isWatched } = item;

    return (
        <Link to={`/media/${type}/${id}`} className="media-card">
            <div className="poster-wrapper">
                {poster ? (
                    <img src={poster} alt={name} className="poster-image" loading="lazy" />
                ) : (
                    <div className="poster-placeholder">
                        <span>{name}</span>
                    </div>
                )}
                {isWatched && (
                    <div className="watched-badge">
                        <Check size={16} />
                    </div>
                )}
                <div className="card-overlay">
                    <h3 className="card-title">{name}</h3>
                </div>
            </div>
        </Link>
    );
};

export default MediaCard;
