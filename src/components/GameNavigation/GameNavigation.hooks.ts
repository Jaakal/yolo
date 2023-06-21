import { useCallback } from 'react';
import { useStore } from '@/store/useStore';
import { GameState } from '@/data/enums/GameState';

export const useMainCtaClickHandler = (): (() => void) => {
  const gameState = useStore((state) => state.gameState);
  const setGameState = useStore((state) => state.setGameState);

  return useCallback(() => {
    if (gameState === GameState.PickPositions) {
      setGameState(GameState.Play);
    } else {
      setGameState(GameState.Clear);
    }
  }, [gameState, setGameState]);
};

type UseFlags = {
  noOpenPositions: boolean;
  isOnAutoMode: boolean;
  isResultScreenVisible: boolean;
};

export const useFlags = (): UseFlags => {
  const gameState = useStore((state) => state.gameState);
  const openPositionsCount = useStore((state) => state.openPositionsCount);

  const noOpenPositions =
    gameState === GameState.PickPositions && openPositionsCount === 0;
  const isOnAutoMode =
    gameState === GameState.Play || gameState === GameState.Clear;
  const isResultScreenVisible = gameState === GameState.Result;

  return { noOpenPositions, isOnAutoMode, isResultScreenVisible };
};
