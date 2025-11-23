import axios from 'axios';

import { Capacitor } from '@capacitor/core';

const BASE_URL = Capacitor.isNativePlatform() ? 'https://torrentio.strem.fun' : '/api/torrentio';

const torrentio = {
    getStreams: async (type, id) => {
        try {
            // id format:
            // movie: tt1234567
            // series: tt1234567:1:1 (imdbId:season:episode)
            const response = await axios.get(`${BASE_URL}/stream/${type}/${id}.json`);
            return response.data.streams || [];
        } catch (error) {
            console.error(`Error fetching streams for ${id}:`, error);
            return [];
        }
    }
};

export default torrentio;
