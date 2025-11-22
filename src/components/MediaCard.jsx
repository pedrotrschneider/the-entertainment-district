import React from 'react';
import { Link } from 'react-router-dom';
import './MediaCard.css';

const MediaCard = ({ item }) => {
    const { id, name, poster, type } = item;

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
                <div className="card-overlay">
                    <h3 className="card-title">{name}</h3>
                </div>
            </div>
        </Link>
    );
};

export default MediaCard;
