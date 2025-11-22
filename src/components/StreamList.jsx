import React from 'react';
import { Download, Play, HardDrive } from 'lucide-react';
import './StreamList.css';

const StreamList = ({ streams, onSelect }) => {
    if (!streams || streams.length === 0) {
        return <div className="no-streams">No streams found.</div>;
    }

    // Helper to parse stream title for quality/size info
    // Torrentio titles usually look like: "Title \n Quality \n Size \n Seeds"
    const parseStream = (stream) => {
        const titleParts = stream.title ? stream.title.split('\n') : [];
        const nameParts = stream.name ? stream.name.split('\n') : [];

        return {
            quality: titleParts[0] || 'Unknown',
            size: titleParts[1] || '',
            seeds: titleParts[2] || '',
            source: nameParts[0] || 'Torrentio',
            infoHash: stream.infoHash
        };
    };

    return (
        <div className="stream-list">
            <h3>Available Streams</h3>
            <div className="streams-container">
                {streams.map((stream, index) => {
                    const info = parseStream(stream);
                    return (
                        <div key={index} className="stream-item">
                            <div className="stream-info">
                                <div className="stream-quality">{info.quality}</div>
                                <div className="stream-meta">
                                    <span className="stream-size">{info.size}</span>
                                    {info.seeds && <span className="stream-seeds">{info.seeds}</span>}
                                    <span className="stream-source">{info.source}</span>
                                </div>
                            </div>

                            <div className="stream-actions">
                                <button
                                    className="btn-action btn-download"
                                    onClick={() => onSelect(stream, 'download')}
                                    title="Download to Home Server"
                                >
                                    <HardDrive size={18} />
                                </button>
                                <button
                                    className="btn-action btn-debrid"
                                    onClick={() => onSelect(stream, 'debrid')}
                                    title="Add to Debrid"
                                >
                                    <Download size={18} />
                                </button>
                                <button
                                    className="btn-action btn-watch"
                                    onClick={() => onSelect(stream, 'watch')}
                                    title="Watch Now"
                                >
                                    <Play size={18} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StreamList;
