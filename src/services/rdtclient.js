import axios from 'axios';
import useSettingsStore from '../store/settingsStore';

const rdtclient = {
    authenticate: async () => {
        try {
            const { rdtClientUrl, rdtClientUsername, rdtClientPassword } = useSettingsStore.getState();

            if (!rdtClientUrl) throw new Error('RDT Client URL not configured');
            if (!rdtClientUsername || !rdtClientPassword) throw new Error('RDT Client credentials not configured');

            // LOGIC SWITCH:
            // If Dev: Use empty string (browser resolves to localhost:3000/api...) -> Hits Proxy
            // If Prod: Use the User's URL (http://192.../api...) -> Direct Request
            const baseUrl = import.meta.env.DEV
                ? ''
                : rdtClientUrl.replace(/\/$/, '');

            // Authenticate using JSON
            const payload = {
                username: rdtClientUsername,
                password: rdtClientPassword
            };

            const response = await axios.post(
                `${baseUrl}/Api/Authentication/Login`,
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

            const baseUrl = import.meta.env.DEV ? '' : rdtClientUrl.replace(/\/$/, '');

            await axios.get(`${baseUrl}/Api/Authentication/IsLoggedIn`, {
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

            const baseUrl = import.meta.env.DEV
                ? ''
                : rdtClientUrl.replace(/\/$/, '');

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

            const response = await axios.post(
                `${baseUrl}/Api/Torrents/UploadMagnet`,
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

            const baseUrl = import.meta.env.DEV
                ? ''
                : rdtClientUrl.replace(/\/$/, '');

            const response = await axios.get(
                `${baseUrl}/Api/Torrents`,
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
