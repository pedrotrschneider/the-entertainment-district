import axios from 'axios';

const BASE_URL = 'https://v3-cinemeta.strem.io';

const cinemeta = {
    getTrendingMovies: async () => {
        return cinemeta.getCatalog('movie', 'top');
    },

    getTrendingSeries: async () => {
        return cinemeta.getCatalog('series', 'top');
    },

    getCatalog: async (type, id, genre = null, skip = 0) => {
        try {
            let url = `${BASE_URL}/catalog/${type}/${id}`;
            const params = [];

            if (genre) {
                params.push(`genre=${encodeURIComponent(genre)}`);
            }
            if (skip) {
                params.push(`skip=${skip}`);
            }

            if (params.length > 0) {
                url += `/${params.join('&')}`;
            }
            url += '.json';

            const response = await axios.get(url);
            return response.data.metas || [];
        } catch (error) {
            console.error(`Error fetching catalog ${type}/${id} ${genre || ''}:`, error);
            return [];
        }
    },

    search: async (type, query) => {
        try {
            const response = await axios.get(`${BASE_URL}/catalog/${type}/top/search=${query}.json`);
            return response.data.metas || [];
        } catch (error) {
            console.error(`Error searching ${type}:`, error);
            return [];
        }
    },

    getMeta: async (type, id) => {
        try {
            const response = await axios.get(`${BASE_URL}/meta/${type}/${id}.json`);
            return response.data.meta || null;
        } catch (error) {
            console.error(`Error fetching meta for ${id}:`, error);
            return null;
        }
    }
};

export default cinemeta;
