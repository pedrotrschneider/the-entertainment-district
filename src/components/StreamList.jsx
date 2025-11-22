import React from 'react';
import { Download, Play, HardDrive, Link } from 'lucide-react';
import { useToast } from './Toast';
import useServiceStatusStore from '../store/serviceStatusStore';
import './StreamList.css';

const StreamList = ({ streams, onSelect }) => {
    const toast = useToast();
    const { isRealDebridAvailable, isRdtClientAvailable } = useServiceStatusStore();

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

    const getMagnetLink = (stream) => {
        return stream.url || `magnet:?xt=urn:btih:${stream.infoHash}`;
    };

    const handleCopyMagnet = (stream) => {
        const magnetLink = getMagnetLink(stream);
        navigator.clipboard.writeText(magnetLink).then(() => {
            toast.success('Magnet link copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy:', err);
            toast.error('Failed to copy magnet link');
        });
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
                                    {info.seeds && <span className="stream-seeds">{info.seeds}</span>}
                                    <span className="stream-source">{info.source}</span>
                                </div>
                            </div>

                            <div className="stream-actions">
                                <button
                                    className="btn-action btn-copy"
                                    onClick={() => handleCopyMagnet(stream)}
                                    title="Copy Magnet Link"
                                >
                                    <Link size={18} />
                                    <span>Copy</span>
                                </button>
                                <button
                                    className="btn-action btn-download"
                                    onClick={() => onSelect(stream, 'download')}
                                    title={isRdtClientAvailable() ? "Download to Home Server" : "RDT Client not connected"}
                                    disabled={!isRdtClientAvailable()}
                                >
                                    <HardDrive size={18} />
                                    <span>Download</span>
                                </button>
                                <button
                                    className="btn-action btn-debrid"
                                    onClick={() => onSelect(stream, 'debrid')}
                                    title={isRealDebridAvailable() ? "Add to Debrid" : "Real-Debrid not connected"}
                                    disabled={!isRealDebridAvailable()}
                                >
                                    <Download size={18} />
                                    <span>Add</span>
                                </button>
                                <button
                                    className="btn-action btn-watch"
                                    onClick={() => onSelect(stream, 'watch')}
                                    title={isRealDebridAvailable() ? "Watch Now" : "Real-Debrid not connected"}
                                    disabled={!isRealDebridAvailable()}
                                >
                                    <Play size={18} />
                                    <span>Watch</span>
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
