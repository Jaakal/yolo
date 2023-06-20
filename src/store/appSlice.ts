import { StateCreator } from 'zustand';

export type AppSlice = {
  isMuted: boolean;
  setIsMuted: (isMuted: boolean) => void;
  toggleIsMuted: () => void;
};

export const createAppSlice: StateCreator<AppSlice, [], [], AppSlice> = (
  set
) => ({
  isMuted: false,
  setIsMuted: (isMuted) => set(() => ({ isMuted })),
  toggleIsMuted: () => set((state) => ({ isMuted: !state.isMuted })),
});
