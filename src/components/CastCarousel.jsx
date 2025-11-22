import React from 'react';
import './CastCarousel.css';

const CastCarousel = ({ cast }) => {
    if (!cast || cast.length === 0) return null;

    return (
        <div className="cast-section">
            <h3>Cast</h3>
            <div className="cast-carousel">
                {cast.map((member, index) => {
                    // Handle both string and object formats
                    const actor = typeof member === 'string' ? member : (member.name || member);
                    const character = typeof member === 'object' ? (member.role || member.character) : null;

                    // For now, we'll use a placeholder image since Cinemeta doesn't provide actor photos
                    // In the future, you could integrate with TMDB API for actor images
                    const actorPhoto = typeof member === 'object' && member.photo
                        ? member.photo
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(actor)}&size=200&background=random`;

                    return (
                        <div key={index} className="cast-card">
                            <div className="cast-photo-wrapper">
                                <img
                                    src={actorPhoto}
                                    alt={actor}
                                    className="cast-photo"
                                    loading="lazy"
                                />
                            </div>
                            <div className="cast-info">
                                <p className="actor-name">{actor}</p>
                                {character && <p className="character-name">{character}</p>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CastCarousel;
