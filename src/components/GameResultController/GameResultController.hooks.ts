import { useRef, useState } from 'react';
import { useUpdateEffect } from 'react-use';
import { useStore } from '@/store/useStore';
import { GameState } from '@/data/enums/GameState';
import { GameResult } from '@/data/enums/GameResult';
import gameSpecifications from '@/data/gameSpecifications';
import { TransitionController } from '@/hooks/TransitionController';
import { gameSliceDefaultValues } from '@/store/gameSlice';
import { createElementArrayKeys } from '@/utils/createElementArrayKeys';
import { Labels, GameResultControllerRefObjects } from './GameResultController';
import { lostResultTransition, resultTransition } from './TransitionController';
import { destructureRefObjects } from '@/utils/destructureRefs';
import { useSoundManager } from '@/hooks/SoundManager/useSoundManager';

export const useGameResultController = (
  transitionController: TransitionController,
  resultTimeline: React.RefObject<gsap.core.Timeline | null>
) => {
  const isTransitionedIn = useRef<boolean>(false);
  const winningSum = useStore((state) => state.winningSum);
  const openPositions = useStore((state) => state.openPositions);
  const resetGame = useStore((state) => state.resetGame);
  const addToBalance = useStore((state) => state.addToBalance);
  const gameState = useStore((state) => state.gameState);
  const setGameState = useStore((state) => state.setGameState);
  const setPlayerLastRoundWin = useStore(
    (state) => state.setPlayerLastRoundWin
  );
  const setPlayerLastRoundBet = useStore(
    (state) => state.setPlayerLastRoundBet
  );

  useUpdateEffect(() => {
    const gamePlayEnded =
      gameState === GameState.Result && !isTransitionedIn.current;
    const gameIsResetting =
      gameState === GameState.Clear && isTransitionedIn.current;

    if (gamePlayEnded) {
      isTransitionedIn.current = true;
    } else if (gameIsResetting) {
      isTransitionedIn.current = false;

      (async () => {
        addToBalance(winningSum);
        setPlayerLastRoundWin(winningSum);
        const openPositionsSum = Object.values(openPositions).reduce(
          (sum: number, currentValue: number | null) =>
            sum + (currentValue ?? 0),
          0
        );
        setPlayerLastRoundBet(openPositionsSum!);

        resultTimeline.current?.kill();

        await transitionController.transitionOut();

        resetGame();
        setGameState(GameState.PickPositions);
      })();
    }
  }, [gameState]);
};

export const useFindWinningSum = () => {
  const openPositions = useStore((state) => state.openPositions);
  const openPositionsCount = useStore((state) => state.openPositionsCount);
  const playerChoice = useStore((state) => state.playerChoice);
  const gameResult = useStore((state) => state.gameResult);
  const setWinningSum = useStore((state) => state.setWinningSum);

  useUpdateEffect(() => {
    const gamePlayEnded = gameResult && playerChoice;
    if (gamePlayEnded) {
      const playerWon = gameResult === GameResult.Won;
      const playerHasTie = gameResult === GameResult.Tie;
      let winningSum = 0;

      if (playerWon) {
        winningSum =
          (openPositions[playerChoice!] ?? 0) *
          gameSpecifications.winningRates[openPositionsCount];
      } else if (playerHasTie) {
        winningSum = openPositions[playerChoice!] ?? 0;
      }

      setWinningSum(winningSum);
    }
  }, [gameResult, playerChoice]);
};

type UseResultLabel = {
  resultLabel: string;
  resultLabelCharacterKeys: React.MutableRefObject<string[]>;
};

export const useResultLabel = (
  setWinningSumValue: React.Dispatch<React.SetStateAction<number>>,
  otherProps: Labels
): UseResultLabel => {
  const [resultLabel, setResultLabel] = useState<string>('');
  const playerChoice = useStore((state) => state.playerChoice);
  const gameResult = useStore((state) => state.gameResult);
  const resultLabelCharacterKeys = useRef<Array<string>>(
    createElementArrayKeys(resultLabel.length)
  );

  useUpdateEffect(() => {
    const resultLabelDataIsReady =
      playerChoice !== gameSliceDefaultValues.playerChoice &&
      gameResult !== gameSliceDefaultValues.gameResult;
    const resultDataIsReadyForReset =
      playerChoice === gameSliceDefaultValues.playerChoice &&
      gameResult === gameSliceDefaultValues.gameResult;

    if (resultLabelDataIsReady) {
      const _resultLabel = `${
        (playerChoice && otherProps[`${playerChoice}Label`]) ?? ''
      } ${(gameResult && otherProps[`${gameResult}Label`]) ?? ''}`;

      resultLabelCharacterKeys.current = createElementArrayKeys(
        _resultLabel.length
      );
      setResultLabel(_resultLabel);
    } else if (resultDataIsReadyForReset) {
      setResultLabel('');
      setWinningSumValue(0);
    }
  }, [gameResult, playerChoice]);

  return { resultLabel, resultLabelCharacterKeys };
};

export const useResultLabelTransitions = (
  refs: GameResultControllerRefObjects,
  resultTimeline: React.MutableRefObject<gsap.core.Timeline | null>,
  setWinningSumValue: React.Dispatch<React.SetStateAction<number>>,
  resultLabel: string
) => {
  const gameState = useStore((state) => state.gameState);
  const gameResult = useStore((state) => state.gameResult);
  const winningSum = useStore((state) => state.winningSum);
  const soundManager = useSoundManager();

  useUpdateEffect(() => {
    const elements = destructureRefObjects(refs);
    const highlightLength = 3; // win/tie character length
    const resultScreenIsReadyToTransitionIn =
      gameState === GameState.Result &&
      gameResult !== gameSliceDefaultValues.gameResult &&
      resultLabel.length > 0;

    if (resultScreenIsReadyToTransitionIn) {
      switch (gameResult) {
        case GameResult.Won:
          resultTimeline.current = resultTransition(
            elements,
            highlightLength,
            'win-heading-character-outline',
            winningSum,
            setWinningSumValue,
            gameResult,
            soundManager
          );
          break;
        case GameResult.Tie:
          resultTimeline.current = resultTransition(
            elements,
            highlightLength,
            'tie-heading-character-outline',
            winningSum,
            setWinningSumValue,
            gameResult,
            soundManager
          );
          break;
        case GameResult.Lost:
          resultTimeline.current = lostResultTransition(elements, soundManager);
          break;
      }
    }
  }, [gameState, gameResult, resultLabel]);
};

type UseFlags = {
  isResultScreenHidden: boolean;
};

export const useFlags = (): UseFlags => {
  const gameState = useStore((state) => state.gameState);
  const isResultScreenHidden = ![GameState.Result, GameState.Clear].includes(
    gameState
  );
  return {
    isResultScreenHidden,
  };
};
