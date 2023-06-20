'use client';

import { forwardRef, useImperativeHandle } from 'react';
import { useRefs } from '../../hooks/useRefs';
import { useTransitionController } from '../../hooks/TransitionController';
import {
  setupTransitionInTimeline,
  setupTransitionOutTimeline,
} from './TransitionController';
import { GamePosition } from '@/data/enums/GamePosition';
import classNames from 'classnames';
import { useStore } from '@/store/useStore';
import { useDisplayBetAmount } from './BetAmount.hooks';
import styles from './BetAmount.module.scss';

export interface BetAmountProps extends React.HTMLProps<HTMLDivElement> {
  gamePosition: GamePosition;
}

export type BetAmountRefs = {
  element: HTMLDivElement;
  background: HTMLDivElement;
  oldBet: HTMLDivElement;
  newBet: HTMLDivElement;
};

export type BetAmountRefObjects = {
  [key in keyof BetAmountRefs]: React.RefObject<BetAmountRefs[key]>;
};

const BetAmount: React.ForwardRefExoticComponent<
  BetAmountProps & React.RefAttributes<HTMLDivElement>
> = forwardRef(({ className, gamePosition }, forwardRef) => {
  const refs = useRefs<BetAmountRefs>();
  const openPosition = useStore((state) => state.openPositions[gamePosition]);

  useImperativeHandle(forwardRef, () => refs.element.current!);

  const transitionController = useTransitionController<BetAmountRefs>({
    ref: refs.element,
    refs,
    setupTransitionInTimeline,
    setupTransitionOutTimeline,
  });

  const previousValue = useDisplayBetAmount(
    refs,
    transitionController,
    gamePosition
  );

  return (
    <div
      className={classNames('copy-02', styles.element, className)}
      ref={refs.element}
    >
      <div
        className={styles.background}
        ref={refs.background}
      />
      <div
        className={classNames(
          styles.bet,
          styles[`length-${openPosition.toString().length}`]
        )}
        ref={refs.newBet}
      >
        {openPosition}
      </div>
      <div
        className={classNames(
          classNames(styles.bet, styles.oldBet),
          styles[`length-${previousValue.toString().length}`]
        )}
        ref={refs.oldBet}
      >
        {previousValue}
      </div>
    </div>
  );
});

export default BetAmount;
