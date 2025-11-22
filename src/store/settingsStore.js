import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSettingsStore = create(
    persist(
        (set) => ({
            // Real-Debrid
            realDebridApiKey: '',
            setRealDebridApiKey: (key) => set({ realDebridApiKey: key }),

            // RDT Client
            rdtClientUrl: '',
            setRdtClientUrl: (url) => set({ rdtClientUrl: url }),
            rdtClientUsername: '',
            setRdtClientUsername: (username) => set({ rdtClientUsername: username }),
            rdtClientPassword: '',
            setRdtClientPassword: (password) => set({ rdtClientPassword: password }),
            rdtClientMoviesPath: 'Movies',
            setRdtClientMoviesPath: (path) => set({ rdtClientMoviesPath: path }),
            rdtClientShowsPath: 'TV Shows',
            setRdtClientShowsPath: (path) => set({ rdtClientShowsPath: path }),

            // Trakt
            traktClientId: '',
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
            tmdbApiKey: '',
            setTmdbApiKey: (key) => set({ tmdbApiKey: key }),

            // Theme
            theme: 'dark',
            setTheme: (theme) => set({ theme: theme }),
        }),
        {
            name: 'ted-settings', // unique name for localStorage key
        }
    )
);

export default useSettingsStore;
