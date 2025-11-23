import axios from 'axios';
import { Capacitor } from '@capacitor/core';
import useSettingsStore from '../store/settingsStore';

const rdtclient = {
    authenticate: async () => {
        try {
            const { rdtClientUrl, rdtClientUsername, rdtClientPassword } = useSettingsStore.getState();

            if (!rdtClientUrl) throw new Error('RDT Client URL not configured');
            if (!rdtClientUsername || !rdtClientPassword) throw new Error('RDT Client credentials not configured');

            // Authenticate using JSON
            const payload = {
                username: rdtClientUsername,
                password: rdtClientPassword
            };

            // Determine Base URL:
            // - Native (Android/iOS): Use direct URL (handled by CapacitorHttp to bypass CORS)
            // - Web (Docker/Dev): Use Proxy (/api/rdtclient) to handle CORS via server
            const isNative = Capacitor.isNativePlatform();
            const baseUrl = isNative ? rdtClientUrl : '/api/rdtclient';

            // Remove trailing slash if present to avoid double slashes
            const cleanBaseUrl = baseUrl.replace(/\/$/, '');

            const response = await axios.post(
                `${cleanBaseUrl}/Api/Authentication/Login`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true // Enable cookie handling
                }
            );

            return response.data;
        } catch (error) {
            console.error('Error authenticating with RDT Client:', error);
            throw new Error('Failed to authenticate with RDT Client. Check your credentials.');
        }
    },

    checkLogin: async () => {
        try {
            const { rdtClientUrl } = useSettingsStore.getState();
            if (!rdtClientUrl) return false;

            const isNative = Capacitor.isNativePlatform();
            const baseUrl = isNative ? rdtClientUrl : '/api/rdtclient';
            const cleanBaseUrl = baseUrl.replace(/\/$/, '');

            await axios.get(`${cleanBaseUrl}/Api/Authentication/IsLoggedIn`, {
                withCredentials: true
            });
            return true;
        } catch (error) {
            return false;
        }
    },

    ensureLoggedIn: async () => {
        const isLoggedIn = await rdtclient.checkLogin();
        if (!isLoggedIn) {
            console.log('RDT Client not logged in, authenticating...');
            await rdtclient.authenticate();
        }
    },

    addTorrent: async (magnetLink, mediaType = 'movie', options = {}) => {
        try {
            const { rdtClientUrl, rdtClientMoviesPath, rdtClientShowsPath } = useSettingsStore.getState();

            if (!rdtClientUrl) throw new Error('RDT Client URL not configured');

            // Ensure we are logged in before proceeding
            await rdtclient.ensureLoggedIn();

            // Auto-select folder based on media type, or use custom folder from options
            const category = options.folder || (mediaType === 'series'
                ? (rdtClientShowsPath || 'TV Shows')
                : (rdtClientMoviesPath || 'Movies'));

            const payload = {
                magnetLink: magnetLink,
                torrent: {
                    category: category,
                    hostDownloadAction: 0,
                    downloadAction: 1,
                    finishedAction: 1,
                    finishedActionDelay: 0,
                    downloadMinSize: 0,
                    includeRegex: options.includeRegex || null,
                    excludeRegex: options.excludeRegex || null,
                    downloadManualFiles: null,
                    priority: 0,
                    torrentRetryAttempts: 1,
                    downloadRetryAttempts: 3,
                    deleteOnError: 0,
                    lifetime: 0,
                    downloadClient: 0
                }
            };

            const isNative = Capacitor.isNativePlatform();
            const baseUrl = isNative ? rdtClientUrl : '/api/rdtclient';
            const cleanBaseUrl = baseUrl.replace(/\/$/, '');

            const response = await axios.post(
                `${cleanBaseUrl}/Api/Torrents/UploadMagnet`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true // Send cookies with request
                }
            );

            return response.data;
        } catch (error) {
            console.error('Error adding torrent to RDT Client:', error);

            // Provide helpful error message for CORS issues
            if (error.message?.includes('Network Error') || error.code === 'ERR_NETWORK') {
                throw new Error('CORS Error: Enable CORS in your browser (use a Firefox extension) or configure a reverse proxy.');
            }

            throw error;
        }
    },

    getTorrents: async () => {
        try {
            const { rdtClientUrl } = useSettingsStore.getState();

            if (!rdtClientUrl) throw new Error('RDT Client URL not configured');

            // Ensure we are logged in before proceeding
            await rdtclient.ensureLoggedIn();

            const isNative = Capacitor.isNativePlatform();
            const baseUrl = isNative ? rdtClientUrl : '/api/rdtclient';
            const cleanBaseUrl = baseUrl.replace(/\/$/, '');

            const response = await axios.get(
                `${cleanBaseUrl}/Api/Torrents`,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            );

            return response.data;
        } catch (error) {
            console.error('Error fetching torrents from RDT Client:', error);
            if (error.message?.includes('Network Error') || error.code === 'ERR_NETWORK') {
                throw new Error('CORS Error: Enable CORS in your browser or configure a reverse proxy.');
            }
            throw error;
        }
    },

    testConnection: async () => {
        try {
            const { rdtClientUrl, rdtClientUsername, rdtClientPassword } = useSettingsStore.getState();

            if (!rdtClientUrl || !rdtClientUsername || !rdtClientPassword) {
                throw new Error('RDT Client credentials not configured');
            }

            // Directly test authentication by calling login
            await rdtclient.authenticate();

            return { success: true };
        } catch (error) {
            console.error('RDT Client connection test failed:', error);
            return { success: false, error: error.message };
        }
    }
};

export default rdtclient;
