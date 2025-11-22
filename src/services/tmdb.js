import axios from 'axios';
import useSettingsStore from '../store/settingsStore';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

const tmdb = {
    // Find TMDB ID from IMDb ID
    findByImdb: async (imdbId) => {
        try {
            // Get API key from settings store
            const { tmdbApiKey } = useSettingsStore.getState();

            if (!tmdbApiKey) {
                console.warn('TMDB API key not configured. Please add it in Settings.');
                return null;
            }

            const response = await axios.get(`${TMDB_BASE_URL}/find/${imdbId}`, {
                params: {
                    api_key: tmdbApiKey,
                    external_source: 'imdb_id'
                }
            });

            // Check if movie or TV show
            const movie = response.data.movie_results?.[0];
            const tv = response.data.tv_results?.[0];

            return {
                id: movie?.id || tv?.id,
                type: movie ? 'movie' : 'tv',
                data: movie || tv
            };
        } catch (error) {
            if (error.response?.status === 401) {
                console.error('TMDB API key is invalid. Please check TMDB_SETUP.md for setup instructions.');
            } else {
                console.error('Error finding by IMDb ID:', error);
            }
            return null;
        }
    },

    // Get movie credits (cast)
    getMovieCredits: async (tmdbId) => {
        try {
            const { tmdbApiKey } = useSettingsStore.getState();
            if (!tmdbApiKey) return [];

            const response = await axios.get(`${TMDB_BASE_URL}/movie/${tmdbId}/credits`, {
                params: {
                    api_key: tmdbApiKey
                }
            });

            return response.data.cast || [];
        } catch (error) {
            console.error('Error fetching movie credits:', error);
            return [];
        }
    },

    // Get TV show credits (cast)
    getTVCredits: async (tmdbId) => {
        try {
            const { tmdbApiKey } = useSettingsStore.getState();
            if (!tmdbApiKey) return [];

            const response = await axios.get(`${TMDB_BASE_URL}/tv/${tmdbId}/credits`, {
                params: {
                    api_key: tmdbApiKey
                }
            });

            return response.data.cast || [];
        } catch (error) {
            console.error('Error fetching TV credits:', error);
            return [];
        }
    },

    // Get cast for any media by IMDb ID
    getCastByImdb: async (imdbId, mediaType) => {
        try {
            // First, find TMDB ID from IMDb ID
            const found = await tmdb.findByImdb(imdbId);
            if (!found || !found.id) return [];

            // Get credits based on type
            const cast = mediaType === 'movie' || found.type === 'movie'
                ? await tmdb.getMovieCredits(found.id)
                : await tmdb.getTVCredits(found.id);

            // Format cast data with image URLs
            return cast.map(member => ({
                name: member.name,
                character: member.character,
                profile_path: member.profile_path
                    ? `${TMDB_IMAGE_BASE}/w185${member.profile_path}`
                    : null,
                order: member.order
            }));
        } catch (error) {
            console.error('Error getting cast by IMDb:', error);
            return [];
        }
    },

    // Helper to get full image URL
    getImageUrl: (path, size = 'w500') => {
        if (!path) return null;
        return `${TMDB_IMAGE_BASE}/${size}${path}`;
    }
};

export default tmdb;
