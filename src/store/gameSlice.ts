import { StateCreator } from 'zustand';
import { GameState } from '@/data/enums/GameState';
import { GamePosition } from '@/data/enums/GamePosition';
import { StatsBarStats } from '@/data/enums/StatsBarStats';
import gameSpecifications from '@/data/gameSpecifications';
import { GameResult } from '@/data/enums/GameResult';

type OpenPositions = Record<GamePosition, number>;

export type GameSlice = {
  gameState: GameState;
  setGameState: (gameState: GameState) => void;
  openPositions: OpenPositions;
  setOpenPosition: (gamePosition: GamePosition) => void;
  openPositionsCount: number;
  gameResult: GameResult | null;
  setGameResult: (gameResult: GameResult) => void;
  winningSum: number;
  setWinningSum: (winningSum: number) => void;
  playerChoice: GamePosition | null;
  setPlayerChoice: (playerChoice: GamePosition | null) => void;
  resetGame: () => void;
  addToBalance: (amount: number) => void;
  setPlayerLastRoundBet: (playerLastRoundBet: number) => void;
  setPlayerLastRoundWin: (playerLastRoundWin: number) => void;
} & Record<StatsBarStats, number>;

type GameSliceDefaultValues = {
  openPositionsCount: number;
  gameResult: null;
  winningSum: number;
  playerChoice: null;
  openPositions: OpenPositions;
};

export const gameSliceDefaultValues: GameSliceDefaultValues = {
  openPositionsCount: 0,
  gameResult: null,
  winningSum: 0,
  playerChoice: null,
  openPositions: {
    [GamePosition.Rock]: 0,
    [GamePosition.Paper]: 0,
    [GamePosition.Scissors]: 0,
  },
};

export const createGameSlice: StateCreator<GameSlice, [], [], GameSlice> = (
  set
) => ({
  gameState: GameState.PickPositions,
  setGameState: (gameState) => set(() => ({ gameState })),
  openPositions: {
    ...gameSliceDefaultValues.openPositions,
  },
  setOpenPosition: (gamePosition) =>
    set((state) => {
      const { betStep } = gameSpecifications;
      const newOpenPositions = { ...state.openPositions };
      let newOpenPositionCount = state.openPositionsCount;

      if (newOpenPositions[gamePosition] === 0) {
        newOpenPositionCount += 1;
      }

      newOpenPositions[gamePosition] += betStep;

      return {
        [StatsBarStats.PlayerBalance]:
          state[StatsBarStats.PlayerBalance] - betStep,
        openPositions: newOpenPositions,
        openPositionsCount: newOpenPositionCount,
      };
    }),
  openPositionsCount: gameSliceDefaultValues.openPositionsCount,
  gameResult: gameSliceDefaultValues.gameResult,
  setGameResult: (gameResult) => set(() => ({ gameResult })),
  winningSum: gameSliceDefaultValues.winningSum,
  setWinningSum: (winningSum) => set(() => ({ winningSum })),
  playerChoice: gameSliceDefaultValues.playerChoice,
  setPlayerChoice: (playerChoice) => set(() => ({ playerChoice })),
  resetGame: () =>
    set(() => ({
      ...gameSliceDefaultValues,
      openPositions: {
        ...gameSliceDefaultValues.openPositions,
      },
    })),
  addToBalance: (amount) =>
    set((state) => ({ playerBalance: state.playerBalance + amount })),
  setPlayerLastRoundBet: (setPlayerLastRoundBet) =>
    set(() => ({ [StatsBarStats.PlayerLastRoundBet]: setPlayerLastRoundBet })),
  setPlayerLastRoundWin: (setPlayerLastRoundWin) =>
    set(() => ({ [StatsBarStats.PlayerLastRoundWin]: setPlayerLastRoundWin })),
  [StatsBarStats.PlayerBalance]: gameSpecifications.playerStartingBalance,
  [StatsBarStats.PlayerLastRoundBet]: 0,
  [StatsBarStats.PlayerLastRoundWin]: 0,
});
