import React, { useState, useEffect } from 'react';
import { X, File, Play } from 'lucide-react';
import useSettingsStore from '../store/settingsStore';
import realdebrid from '../services/realdebrid';
import './DownloadOptionsModal.css';

const DownloadOptionsModal = ({ isOpen, onClose, onConfirm, defaultFolder, magnetLink }) => {
    const [folder, setFolder] = useState(defaultFolder || '');
    const [filterType, setFilterType] = useState('none'); // 'none', 'include', 'exclude'
    const [regex, setRegex] = useState('');
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [torrentId, setTorrentId] = useState(null);

    useEffect(() => {
        if (isOpen) {
            setFolder(defaultFolder || '');
            setFilterType('none');
            setRegex('');
            setFiles([]);
            setTorrentId(null);

            // Fetch files when modal opens
            if (magnetLink) {
                fetchTorrentFiles();
            }
        }
    }, [isOpen, defaultFolder, magnetLink]);

    const fetchTorrentFiles = async () => {
        setLoading(true);
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
            }
        } catch (err) {
            console.error('Error fetching torrent files:', err);
        } finally {
            setLoading(false);
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

    const matchesRegex = (filename, pattern) => {
        if (!pattern) return true;
        try {
            const regexObj = new RegExp(pattern);
            return regexObj.test(filename);
        } catch (e) {
            return true; // Invalid regex, show all files
        }
    };

    // Filter files based on regex
    const filteredFiles = files.filter(file => {
        if (filterType === 'none') return true;

        if (filterType === 'include') {
            return matchesRegex(file.path, regex);
        } else if (filterType === 'exclude') {
            return !matchesRegex(file.path, regex);
        }

        return true;
    });

    const handleConfirm = () => {
        const options = {
            folder,
            includeRegex: filterType === 'include' ? regex : undefined,
            excludeRegex: filterType === 'exclude' ? regex : undefined
        };
        onConfirm(options);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content download-options-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Download Options</h2>
                    <button className="modal-close" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="modal-body">
                    {/* File List Section */}
                    <div className="option-group">
                        <label>Files in Torrent ({filteredFiles.length} {filterType !== 'none' ? 'will be downloaded' : 'total'})</label>
                        <div className="files-preview">
                            {loading ? (
                                <div className="files-loading">
                                    <div className="mini-spinner"></div>
                                    <p>Loading files...</p>
                                </div>
                            ) : filteredFiles.length > 0 ? (
                                <div className="files-list-compact">
                                    {filteredFiles.map((file, index) => (
                                        <div key={index} className="file-item-compact">
                                            {isVideoFile(file.path) ? (
                                                <Play size={14} className="file-icon video-icon" />
                                            ) : (
                                                <File size={14} className="file-icon" />
                                            )}
                                            <span className="file-name-compact">{file.path}</span>
                                            <span className="file-size-compact">{formatFileSize(file.bytes)}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="no-files">No files match the current filter</p>
                            )}
                        </div>
                    </div>

                    <div className="option-group">
                        <label htmlFor="folder">Download Folder</label>
                        <input
                            type="text"
                            id="folder"
                            value={folder}
                            onChange={(e) => setFolder(e.target.value)}
                            placeholder="Enter folder name"
                            className="option-input"
                        />
                        <small>Category/folder for this download in RDT Client</small>
                    </div>

                    <div className="option-group">
                        <label>File Filter (Optional)</label>
                        <div className="filter-type-buttons">
                            <button
                                className={`filter-btn ${filterType === 'none' ? 'active' : ''}`}
                                onClick={() => setFilterType('none')}
                            >
                                No Filter
                            </button>
                            <button
                                className={`filter-btn ${filterType === 'include' ? 'active' : ''}`}
                                onClick={() => setFilterType('include')}
                            >
                                Include Files
                            </button>
                            <button
                                className={`filter-btn ${filterType === 'exclude' ? 'active' : ''}`}
                                onClick={() => setFilterType('exclude')}
                            >
                                Exclude Files
                            </button>
                        </div>
                    </div>

                    {filterType !== 'none' && (
                        <div className="option-group">
                            <label htmlFor="regex">
                                {filterType === 'include' ? 'Include' : 'Exclude'} Regex Pattern
                            </label>
                            <input
                                type="text"
                                id="regex"
                                value={regex}
                                onChange={(e) => setRegex(e.target.value)}
                                placeholder="e.g., .*\.mkv$ or ^sample.*"
                                className="option-input"
                            />
                            <small>
                                {filterType === 'include'
                                    ? 'Only files matching this pattern will be downloaded'
                                    : 'Files matching this pattern will be excluded from download'}
                            </small>
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button className="btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="btn-primary" onClick={handleConfirm}>
                        Download ({filteredFiles.length} file{filteredFiles.length !== 1 ? 's' : ''})
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DownloadOptionsModal;
