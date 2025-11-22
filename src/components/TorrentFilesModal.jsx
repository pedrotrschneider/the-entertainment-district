import React, { useState, useEffect } from 'react';
import { X, Play, File } from 'lucide-react';
import realdebrid from '../services/realdebrid';
import './TorrentFilesModal.css';

const TorrentFilesModal = ({ isOpen, onClose, magnetLink, mediaTitle }) => {
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState([]);
    const [torrentId, setTorrentId] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isOpen || !magnetLink) return;

        const fetchFiles = async () => {
            setLoading(true);
            setError(null);

            try {
                // Add magnet to Real-Debrid
                const added = await realdebrid.addMagnet(magnetLink);
                setTorrentId(added.id);

                // Select all files
                await realdebrid.selectFiles(added.id, 'all');

                // Wait for Real-Debrid to process
                await new Promise(resolve => setTimeout(resolve, 2000));

                // Get torrent info with files
                const info = await realdebrid.getTorrentInfo(added.id);

                if (info.files) {
                    setFiles(info.files);
                } else {
                    setError('No files found in torrent');
                }
            } catch (err) {
                console.error('Error fetching torrent files:', err);
                setError(err.message || 'Failed to fetch torrent files');
            } finally {
                setLoading(false);
            }
        };

        fetchFiles();
    }, [isOpen, magnetLink]);

    const handlePlayFile = async (fileIndex) => {
        try {
            const info = await realdebrid.getTorrentInfo(torrentId);

            if (info.links && info.links[fileIndex]) {
                const unrestricted = await realdebrid.unrestrictLink(info.links[fileIndex]);

                if (unrestricted.streamable === 1) {
                    window.open(`https://real-debrid.com/streaming-${unrestricted.id}`, '_blank');
                } else {
                    window.open(unrestricted.download, '_blank');
                }
            }
        } catch (err) {
            console.error('Error playing file:', err);
            alert('Failed to play file: ' + err.message);
        }
    };

    const isVideoFile = (filename) => {
        const videoExtensions = ['.mp4', '.mkv', '.avi', '.mov', '.wmv', '.flv', '.webm', '.m4v'];
        return videoExtensions.some(ext => filename.toLowerCase().endsWith(ext));
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Torrent Files</h2>
                    <button className="modal-close" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                {mediaTitle && <p className="modal-subtitle">{mediaTitle}</p>}

                <div className="modal-body">
                    {loading ? (
                        <div className="modal-loading">
                            <div className="spinner"></div>
                            <p>Loading files...</p>
                        </div>
                    ) : error ? (
                        <div className="modal-error">
                            <p>{error}</p>
                        </div>
                    ) : (
                        <div className="files-list">
                            {files.map((file, index) => (
                                <div key={index} className="file-item">
                                    <div className="file-info">
                                        {isVideoFile(file.path) ? (
                                            <Play size={18} className="file-icon video-icon" />
                                        ) : (
                                            <File size={18} className="file-icon" />
                                        )}
                                        <div className="file-details">
                                            <p className="file-name">{file.path}</p>
                                            <p className="file-size">{formatFileSize(file.bytes)}</p>
                                        </div>
                                    </div>

                                    {isVideoFile(file.path) && (
                                        <button
                                            className="btn-play-file"
                                            onClick={() => handlePlayFile(index)}
                                        >
                                            <Play size={16} />
                                            Play Now
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TorrentFilesModal;
