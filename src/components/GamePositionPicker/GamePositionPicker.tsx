'use client';

import { forwardRef, useImperativeHandle, useRef } from 'react';
import { useRefs } from '../../hooks/useRefs';
import { useTransitionController } from '../../hooks/TransitionController';
import { setupTransitionInTimeline } from './TransitionController';
import { GamePosition } from '@/data/enums/GamePosition';
import BetButton from '../buttons/BetButton/BetButton';
import classNames from 'classnames';
import { useToggleKicker } from './GamePositionPicker.hooks';
import { useArrayRef } from '@/hooks/useArrayRef';
import { createElementArrayKeys } from '@/utils/createElementArrayKeys';
import styles from './GamePositionPicker.module.scss';

export interface GamePositionPickerProps
  extends React.HTMLProps<HTMLDivElement> {
  kickerLabel: string;
  rockLabel: string;
  paperLabel: string;
  scissorsLabel: string;
}

export type GamePositionPickerRefs = {
  element: HTMLDivElement;
  kicker: HTMLDivElement;
  betButtons: Array<HTMLButtonElement>;
};

const GamePositionPicker: React.ForwardRefExoticComponent<
  GamePositionPickerProps & React.RefAttributes<HTMLDivElement>
> = forwardRef(
  ({ kickerLabel, rockLabel, paperLabel, scissorsLabel }, forwardRef) => {
    const [betButtons, addBetButtonRef] = useArrayRef<HTMLButtonElement>();
    const refs = useRefs<GamePositionPickerRefs>({ betButtons });
    const betButtonsData = useRef<
      Array<{ gamePosition: GamePosition; label: string }>
    >([
      { gamePosition: GamePosition.Rock, label: rockLabel },
      { gamePosition: GamePosition.Paper, label: paperLabel },
      { gamePosition: GamePosition.Scissors, label: scissorsLabel },
    ]);
    const betButtonsKeys = useRef<Array<string>>(
      createElementArrayKeys(betButtonsData.current.length)
    );

    useImperativeHandle(forwardRef, () => refs.element.current!);

    useTransitionController<GamePositionPickerRefs>({
      ref: refs.element,
      refs,
      setupTransitionInTimeline,
      exposeTransitionController: true,
    });

    useToggleKicker(refs.kicker);

    return (
      <div
        className={styles.element}
        ref={refs.element}
      >
        <div
          className={classNames('copy-02', styles.kicker)}
          ref={refs.kicker}
        >
          {kickerLabel}
        </div>
        <div className={styles.betButtonsWrapper}>
          {betButtonsData.current.map(({ gamePosition, label }, index) => (
            <BetButton
              className={styles.betButton}
              gamePosition={gamePosition}
              label={label}
              ref={addBetButtonRef}
              key={betButtonsKeys.current[index]}
            />
          ))}
        </div>
      </div>
    );
  }
);

export default GamePositionPicker;
