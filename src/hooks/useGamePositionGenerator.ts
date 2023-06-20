import { useCallback, useState } from 'react';
import gsap from 'gsap';
import { GamePosition } from '@/data/enums/GamePosition';
import { useSoundManager } from './SoundManager/useSoundManager';

type PositionValue = GamePosition | '';
type UseGamePositionGenerator = [
  PositionValue,
  boolean,
  () => void,
  () => void
];

type GamePositionGeneratorDefaultValues = {
  value: PositionValue;
  isFinal: boolean;
  steps: number;
  duration: number;
  ease: string;
};

const gamePositionGeneratorDefaultValues: GamePositionGeneratorDefaultValues = {
  value: '',
  isFinal: false,
  steps: 20,
  duration: 2,
  ease: 'power2.out',
};

export const useGamePositionGenerator = (): UseGamePositionGenerator => {
  const [value, setValue] = useState<PositionValue>(
    gamePositionGeneratorDefaultValues.value
  );
  const [isFinal, setIsFinal] = useState<boolean>(
    gamePositionGeneratorDefaultValues.isFinal
  );

  const soundManager = useSoundManager();

  const triggerGenerator = useCallback(() => {
    const { steps, duration, ease } = gamePositionGeneratorDefaultValues;
    const possibleGamePositions = Object.values(GamePosition);
    const finalGamePosition = gsap.utils.random(possibleGamePositions);
    const gamePositions = [finalGamePosition, ...Array(steps - 1)];

    for (let index = 1; index < gamePositions.length; index += 1) {
      const currentStepPossibleGamePositions = possibleGamePositions.filter(
        (gamePosition) => gamePosition !== gamePositions[index - 1]
      );
      gamePositions[index] = gsap.utils.random(
        currentStepPossibleGamePositions
      );
    }

    const gamePositionsIndex = {
      value: steps - 1,
    };

    const gamePositionIndexStepTween = gsap.to(gamePositionsIndex, {
      paused: true,
      value: 0,
      ease: `steps(${steps - 1})`,
    });

    const generatorProgress = { value: 0 };

    gsap.to(generatorProgress, {
      value: 1,
      duration,
      ease,
      onUpdate: () => {
        gamePositionIndexStepTween.progress(generatorProgress.value);
        setValue(gamePositions[gamePositionsIndex.value]);
      },
      onComplete: () => {
        setTimeout(() => {
          setIsFinal(true);
        });
      },
    });
  }, []);

  const resetGenerator = useCallback(() => {
    const { value, isFinal } = gamePositionGeneratorDefaultValues;
    setValue(value);
    setIsFinal(isFinal);
  }, []);

  return [value, isFinal, triggerGenerator, resetGenerator];
};
