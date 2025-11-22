import axios from 'axios';
import useSettingsStore from '../store/settingsStore';

const BASE_URL = 'https://api.real-debrid.com/rest/1.0';

const getHeaders = () => {
    const { realDebridApiKey } = useSettingsStore.getState();
    return {
        Authorization: `Bearer ${realDebridApiKey}`
    };
};

const realdebrid = {
    addMagnet: async (magnet) => {
        try {
            const formData = new FormData();
            formData.append('magnet', magnet);

            const response = await axios.post(`${BASE_URL}/torrents/addMagnet`, formData, {
                headers: getHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error adding magnet to Real-Debrid:', error);
            throw error;
        }
    },

    getTorrentInfo: async (id) => {
        try {
            const response = await axios.get(`${BASE_URL}/torrents/info/${id}`, {
                headers: getHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error getting torrent info:', error);
            throw error;
        }
    },

    selectFiles: async (id, files = 'all') => {
        try {
            const formData = new FormData();
            formData.append('files', files);

            const response = await axios.post(`${BASE_URL}/torrents/selectFiles/${id}`, formData, {
                headers: getHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error selecting files:', error);
            throw error;
        }
    },

    unrestrictLink: async (link) => {
        try {
            const formData = new FormData();
            formData.append('link', link);

            const response = await axios.post(`${BASE_URL}/unrestrict/link`, formData, {
                headers: getHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error unrestricting link:', error);
            throw error;
        }
    },

    testConnection: async () => {
        try {
            const { realDebridApiKey } = useSettingsStore.getState();
            if (!realDebridApiKey) {
                throw new Error('No API key configured');
            }

            const response = await axios.get(`${BASE_URL}/user`, {
                headers: getHeaders()
            });
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Real-Debrid connection test failed:', error);
            return { success: false, error: error.message };
        }
    }
};

export default realdebrid;
