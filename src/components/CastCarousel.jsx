import React from 'react';
import './CastCarousel.css';

const CastCarousel = ({ cast }) => {
    if (!cast || cast.length === 0) return null;

    return (
        <div className="cast-section">
            <h3>Cast</h3>
            <div className="cast-carousel">
                {cast.map((member, index) => {
                    let actorName = '';
                    let character = '';
                    let photoUrl = '';

                    // Handle TMDB format (from enhanced cast)
                    if (member.profile_path) {
                        actorName = member.name || '';
                        character = member.character || '';
                        photoUrl = member.profile_path;
                    }
                    // Handle Cinemeta string format
                    else if (typeof member === 'string') {
                        actorName = member;
                    }
                    // Handle Cinemeta object format
                    else if (typeof member === 'object') {
                        actorName = member.name || '';
                        character = member.role || member.character || '';
                        photoUrl = member.image || member.photo || '';
                    }

                    // Generate placeholder if no photo
                    const finalPhotoUrl = photoUrl ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(actorName)}&size=200&background=random&color=fff`;

                    return (
                        <div key={index} className="cast-card">
                            <div className="cast-photo-wrapper">
                                <img
                                    src={finalPhotoUrl}
                                    alt={actorName}
                                    className="cast-photo"
                                    loading="lazy"
                                />
                            </div>
                            <div className="cast-info">
                                <p className="actor-name">{actorName}</p>
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
