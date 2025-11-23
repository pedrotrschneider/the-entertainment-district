import React, { useState, useEffect } from 'react';
import useSettingsStore from '../store/settingsStore';
import useServiceStatusStore from '../store/serviceStatusStore';
import realdebrid from '../services/realdebrid';
import rdtclient from '../services/rdtclient';
import tmdb from '../services/tmdb';
import { Eye, EyeOff, ExternalLink, CheckCircle, XCircle, Loader } from 'lucide-react';
import { useToast } from '../components/Toast';
import TraktAuth from '../components/TraktAuth';
import './Settings.css';

const Settings = () => {
    const toast = useToast();
    const {
        realDebridApiKey, setRealDebridApiKey,
        rdtClientUrl, setRdtClientUrl,
        rdtClientUsername, setRdtClientUsername,
        rdtClientPassword, setRdtClientPassword,
        rdtClientMoviesPath, setRdtClientMoviesPath,
        rdtClientShowsPath, setRdtClientShowsPath,
        traktClientId, setTraktClientId,
        tmdbApiKey, setTmdbApiKey
    } = useSettingsStore();

    const {
        realDebridStatus, setRealDebridStatus,
        rdtClientStatus, setRdtClientStatus,
        traktStatus, setTraktStatus,
        tmdbStatus, setTmdbStatus
    } = useServiceStatusStore();

    // Password visibility toggles
    const [showRdKey, setShowRdKey] = useState(false);
    const [showRdtPass, setShowRdtPass] = useState(false);
    const [showTmdbKey, setShowTmdbKey] = useState(false);
    const [showTraktId, setShowTraktId] = useState(false);

    // Test result messages
    const [rdTestResult, setRdTestResult] = useState(null);
    const [rdtTestResult, setRdtTestResult] = useState(null);
    const [traktTestResult, setTraktTestResult] = useState(null);
    const [tmdbTestResult, setTmdbTestResult] = useState(null);

    const testRealDebrid = async () => {
        setRealDebridStatus('testing');
        setRdTestResult(null);
        const result = await realdebrid.testConnection();

        if (result.success) {
            setRealDebridStatus('connected');
            setRdTestResult({ success: true, message: `Connected as ${result.data.username || 'user'}` });
        } else {
            setRealDebridStatus('disconnected');
            setRdTestResult({ success: false, message: result.error });
        }
    };

    const testRdtClient = async () => {
        setRdtClientStatus('testing');
        setRdtTestResult(null);
        const result = await rdtclient.testConnection();

        if (result.success) {
            setRdtClientStatus('connected');
            setRdtTestResult({ success: true, message: 'Connected successfully' });
        } else {
            setRdtClientStatus('disconnected');
            setRdtTestResult({ success: false, message: result.error });
        }
    };

    const testTrakt = async () => {
        setTraktStatus('testing');
        setTraktTestResult(null);

        if (traktClientId) {
            setTraktStatus('connected');
            setTraktTestResult({ success: true, message: 'Client ID configured' });
        } else {
            setTraktStatus('disconnected');
            setTraktTestResult({ success: false, message: 'Client ID not configured' });
        }
    };

    const testTmdb = async () => {
        setTmdbStatus('testing');
        setTmdbTestResult(null);
        const result = await tmdb.testConnection();

        if (result.success) {
            setTmdbStatus('connected');
            setTmdbTestResult({ success: true, message: 'API key valid' });
        } else {
            setTmdbStatus('disconnected');
            setTmdbTestResult({ success: false, message: result.error });
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'testing':
                return <Loader size={16} className="status-icon spinning" />;
            case 'connected':
                return <CheckCircle size={16} className="status-icon success" />;
            case 'disconnected':
                return <XCircle size={16} className="status-icon error" />;
            default:
                return null;
        }
    };

    return (
        <div className="settings-page">
            <h1 className="page-title">Settings</h1>

            <div className="settings-section">
                <h2 className="section-title">Real-Debrid</h2>
                <p className="section-desc">
                    Required for streaming cached torrents. Get your API key from real-debrid.com/apitoken
                </p>

                <div className="form-group">
                    <label htmlFor="rdKey">API Key</label>
                    <div className="password-input-wrapper">
                        <input
                            type={showRdKey ? "text" : "password"}
                            id="rdKey"
                            value={realDebridApiKey}
                            onChange={(e) => setRealDebridApiKey(e.target.value)}
                            placeholder="Enter your Real-Debrid API Key"
                        />
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowRdKey(!showRdKey)}
                            aria-label="Toggle password visibility"
                        >
                            {showRdKey ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    <div className="test-row">
                        <button
                            className="btn-test"
                            onClick={testRealDebrid}
                            disabled={!realDebridApiKey || realDebridStatus === 'testing'}
                        >
                            {getStatusIcon(realDebridStatus)}
                            Test Connection
                        </button>
                        {rdTestResult && (
                            <span className={`test-result ${rdTestResult.success ? 'success' : 'error'}`}>
                                {rdTestResult.message}
                            </span>
                        )}
                    </div>
                </div>

                <h2 className="section-title">RDT Client (Optional)</h2>
                <p className="section-desc">
                    Connect to your home server's RDT Client for downloading content.
                </p>

                <div className="form-group">
                    <label htmlFor="rdtUrl">URL</label>
                    <input
                        type="text"
                        id="rdtUrl"
                        value={rdtClientUrl}
                        onChange={(e) => setRdtClientUrl(e.target.value)}
                        placeholder="http://localhost:6500"
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="rdtUser">Username</label>
                        <input
                            type="text"
                            id="rdtUser"
                            value={rdtClientUsername}
                            onChange={(e) => setRdtClientUsername(e.target.value)}
                            placeholder="Username"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="rdtPass">Password</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showRdtPass ? "text" : "password"}
                                id="rdtPass"
                                value={rdtClientPassword}
                                onChange={(e) => setRdtClientPassword(e.target.value)}
                                placeholder="Password"
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowRdtPass(!showRdtPass)}
                                aria-label="Toggle password visibility"
                            >
                                {showRdtPass ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="rdtMoviesPath">Movies Download Path</label>
                    <input
                        type="text"
                        id="rdtMoviesPath"
                        value={rdtClientMoviesPath}
                        onChange={(e) => setRdtClientMoviesPath(e.target.value)}
                        placeholder="Movies"
                    />
                    <small>Folder/category for movie downloads.</small>
                </div>

                <div className="form-group">
                    <label htmlFor="rdtShowsPath">TV Shows Download Path</label>
                    <input
                        type="text"
                        id="rdtShowsPath"
                        value={rdtClientShowsPath}
                        onChange={(e) => setRdtClientShowsPath(e.target.value)}
                        placeholder="TV Shows"
                    />
                    <small>Folder/category for TV show downloads.</small>
                </div>

                <div className="test-row">
                    <button
                        className="btn-test"
                        onClick={testRdtClient}
                        disabled={!rdtClientUrl || !rdtClientUsername || !rdtClientPassword || rdtClientStatus === 'testing'}
                    >
                        {getStatusIcon(rdtClientStatus)}
                        Test Connection
                    </button>
                    {rdtTestResult && (
                        <span className={`test-result ${rdtTestResult.success ? 'success' : 'error'}`}>
                            {rdtTestResult.message}
                        </span>
                    )}
                </div>

                <h2 className="section-title">TMDB Integration</h2>
                <p className="section-desc">
                    Get cast photos and character names from The Movie Database.{' '}
                    <a
                        href="https://github.com/pedrotrschneider/the-entertainment-district/blob/main/docs/TMDB_SETUP.md"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="setup-link"
                    >
                        Setup Instructions <ExternalLink size={14} />
                    </a>
                </p>

                <div className="form-group">
                    <label htmlFor="tmdbKey">TMDB API Key</label>
                    <div className="password-input-wrapper">
                        <input
                            type={showTmdbKey ? "text" : "password"}
                            id="tmdbKey"
                            value={tmdbApiKey}
                            onChange={(e) => setTmdbApiKey(e.target.value)}
                            placeholder="Enter your TMDB API Key"
                        />
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowTmdbKey(!showTmdbKey)}
                            aria-label="Toggle password visibility"
                        >
                            {showTmdbKey ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    <small>Get this from themoviedb.org/settings/api (free account required).</small>
                    <div className="test-row">
                        <button
                            className="btn-test"
                            onClick={testTmdb}
                            disabled={!tmdbApiKey || tmdbStatus === 'testing'}
                        >
                            {getStatusIcon(tmdbStatus)}
                            Test Connection
                        </button>
                        {tmdbTestResult && (
                            <span className={`test-result ${tmdbTestResult.success ? 'success' : 'error'}`}>
                                {tmdbTestResult.message}
                            </span>
                        )}
                    </div>
                </div>

                <h2 className="section-title">Trakt Integration</h2>
                <p className="section-desc">
                    Sync your watchlist and watch history with Trakt.tv.{' '}
                    <a
                        href="https://github.com/pedrotrschneider/the-entertainment-district/blob/main/docs/TRAKT_SETUP.md"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="setup-link"
                    >
                        Setup Instructions <ExternalLink size={14} />
                    </a>
                </p>

                <div className="form-group">
                    <label htmlFor="traktId">Trakt Client ID</label>
                    <div className="password-input-wrapper">
                        <input
                            type={showTraktId ? "text" : "password"}
                            id="traktId"
                            value={traktClientId}
                            onChange={(e) => setTraktClientId(e.target.value)}
                            placeholder="Enter your Trakt Client ID"
                        />
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowTraktId(!showTraktId)}
                            aria-label="Toggle password visibility"
                        >
                            {showTraktId ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    <small>Get this from trakt.tv/oauth/applications after registering your app.</small>
                    <div className="test-row">
                        <button
                            className="btn-test"
                            onClick={testTrakt}
                            disabled={!traktClientId || traktStatus === 'testing'}
                        >
                            {getStatusIcon(traktStatus)}
                            Test Connection
                        </button>
                        {traktTestResult && (
                            <span className={`test-result ${traktTestResult.success ? 'success' : 'error'}`}>
                                {traktTestResult.message}
                            </span>
                        )}
                    </div>
                </div>

                <TraktAuth />
            </div>
        </div>
    );
};

export default Settings;
