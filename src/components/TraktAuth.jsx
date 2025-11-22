import React, { useState, useEffect } from 'react';
import { Check, X, ExternalLink } from 'lucide-react';
import trakt from '../services/trakt';
import useSettingsStore from '../store/settingsStore';
import './TraktAuth.css';

const TraktAuth = () => {
    const {
        traktClientId,
        traktAccessToken,
        traktAccountInfo,
        setTraktAccessToken,
        setTraktRefreshToken,
        setTraktExpiresAt,
        setTraktAccountInfo
    } = useSettingsStore();

    const [deviceCode, setDeviceCode] = useState(null);
    const [userCode, setUserCode] = useState('');
    const [verificationUrl, setVerificationUrl] = useState('');
    const [polling, setPolling] = useState(false);
    const [error, setError] = useState('');
    const [connecting, setConnecting] = useState(false);

    const isConnected = !!traktAccessToken && !!traktAccountInfo;

    useEffect(() => {
        let pollInterval;

        if (polling && deviceCode) {
            pollInterval = setInterval(async () => {
                try {
                    const tokenData = await trakt.pollForToken(deviceCode);

                    // Successfully authenticated!
                    setTraktAccessToken(tokenData.access_token);
                    setTraktRefreshToken(tokenData.refresh_token);
                    setTraktExpiresAt(Date.now() + (tokenData.expires_in * 1000));

                    // Get account info
                    const settings = await trakt.getSettings();
                    setTraktAccountInfo(settings.user);

                    // Stop polling
                    setPolling(false);
                    setDeviceCode(null);
                    setError('');

                } catch (err) {
                    // Continue polling - user hasn't authorized yet
                    if (err.response?.status === 400) {
                        // Still waiting for authorization
                        return;
                    }

                    // Other error - stop polling
                    console.error('Trakt auth error:', err);
                    setError('Authentication failed. Please try again.');
                    setPolling(false);
                }
            }, 5000); // Poll every 5 seconds
        }

        return () => {
            if (pollInterval) clearInterval(pollInterval);
        };
    }, [polling, deviceCode, setTraktAccessToken, setTraktRefreshToken, setTraktExpiresAt, setTraktAccountInfo]);

    const handleConnect = async () => {
        if (!traktClientId) {
            setError('Please enter your Trakt Client ID first');
            return;
        }

        setConnecting(true);
        setError('');

        try {
            const codeData = await trakt.getDeviceCode();

            setDeviceCode(codeData.device_code);
            setUserCode(codeData.user_code);
            setVerificationUrl(codeData.verification_url);
            setPolling(true);

        } catch (err) {
            console.error('Failed to get device code:', err);
            setError('Failed to start authentication. Check your Client ID.');
        } finally {
            setConnecting(false);
        }
    };

    const handleDisconnect = () => {
        setTraktAccessToken('');
        setTraktRefreshToken('');
        setTraktExpiresAt(null);
        setTraktAccountInfo(null);
        setDeviceCode(null);
        setUserCode('');
        setPolling(false);
    };

    const handleCancelAuth = () => {
        setPolling(false);
        setDeviceCode(null);
        setUserCode('');
    };

    if (isConnected) {
        return (
            <div className="trakt-auth connected">
                <div className="auth-status">
                    <Check size={20} className="status-icon success" />
                    <div className="status-info">
                        <strong>Connected to Trakt</strong>
                        <span className="username">@{traktAccountInfo.username}</span>
                    </div>
                </div>
                <button className="btn-disconnect" onClick={handleDisconnect}>
                    Disconnect
                </button>
            </div>
        );
    }

    if (polling && userCode) {
        return (
            <div className="trakt-auth authenticating">
                <div className="auth-box">
                    <h3>Authorize on Trakt</h3>
                    <p>1. Go to <a href={verificationUrl} target="_blank" rel="noopener noreferrer">
                        {verificationUrl} <ExternalLink size={14} />
                    </a></p>
                    <p>2. Enter this code:</p>
                    <div className="device-code">{userCode}</div>
                    <p className="waiting-text">Waiting for authorization...</p>
                    <div className="auth-spinner"></div>
                    <button className="btn-cancel" onClick={handleCancelAuth}>
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="trakt-auth disconnected">
            {error && (
                <div className="auth-error">
                    <X size={16} />
                    {error}
                </div>
            )}
            <button
                className="btn-connect"
                onClick={handleConnect}
                disabled={connecting || !traktClientId}
            >
                {connecting ? 'Connecting...' : 'Connect to Trakt'}
            </button>
            {!traktClientId && (
                <small className="hint">Enter your Client ID above to enable Trakt</small>
            )}
        </div>
    );
};

export default TraktAuth;
