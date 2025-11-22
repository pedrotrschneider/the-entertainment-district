import React, { useState, useEffect } from 'react';
import useSettingsStore from '../store/settingsStore';
import { Eye, EyeOff, ExternalLink } from 'lucide-react';
import TraktAuth from '../components/TraktAuth';
import './Settings.css';

const Settings = () => {
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

    // Password visibility toggles
    const [showRdKey, setShowRdKey] = useState(false);
    const [showRdtPass, setShowRdtPass] = useState(false);
    const [showTmdbKey, setShowTmdbKey] = useState(false);

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

                <h2 className="section-title">TMDB Integration</h2>
                <p className="section-desc">
                    Get cast photos and character names from The Movie Database.{' '}
                    <a
                        href="/TMDB_SETUP.md"
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
                </div>

                <h2 className="section-title">Trakt Integration</h2>
                <p className="section-desc">
                    Sync your watchlist and watch history with Trakt.tv.{' '}
                    <a
                        href="/TRAKT_SETUP.md"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="setup-link"
                    >
                        Setup Instructions <ExternalLink size={14} />
                    </a>
                </p>

                <div className="form-group">
                    <label htmlFor="traktId">Trakt Client ID</label>
                    <input
                        type="text"
                        id="traktId"
                        value={traktClientId}
                        onChange={(e) => setTraktClientId(e.target.value)}
                        placeholder="Enter your Trakt Client ID"
                    />
                    <small>Get this from trakt.tv/oauth/applications after registering your app.</small>
                </div>

                <TraktAuth />
            </div>
        </div>
    );
};

export default Settings;
