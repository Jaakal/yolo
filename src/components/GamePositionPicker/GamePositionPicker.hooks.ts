import { useRef } from 'react';
import { useUpdateEffect } from 'react-use';
import { useStore } from '@/store/useStore';
import { GameState } from '@/data/enums/GameState';
import { kickerToggleTransition } from './TransitionController';

export const useToggleKicker = (kicker: React.RefObject<HTMLDivElement>) => {
  const isKickerTransitionedIn = useRef<boolean>(true);
  const gameState = useStore((state) => state.gameState);

  useUpdateEffect(() => {
    if (!kicker.current) {
      return;
    }

    const pickingPositionsIsOpen =
      gameState === GameState.PickPositions && !isKickerTransitionedIn.current;
    const pickingPositionsNotOpen =
      gameState !== GameState.PickPositions && isKickerTransitionedIn.current;

    if (pickingPositionsIsOpen) {
      isKickerTransitionedIn.current = true;
      kickerToggleTransition(kicker.current);
    } else if (pickingPositionsNotOpen) {
      isKickerTransitionedIn.current = false;
      kickerToggleTransition(kicker.current, false);
    }
  }, [gameState]);
};
