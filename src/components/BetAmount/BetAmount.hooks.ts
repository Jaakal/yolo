import { useRef } from 'react';
import { useUpdateEffect } from 'react-use';
import { useStore } from '@/store/useStore';
import { GameState } from '@/data/enums/GameState';
import { GamePosition } from '@/data/enums/GamePosition';
import { TransitionController } from '@/hooks/TransitionController';
import { BetAmountRefObjects } from './BetAmount';
import { increaseBetTransition } from './TransitionController';
import { destructureRefObjects } from '@/utils/destructureRefs';

export const useDisplayBetAmount = (
  refs: BetAmountRefObjects,
  transitionController: TransitionController,
  gamePosition: GamePosition
): number => {
  const isTransitionedIn = useRef<boolean>(false);
  const previousValue = useRef<number>(0);
  const gameState = useStore((state) => state.gameState);
  const openPosition = useStore((state) => state.openPositions[gamePosition]);

  useUpdateEffect(() => {
    const bettingPositionIsOpened =
      openPosition > 0 && !isTransitionedIn.current;
    const gameIsResetting =
      gameState === GameState.Clear && isTransitionedIn.current;
    const addingToAlreadyOpenPosition =
      gameState === GameState.PickPositions &&
      openPosition > 0 &&
      isTransitionedIn.current;

    if (bettingPositionIsOpened) {
      isTransitionedIn.current = true;
      transitionController.transitionIn();
    } else if (gameIsResetting) {
      isTransitionedIn.current = false;
      transitionController.transitionOut();
    } else if (addingToAlreadyOpenPosition) {
      previousValue.current = openPosition;
      const destructuredRefs = destructureRefObjects(refs);
      increaseBetTransition(destructuredRefs);
    }
  }, [gameState, openPosition]);

  return previousValue.current;
};
