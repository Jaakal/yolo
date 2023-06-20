import { create } from 'zustand';
import { AppSlice, createAppSlice } from './appSlice';
import { GameSlice, createGameSlice } from './gameSlice';

export const useStore = create<AppSlice & GameSlice>()((...a) => ({
  ...createAppSlice(...a),
  ...createGameSlice(...a),
}));
