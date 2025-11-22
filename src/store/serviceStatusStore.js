import { create } from 'zustand';

const useServiceStatusStore = create((set) => ({
    realDebridStatus: 'unknown', // 'unknown', 'connected', 'disconnected', 'testing'
    rdtClientStatus: 'unknown',
    traktStatus: 'unknown',
    tmdbStatus: 'unknown',

    setRealDebridStatus: (status) => set({ realDebridStatus: status }),
    setRdtClientStatus: (status) => set({ rdtClientStatus: status }),
    setTraktStatus: (status) => set({ traktStatus: status }),
    setTmdbStatus: (status) => set({ tmdbStatus: status }),

    // Helper methods to check if services are available
    isRealDebridAvailable: () => {
        const { realDebridStatus } = useServiceStatusStore.getState();
        return realDebridStatus === 'connected';
    },
    isRdtClientAvailable: () => {
        const { rdtClientStatus } = useServiceStatusStore.getState();
        return rdtClientStatus === 'connected';
    },
    isTraktAvailable: () => {
        const { traktStatus } = useServiceStatusStore.getState();
        return traktStatus === 'connected';
    },
    isTmdbAvailable: () => {
        const { tmdbStatus } = useServiceStatusStore.getState();
        return tmdbStatus === 'connected';
    }
}));

export default useServiceStatusStore;
