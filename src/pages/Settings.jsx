import React, { useState, useEffect } from 'react';
import useSettingsStore from '../store/settingsStore';
import './Settings.css';

const Settings = () => {
    const {
        realDebridApiKey, setRealDebridApiKey,
        rdtClientUrl, setRdtClientUrl,
        traktClientId, setTraktClientId
    } = useSettingsStore();

    const [rdKey, setRdKey] = useState('');
    const [rdtUrl, setRdtUrl] = useState('');
    const [traktId, setTraktId] = useState('');
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        setRdKey(realDebridApiKey);
        setRdtUrl(rdtClientUrl);
        setTraktId(traktClientId);
    }, [realDebridApiKey, rdtClientUrl, traktClientId]);

    const handleSave = (e) => {
        e.preventDefault();
        setRealDebridApiKey(rdKey);
        setRdtClientUrl(rdtUrl);
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
                    <small>The URL where your RDT Client is running.</small>
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
