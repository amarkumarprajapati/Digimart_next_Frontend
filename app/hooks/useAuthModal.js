import { create } from 'zustand';

export const useAuthModal = create((set) => ({
    isOpen: false,
    defaultTab: 'signin',
    openSignIn: () => set({ isOpen: true, defaultTab: 'signin' }),
    openSignUp: () => set({ isOpen: true, defaultTab: 'signup' }),
    close: () => set({ isOpen: false }),
}));
