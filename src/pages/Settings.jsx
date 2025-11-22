import React, { useState, useEffect } from 'react';
import useSettingsStore from '../store/settingsStore';
import { Eye, EyeOff } from 'lucide-react';
import './Settings.css';

const Settings = () => {
    const {
        realDebridApiKey, setRealDebridApiKey,
        rdtClientUrl, setRdtClientUrl,
        rdtClientUsername, setRdtClientUsername,
        rdtClientPassword, setRdtClientPassword,
        rdtClientMoviesPath, setRdtClientMoviesPath,
        rdtClientShowsPath, setRdtClientShowsPath,
        traktClientId, setTraktClientId
    } = useSettingsStore();

    const [rdKey, setRdKey] = useState('');
    const [rdtUrl, setRdtUrl] = useState('');
    const [rdtUser, setRdtUser] = useState('');
    const [rdtPass, setRdtPass] = useState('');
    const [rdtMoviesPath, setRdtMoviesPath] = useState('');
    const [rdtShowsPath, setRdtShowsPath] = useState('');
    const [traktId, setTraktId] = useState('');
    const [saved, setSaved] = useState(false);

    // Password visibility toggles
    const [showRdKey, setShowRdKey] = useState(false);
    const [showRdtPass, setShowRdtPass] = useState(false);

    useEffect(() => {
        setRdKey(realDebridApiKey);
        setRdtUrl(rdtClientUrl);
        setRdtUser(rdtClientUsername);
        setRdtPass(rdtClientPassword);
        setRdtMoviesPath(rdtClientMoviesPath);
        setRdtShowsPath(rdtClientShowsPath);
        setTraktId(traktClientId);
    }, [realDebridApiKey, rdtClientUrl, rdtClientUsername, rdtClientPassword, rdtClientMoviesPath, rdtClientShowsPath, traktClientId]);

    const handleSave = (e) => {
        e.preventDefault();
        setRealDebridApiKey(rdKey);
        setRdtClientUrl(rdtUrl);
        setRdtClientUsername(rdtUser);
        setRdtClientPassword(rdtPass);
        setRdtClientMoviesPath(rdtMoviesPath);
        setRdtClientShowsPath(rdtShowsPath);
        setTraktClientId(traktId);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="settings-page">
            <h1>Settings</h1>
            <p className="settings-desc">Configure your service connections.</p>

            <form onSubmit={handleSave} className="settings-form">
                <div className="form-group">
                    <label htmlFor="rdKey">Real-Debrid API Key</label>
                    <div className="password-input-wrapper">
                        <input
                            type={showRdKey ? "text" : "password"}
                            id="rdKey"
                            value={rdKey}
                            onChange={(e) => setRdKey(e.target.value)}
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
                    <small>You can find this in your Real-Debrid account settings.</small>
                </div>

                <div className="form-group">
                    <label htmlFor="rdtUrl">RDT Client URL</label>
                    <input
                        type="url"
                        id="rdtUrl"
                        value={rdtUrl}
                        onChange={(e) => setRdtUrl(e.target.value)}
                        placeholder="http://localhost:6500"
                    />
                    <small>The URL where your RDT Client is running (or use proxy with http://localhost:6500).</small>
                </div>

                <div className="form-group">
                    <label htmlFor="rdtUser">RDT Client Username</label>
                    <input
                        type="text"
                        id="rdtUser"
                        value={rdtUser}
                        onChange={(e) => setRdtUser(e.target.value)}
                        placeholder="admin"
                    />
                    <small>Your RDT Client login username.</small>
                </div>

                <div className="form-group">
                    <label htmlFor="rdtPass">RDT Client Password</label>
                    <div className="password-input-wrapper">
                        <input
                            type={showRdtPass ? "text" : "password"}
                            id="rdtPass"
                            value={rdtPass}
                            onChange={(e) => setRdtPass(e.target.value)}
                            placeholder="Enter your RDT Client password"
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
                    <small>Your RDT Client login password.</small>
                </div>

                <div className="form-group">
                    <label htmlFor="rdtMoviesPath">Movies Download Folder</label>
                    <input
                        type="text"
                        id="rdtMoviesPath"
                        value={rdtMoviesPath}
                        onChange={(e) => setRdtMoviesPath(e.target.value)}
                        placeholder="Movies"
                    />
                    <small>Folder/category for movie downloads.</small>
                </div>

                <div className="form-group">
                    <label htmlFor="rdtShowsPath">TV Shows Download Folder</label>
                    <input
                        type="text"
                        id="rdtShowsPath"
                        value={rdtShowsPath}
                        onChange={(e) => setRdtShowsPath(e.target.value)}
                        placeholder="TV Shows"
                    />
                    <small>Folder/category for TV show downloads.</small>
                </div>

                <div className="form-group">
                    <label htmlFor="traktId">Trakt Client ID (Optional)</label>
                    <input
                        type="text"
                        id="traktId"
                        value={traktId}
                        onChange={(e) => setTraktId(e.target.value)}
                        placeholder="Trakt Client ID"
                    />
                </div>

                <button type="submit" className="btn-primary">
                    {saved ? 'Saved!' : 'Save Settings'}
                </button>
            </form>
        </div>
    );
};

export default Settings;
