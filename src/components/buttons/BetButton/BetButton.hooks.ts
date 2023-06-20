import { useCallback } from 'react';
import { GamePosition } from '@/data/enums/GamePosition';
import { GameState } from '@/data/enums/GameState';
import { useStore } from '@/store/useStore';
import gameSpecifications from '@/data/gameSpecifications';
import { useSoundManager } from '@/hooks/SoundManager/useSoundManager';
import { SampleName } from '@/hooks/SoundManager/SampleName';

export const useBetButtonClickHandler = (
  gamePosition: GamePosition
): (() => void) => {
  const setOpenPosition = useStore((state) => state.setOpenPosition);
  const soundManager = useSoundManager();
  return useCallback(() => {
    soundManager[SampleName.SlotMachineClick].play();
    setOpenPosition(gamePosition);
  }, []);
};

type UseFlags = {
  gameEndedWithThisPlayerGamePosition: boolean;
  pickingPositionsNotAvailable: boolean;
  openPositionsMaxCountReached: boolean;
  notEnoughBalance: boolean;
};

export const useFlags = (gamePosition: GamePosition): UseFlags => {
  const gameState = useStore((state) => state.gameState);
  const playerBalance = useStore((state) => state.playerBalance);
  const playerChoice = useStore((state) => state.playerChoice);
  const gameResult = useStore((state) => state.gameResult);
  const openPosition = useStore((state) => state.openPositions[gamePosition]);
  const openPositionsCount = useStore((state) => state.openPositionsCount);

  const gameEndedWithThisPlayerGamePosition =
    (gameResult && playerChoice === gamePosition) || false;
  const pickingPositionsNotAvailable = gameState !== GameState.PickPositions;
  const openPositionsMaxCountReached =
    openPositionsCount >= gameSpecifications.openPositionsAtOnce &&
    !openPosition;
  const notEnoughBalance = playerBalance < gameSpecifications.betStep;

  return {
    gameEndedWithThisPlayerGamePosition,
    pickingPositionsNotAvailable,
    openPositionsMaxCountReached,
    notEnoughBalance,
  };
};
