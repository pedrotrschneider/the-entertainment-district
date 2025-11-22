import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import './MediaCard.css';

const MediaCard = ({ item }) => {
    const { id, name, poster, type, isWatched, description, year, releaseInfo, imdbRating } = item;

    // Use year or releaseInfo
    const displayYear = year || releaseInfo;

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
                {item.episodeInfo && (
                    <div className="episode-badge">
                        {item.episodeInfo}
                    </div>
                )}
                <div className="card-overlay">
                    <h3 className="card-title">{name}</h3>
                    <div className="card-meta">
                        {displayYear && <span className="card-year">{displayYear}</span>}
                        {imdbRating && <span className="card-rating">★ {imdbRating}</span>}
                    </div>
                    {description && (
                        <p className="card-description">{description}</p>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default MediaCard;
