import { useRef } from 'react';
import { useUpdateEffect } from 'react-use';
import { useGamePositionGenerator } from '@/hooks/useGamePositionGenerator';
import gameResultSpecifications from '@/data/gameResultSpecifications';
import { GamePosition } from '@/data/enums/GamePosition';
import { wait } from '@/utils/time';
import { useStore } from '@/store/useStore';
import { GameState } from '@/data/enums/GameState';
import { TransitionController } from '@/hooks/TransitionController';
import { useSoundManager } from '@/hooks/SoundManager/useSoundManager';
import { SampleName } from '@/hooks/SoundManager/SampleName';

type UsePositionsGenerator = {
  computerPositionValue: GamePosition;
  playerPositionValue: GamePosition;
};

export const useGamePlayController = (
  transitionController: TransitionController
): UsePositionsGenerator => {
  const soundManager = useSoundManager();
  const playGeneratorClickSound = useRef<{ play: () => void }>({
    play: () => {},
  });
  const isTransitionedIn = useRef<boolean>(false);
  const gameState = useStore((state) => state.gameState);
  const setGameResult = useStore((state) => state.setGameResult);
  const setGameState = useStore((state) => state.setGameState);
  const setPlayerChoice = useStore((state) => state.setPlayerChoice);

  const [
    computerPositionValue,
    isComputerPositionValueFinal,
    triggerComputerPositionGenerator,
    resetComputerPositionGenerator,
  ] = useGamePositionGenerator();

  const [
    playerPositionValue,
    isPlayerPositionValueFinal,
    triggerPlayerPositionGenerator,
    resetPlayerPositionGenerator,
  ] = useGamePositionGenerator();

  useUpdateEffect(() => {
    const gamePlayStarted =
      gameState === GameState.Play && !isTransitionedIn.current;

    if (gamePlayStarted) {
      (async () => {
        isTransitionedIn.current = true;
        transitionController.transitionIn();

        playGeneratorClickSound.current =
          soundManager[SampleName.PositionGeneratorTick];

        triggerComputerPositionGenerator();

        const timeGapBetweenGeneratorsStart = 1;
        await wait(timeGapBetweenGeneratorsStart);
        triggerPlayerPositionGenerator();
      })();
    }
  }, [gameState]);

  useUpdateEffect(() => {
    (async () => {
      const arePositionsFound =
        isComputerPositionValueFinal && isPlayerPositionValueFinal;

      if (arePositionsFound) {
        setPlayerChoice(playerPositionValue as GamePosition);

        const gameResult =
          gameResultSpecifications[playerPositionValue as GamePosition][
            computerPositionValue as GamePosition
          ];
        setGameResult(gameResult);

        const gameResultsDisplayTime = 1;
        await wait(gameResultsDisplayTime);

        await transitionController.transitionOut();
        isTransitionedIn.current = false;

        resetComputerPositionGenerator();
        resetPlayerPositionGenerator();
        setGameState(GameState.Result);
      }
    })();
  }, [isComputerPositionValueFinal, isPlayerPositionValueFinal]);

  useUpdateEffect(() => {
    if (isPlayerPositionValueFinal && isComputerPositionValueFinal) {
      playGeneratorClickSound.current = { play: () => {} };
    }
  }, [isPlayerPositionValueFinal, isComputerPositionValueFinal]);

  useUpdateEffect(() => {
    playGeneratorClickSound.current.play();
  }, [computerPositionValue, playerPositionValue]);

  return {
    computerPositionValue: computerPositionValue as GamePosition,
    playerPositionValue: playerPositionValue as GamePosition,
  };
};

type UseFlags = {
  gamePlayScreenIsHidden: boolean;
};

export const useFlags = (): UseFlags => {
  const gameState = useStore((state) => state.gameState);
  const gamePlayScreenIsHidden = gameState !== GameState.Play;
  return { gamePlayScreenIsHidden };
};
