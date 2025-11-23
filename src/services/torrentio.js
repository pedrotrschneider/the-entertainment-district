import axios from 'axios';

const BASE_URL = import.meta.env.DEV ? '/api/torrentio' : 'https://torrentio.strem.fun';

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
