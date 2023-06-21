'use client';

import { forwardRef, useImperativeHandle, useState, useRef } from 'react';
import { useRefs } from '../../hooks/useRefs';
import { useTransitionController } from '../../hooks/TransitionController';
import { setupTransitionInTimeline } from './TransitionController';
import classNames from 'classnames';
import { useStore } from '@/store/useStore';
import {
  useFindWinningSum,
  useGameResultController,
  useResultLabelTransitions,
  useFlags,
} from './GameResultController.hooks';
import { GameResult } from '@/data/enums/GameResult';
import { GamePosition } from '@/data/enums/GamePosition';
import SplitLine from '../type/SplitLine/SplitLine';
import { useArrayRef } from '@/hooks/useArrayRef';
import styles from './GameResultController.module.scss';
import { useResultLabel } from './GameResultController.hooks';

export interface GameResultControllerProps
  extends React.HTMLProps<HTMLDivElement> {
  rockLabel: string;
  paperLabel: string;
  scissorsLabel: string;
  wonLabel: string;
  tieLabel: string;
  lostLabel: string;
  amountLabel: string;
}

export type GameResultControllerRefs = {
  element: HTMLDivElement;
  playersChoice: HTMLDivElement;
  amountLabel: HTMLSpanElement;
  amount: HTMLSpanElement;
  resultLabelChars: Array<HTMLSpanElement>;
};

export type GameResultControllerRefObjects = {
  [key in keyof GameResultControllerRefs]: React.RefObject<
    GameResultControllerRefs[key]
  >;
};

type Labelize<Type> = {
  [Property in keyof Type as `${string & Property}Label`]: string;
};

export type Labels = Labelize<Record<GamePosition, string>> &
  Labelize<Record<GameResult, string>>;

const GameResultController: React.ForwardRefExoticComponent<
  GameResultControllerProps & React.RefAttributes<HTMLDivElement>
> = forwardRef(function GameResultController(
  { amountLabel, ...otherProps },
  forwardRef
) {
  const [resultLabelChars, addResultLabelCharsRef] =
    useArrayRef<HTMLSpanElement>();
  const refs = useRefs<GameResultControllerRefs>({ resultLabelChars });
  const resultTimeline = useRef<gsap.core.Timeline | null>(null);
  const [winningSumValue, setWinningSumValue] = useState<number>(0);
  const gameResult = useStore((state) => state.gameResult);
  const winningSum = useStore((state) => state.winningSum);

  useImperativeHandle(forwardRef, () => refs.element.current!);

  const transitionController =
    useTransitionController<GameResultControllerRefs>({
      ref: refs.element,
      refs,
      setupTransitionInTimeline,
    });

  useGameResultController(transitionController, resultTimeline);
  useFindWinningSum();
  const { resultLabel, resultLabelCharacterKeys } = useResultLabel(
    setWinningSumValue,
    otherProps as unknown as Labels
  );
  useResultLabelTransitions(
    refs,
    resultTimeline,
    setWinningSumValue,
    resultLabel
  );
  const { isResultScreenHidden } = useFlags();

  return (
    <div
      className={classNames(
        'heading-01',
        styles.element,
        isResultScreenHidden && styles.isHidden
      )}
      ref={refs.element}
    >
      <div
        className={classNames(styles.result, styles[gameResult ?? ''])}
        ref={refs.playersChoice}
      >
        <SplitLine
          copy={resultLabel}
          copyCharacterKeys={resultLabelCharacterKeys.current}
          addCharacterRef={addResultLabelCharsRef}
        />
      </div>
      <div className={classNames('copy-01', styles.winSum)}>
        <span
          className={styles.amountLabel}
          ref={refs.amountLabel}
        >
          {amountLabel}
        </span>
        <span
          className={classNames(
            styles.winSumAmount,
            styles[`length-${winningSum.toString().length}`]
          )}
          ref={refs.amount}
        >
          {winningSumValue}
        </span>
      </div>
    </div>
  );
});

export default GameResultController;
