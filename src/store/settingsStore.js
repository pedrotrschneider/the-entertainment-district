import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Helper function to get environment variable or default
const getEnvOrDefault = (envVar, defaultValue = '') => {
    return import.meta.env[envVar] || defaultValue;
};

const useSettingsStore = create(
    persist(
        (set) => ({
            // Real-Debrid
            realDebridApiKey: getEnvOrDefault('VITE_REAL_DEBRID_API_KEY'),
            setRealDebridApiKey: (key) => set({ realDebridApiKey: key }),

            // RDT Client
            rdtClientUrl: getEnvOrDefault('VITE_RDT_CLIENT_URL'),
            setRdtClientUrl: (url) => set({ rdtClientUrl: url }),
            rdtClientUsername: getEnvOrDefault('VITE_RDT_CLIENT_USERNAME'),
            setRdtClientUsername: (username) => set({ rdtClientUsername: username }),
            rdtClientPassword: getEnvOrDefault('VITE_RDT_CLIENT_PASSWORD'),
            setRdtClientPassword: (password) => set({ rdtClientPassword: password }),
            rdtClientMoviesPath: getEnvOrDefault('VITE_RDT_CLIENT_MOVIES_PATH', 'Movies'),
            setRdtClientMoviesPath: (path) => set({ rdtClientMoviesPath: path }),
            rdtClientShowsPath: getEnvOrDefault('VITE_RDT_CLIENT_SHOWS_PATH', 'TV Shows'),
            setRdtClientShowsPath: (path) => set({ rdtClientShowsPath: path }),

            // Trakt
            traktClientId: getEnvOrDefault('VITE_TRAKT_CLIENT_ID'),
            setTraktClientId: (id) => set({ traktClientId: id }),
            traktClientSecret: '',
            setTraktClientSecret: (secret) => set({ traktClientSecret: secret }),
            traktAccessToken: '',
            setTraktAccessToken: (token) => set({ traktAccessToken: token }),
            traktRefreshToken: '',
            setTraktRefreshToken: (token) => set({ traktRefreshToken: token }),
            traktExpiresAt: null,
            setTraktExpiresAt: (expiresAt) => set({ traktExpiresAt: expiresAt }),
            traktAccountInfo: null,
            setTraktAccountInfo: (info) => set({ traktAccountInfo: info }),

            // TMDB
            tmdbApiKey: getEnvOrDefault('VITE_TMDB_API_KEY'),
            setTmdbApiKey: (key) => set({ tmdbApiKey: key }),

            // Theme
            theme: 'dark',
            setTheme: (theme) => set({ theme: theme }),
        }),
        {
            name: 'ted-settings', // unique name for localStorage key
            // Merge strategy: stored values take precedence over initial state (env vars)
            merge: (persistedState, currentState) => ({
                ...currentState,
                ...persistedState,
            }),
        }
    )
);

export default useSettingsStore;
