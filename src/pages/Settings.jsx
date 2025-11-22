import React, { useState, useEffect } from 'react';
import useSettingsStore from '../store/settingsStore';
import './Settings.css';

const Settings = () => {
    const {
        realDebridApiKey, setRealDebridApiKey,
        rdtClientUrl, setRdtClientUrl,
        rdtClientUsername, setRdtClientUsername,
        rdtClientPassword, setRdtClientPassword,
        rdtClientDownloadPath, setRdtClientDownloadPath,
        traktClientId, setTraktClientId
    } = useSettingsStore();

    const [rdKey, setRdKey] = useState('');
    const [rdtUrl, setRdtUrl] = useState('');
    const [rdtUser, setRdtUser] = useState('');
    const [rdtPass, setRdtPass] = useState('');
    const [rdtPath, setRdtPath] = useState('');
    const [traktId, setTraktId] = useState('');
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        setRdKey(realDebridApiKey);
        setRdtUrl(rdtClientUrl);
        setRdtUser(rdtClientUsername);
        setRdtPass(rdtClientPassword);
        setRdtPath(rdtClientDownloadPath);
        setTraktId(traktClientId);
    }, [realDebridApiKey, rdtClientUrl, rdtClientUsername, rdtClientPassword, rdtClientDownloadPath, traktClientId]);

    const handleSave = (e) => {
        e.preventDefault();
        setRealDebridApiKey(rdKey);
        setRdtClientUrl(rdtUrl);
        setRdtClientUsername(rdtUser);
        setRdtClientPassword(rdtPass);
        setRdtClientDownloadPath(rdtPath);
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
                    <input
                        type="password"
                        id="rdKey"
                        value={rdKey}
                        onChange={(e) => setRdKey(e.target.value)}
                        placeholder="Enter your Real-Debrid API Key"
                    />
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
                    <input
                        type="password"
                        id="rdtPass"
                        value={rdtPass}
                        onChange={(e) => setRdtPass(e.target.value)}
                        placeholder="Enter your RDT Client password"
                    />
                    <small>Your RDT Client login password.</small>
                </div>

                <div className="form-group">
                    <label htmlFor="rdtPath">RDT Client Download Category</label>
                    <input
                        type="text"
                        id="rdtPath"
                        value={rdtPath}
                        onChange={(e) => setRdtPath(e.target.value)}
                        placeholder="TED"
                    />
                    <small>Category for downloads (e.g., "Movies", "TV Shows", or "TED").</small>
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
