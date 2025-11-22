import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSettingsStore = create(
    persist(
        (set) => ({
            realDebridApiKey: '',
            rdtClientUrl: '',
            traktClientId: '',
            theme: 'dark', // 'dark' or 'light'

            setRealDebridApiKey: (key) => set({ realDebridApiKey: key }),
            setRdtClientUrl: (url) => set({ rdtClientUrl: url }),
            setTraktClientId: (id) => set({ traktClientId: id }),
            setTheme: (theme) => set({ theme }),
        }),
        {
            name: 'ted-settings', // unique name for localStorage key
        }
    )
);

export default useSettingsStore;
