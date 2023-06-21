'use client';

import { forwardRef, useImperativeHandle } from 'react';
import { useRefs } from '../../../hooks/useRefs';
import { useTransitionController } from '../../../hooks/TransitionController';
import { setupTransitionInTimeline } from './TransitionController';
import Button from '../Button/Button';
import { GamePosition } from '@/data/enums/GamePosition';
import classNames from 'classnames';
import BetAmount from '@/components/BetAmount/BetAmount';
import { useBetButtonClickHandler, useFlags } from './BetButton.hooks';
import styles from './BetButton.module.scss';

export interface BetButtonProps extends React.HTMLProps<HTMLButtonElement> {
  gamePosition: GamePosition;
}

export type BetButtonRefs = {
  element: HTMLButtonElement;
};

const BetButton: React.ForwardRefExoticComponent<
  BetButtonProps & React.RefAttributes<HTMLButtonElement>
> = forwardRef(function BetButton(
  { className, gamePosition, label, ...otherProps },
  forwardRef
) {
  const refs = useRefs<BetButtonRefs>();

  useImperativeHandle(forwardRef, () => refs.element.current!);

  useTransitionController<BetButtonRefs>({
    ref: refs.element,
    refs,
    setupTransitionInTimeline,
    exposeTransitionController: true,
  });

  const onBetButtonClick = useBetButtonClickHandler(gamePosition);

  const {
    gameEndedWithThisPlayerGamePosition,
    pickingPositionsNotAvailable,
    openPositionsMaxCountReached,
    notEnoughBalance,
  } = useFlags(gamePosition);

  return (
    <Button
      className={classNames(
        'copy-01',
        styles.element,
        styles[gamePosition],
        gameEndedWithThisPlayerGamePosition && styles.playersChoice,
        className
      )}
      onClick={onBetButtonClick}
      disabled={
        pickingPositionsNotAvailable ||
        openPositionsMaxCountReached ||
        notEnoughBalance
      }
      ref={refs.element}
      {...(otherProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      <BetAmount
        className={styles.betAmount}
        gamePosition={gamePosition}
      />
      <div className={styles.label}>{label}</div>
    </Button>
  );
});

export default BetButton;
