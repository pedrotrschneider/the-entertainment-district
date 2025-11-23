import React, { useEffect, useState, useRef } from 'react';
import rdtclient from '../services/rdtclient';
import useSettingsStore from '../store/settingsStore';
import { ExternalLink, Download, AlertCircle } from 'lucide-react';
import './Downloads.css';

const Downloads = () => {
    const { rdtClientUrl } = useSettingsStore();
    const [torrents, setTorrents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const pollInterval = useRef(null);

    useEffect(() => {
        fetchTorrents();
        startPolling();

        return () => stopPolling();
    }, []);

    const startPolling = () => {
        stopPolling();
        pollInterval.current = setInterval(fetchTorrents, 2000);
    };

    const stopPolling = () => {
        if (pollInterval.current) {
            clearInterval(pollInterval.current);
        }
    };

    const fetchTorrents = async () => {
        try {
            const data = await rdtclient.getTorrents();
            setTorrents(data || []);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch torrents:', err);
            setError('Failed to connect to RDT Client');
            stopPolling(); // Stop polling on error to avoid spamming
        } finally {
            setLoading(false);
        }
    };

    const formatBytes = (bytes, decimals = 2) => {
        if (!bytes) return '0 B';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    const formatSpeed = (bytesPerSec) => {
        return formatBytes(bytesPerSec) + '/s';
    };

    const openRdtClient = () => {
        if (rdtClientUrl) {
            window.open(rdtClientUrl, '_blank');
        }
    };

    return (
        <div className="downloads-page">
            <div className="downloads-header">
                <h1>Downloads</h1>
                <button className="btn-rdt" onClick={openRdtClient}>
                    Open RDT Client <ExternalLink size={14} />
                </button>
            </div>

            {error && (
                <div className="error-message">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                    <button className="btn-text" onClick={() => { setLoading(true); fetchTorrents(); startPolling(); }}>Retry</button>
                </div>
            )}

            <div className="downloads-container">
                {loading && torrents.length === 0 ? (
                    <div className="loading-state">Loading downloads...</div>
                ) : torrents.length === 0 ? (
                    <div className="empty-state">
                        <Download size={48} />
                        <p>No active downloads</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="downloads-table">
                            <thead>
                                <tr>
                                    <th className="col-name">Name</th>
                                    <th className="col-size">Size</th>
                                    <th className="col-files">Files</th>
                                    <th className="col-progress">Progress</th>
                                    <th className="col-speed">Speed</th>
                                </tr>
                            </thead>
                            <tbody>
                                {torrents.map((torrent) => {
                                    // Calculate total progress from downloads array
                                    let totalBytesDone = 0;
                                    let totalBytesTotal = 0;
                                    let totalSpeed = 0;
                                    let finishedFiles = 0;
                                    let totalFiles = 0;

                                    if (torrent.downloads) {
                                        totalFiles = torrent.downloads.length;
                                        torrent.downloads.forEach(d => {
                                            totalBytesDone += d.bytesDone || 0;
                                            totalBytesTotal += d.bytesTotal || 0;
                                            totalSpeed += d.speed || 0;
                                            if (d.downloadFinished) {
                                                finishedFiles++;
                                            }
                                        });
                                    }

                                    // Avoid division by zero
                                    const progress = totalBytesTotal > 0
                                        ? Math.round((totalBytesDone / totalBytesTotal) * 100)
                                        : 0;

                                    return (
                                        <tr key={torrent.torrentId}>
                                            <td className="col-name" title={torrent.rdName || torrent.category}>
                                                {torrent.rdName || 'Unknown Torrent'}
                                            </td>
                                            <td className="col-size">{formatBytes(torrent.rdSize)}</td>
                                            <td className="col-files">
                                                {finishedFiles} / {totalFiles}
                                            </td>
                                            <td className="col-progress">
                                                <div className="progress-wrapper">
                                                    <span className="progress-text">{progress}%</span>
                                                    <div className="progress-bar-container">
                                                        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="col-speed">{totalSpeed > 0 ? formatSpeed(totalSpeed) : '-'}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Downloads;
