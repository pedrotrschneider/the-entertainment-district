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

            // Authenticate using form-urlencoded
            const formData = new URLSearchParams();
            formData.append('username', rdtClientUsername);
            formData.append('password', rdtClientPassword);

            const response = await axios.post(
                `${baseUrl}/api/v2/auth/login`,
                formData,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
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

    addTorrent: async (magnetLink) => {
        try {
            const { rdtClientUrl, rdtClientDownloadPath } = useSettingsStore.getState();

            if (!rdtClientUrl) throw new Error('RDT Client URL not configured');

            // LOGIC SWITCH:
            // If Dev: Use empty string (browser resolves to localhost:3000/api...) -> Hits Proxy
            // If Prod: Use the User's URL (http://192.../api...) -> Direct Request
            const baseUrl = import.meta.env.DEV 
                ? '' 
                : rdtClientUrl.replace(/\/$/, '');

            // First authenticate to get session cookie
            await rdtclient.authenticate();

            // Add torrent using form-urlencoded
            // The session cookie from auth will be automatically sent with withCredentials
            const formData = new URLSearchParams();
            formData.append('urls', magnetLink);
            formData.append('category', rdtClientDownloadPath || 'TED');

            const response = await axios.post(
                `${baseUrl}/api/v2/torrents/add`,
                formData,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
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
    }
};

export default rdtclient;
