import axios from 'axios';

const BASE_URL = 'https://v3-cinemeta.strem.io';

const cinemeta = {
    getTrendingMovies: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/catalog/movie/top.json`);
            return response.data.metas || [];
        } catch (error) {
            console.error('Error fetching trending movies:', error);
            return [];
        }
    },

    getTrendingSeries: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/catalog/series/top.json`);
            return response.data.metas || [];
        } catch (error) {
            console.error('Error fetching trending series:', error);
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
