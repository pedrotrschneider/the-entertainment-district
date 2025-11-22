import axios from 'axios';
import useSettingsStore from '../store/settingsStore';

const TRAKT_API_BASE = 'https://api.trakt.tv';
const TRAKT_API_VERSION = '2';

const trakt = {
    // Create axios instance with common headers
    getClient: () => {
        const { traktClientId, traktAccessToken } = useSettingsStore.getState();

        return axios.create({
            baseURL: TRAKT_API_BASE,
            headers: {
                'Content-Type': 'application/json',
                'trakt-api-version': TRAKT_API_VERSION,
                'trakt-api-key': traktClientId || '',
                ...(traktAccessToken && { 'Authorization': `Bearer ${traktAccessToken}` })
            }
        });
    },

    // Device Authentication Flow
    getDeviceCode: async () => {
        const { traktClientId } = useSettingsStore.getState();

        if (!traktClientId) {
            throw new Error('Trakt Client ID not configured');
        }

        const response = await axios.post(`${TRAKT_API_BASE}/oauth/device/code`, {
            client_id: traktClientId
        });

        return response.data; // { device_code, user_code, verification_url, expires_in, interval }
    },

    pollForToken: async (deviceCode) => {
        const { traktClientId } = useSettingsStore.getState();

        const response = await axios.post(`${TRAKT_API_BASE}/oauth/device/token`, {
            code: deviceCode,
            client_id: traktClientId
        });

        return response.data; // { access_token, token_type, expires_in, refresh_token, scope, created_at }
    },

    refreshToken: async () => {
        const { traktClientId, traktClientSecret, traktRefreshToken } = useSettingsStore.getState();

        if (!traktRefreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await axios.post(`${TRAKT_API_BASE}/oauth/token`, {
            refresh_token: traktRefreshToken,
            client_id: traktClientId,
            client_secret: traktClientSecret,
            grant_type: 'refresh_token'
        });

        return response.data;
    },

    // Account
    getSettings: async () => {
        const client = trakt.getClient();
        const response = await client.get('/users/settings');
        return response.data;
    },

    // Watchlist
    getWatchlist: async (type = 'all') => {
        const client = trakt.getClient();
        const { traktAccountInfo } = useSettingsStore.getState();

        if (!traktAccountInfo?.username) {
            throw new Error('Not authenticated with Trakt');
        }

        let endpoint = `/users/${traktAccountInfo.username}/watchlist`;
        if (type !== 'all') {
            endpoint += `/${type}`;
        }

        const response = await client.get(endpoint);
        return response.data;
    },

    addToWatchlist: async (item) => {
        const client = trakt.getClient();

        // item format: { movies: [{ ids: { imdb: 'tt123' } }] } or { shows: [...] }
        const response = await client.post('/sync/watchlist', item);
        return response.data;
    },

    removeFromWatchlist: async (item) => {
        const client = trakt.getClient();

        const response = await client.post('/sync/watchlist/remove', item);
        return response.data;
    },

    // Watch History
    getHistory: async (type = 'all', page = 1, limit = 20) => {
        const client = trakt.getClient();
        const { traktAccountInfo } = useSettingsStore.getState();

        if (!traktAccountInfo?.username) {
            throw new Error('Not authenticated with Trakt');
        }

        let endpoint = `/users/${traktAccountInfo.username}/history`;
        if (type !== 'all') {
            endpoint += `/${type}`;
        }

        const response = await client.get(endpoint, {
            params: { page, limit }
        });
        return response.data;
    },

    addToHistory: async (item) => {
        const client = trakt.getClient();

        // item format: { movies: [{ ids: { imdb: 'tt123' }, watched_at: '...' }] }
        const response = await client.post('/sync/history', item);
        return response.data;
    },

    // Trending & Popular
    getTrending: async (type = 'movies', page = 1, limit = 20) => {
        const client = trakt.getClient();

        const response = await client.get(`/${type}/trending`, {
            params: { page, limit }
        });
        return response.data;
    },

    getPopular: async (type = 'movies', page = 1, limit = 20) => {
        const client = trakt.getClient();

        const response = await client.get(`/${type}/popular`, {
            params: { page, limit }
        });
        return response.data;
    },

    // Search
    searchByImdb: async (imdbId, type = 'movie') => {
        const client = trakt.getClient();

        const response = await client.get('/search/imdb/' + imdbId, {
            params: { type }
        });
        return response.data;
    }
};

export default trakt;
