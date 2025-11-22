import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSettingsStore = create(
    persist(
        (set) => ({
            realDebridApiKey: '',
            rdtClientUrl: '',
            rdtClientUsername: '',
            rdtClientPassword: '',
            rdtClientDownloadPath: '',
            traktClientId: '',
            theme: 'dark', // 'dark' or 'light'

            setRealDebridApiKey: (key) => set({ realDebridApiKey: key }),
            setRdtClientUrl: (url) => set({ rdtClientUrl: url }),
            setRdtClientUsername: (username) => set({ rdtClientUsername: username }),
            setRdtClientPassword: (password) => set({ rdtClientPassword: password }),
            setRdtClientDownloadPath: (path) => set({ rdtClientDownloadPath: path }),
            setTraktClientId: (id) => set({ traktClientId: id }),
            setTheme: (theme) => set({ theme }),
        }),
        {
            name: 'ted-settings', // unique name for localStorage key
        }
    )
);

export default useSettingsStore;
