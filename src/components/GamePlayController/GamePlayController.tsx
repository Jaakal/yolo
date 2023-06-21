'use client';

import { forwardRef, useImperativeHandle } from 'react';
import { useRefs } from '../../hooks/useRefs';
import { useTransitionController } from '../../hooks/TransitionController';
import { setupTransitionInTimeline } from './TransitionController';
import classNames from 'classnames';
import styles from './GamePlayController.module.scss';
import { useGamePlayController, useFlags } from './GamePlayController.hooks';

export interface GamePlayControllerProps
  extends React.HTMLProps<HTMLDivElement> {
  rockLabel: string;
  paperLabel: string;
  scissorsLabel: string;
  versusLabel: string;
}

export type GamePlayControllerRefs = {
  element: HTMLDivElement;
};

type labelSelector = 'rockLabel' | 'paperLabel' | 'scissorsLabel';

const GamePlayController: React.ForwardRefExoticComponent<
  GamePlayControllerProps & React.RefAttributes<HTMLDivElement>
> = forwardRef(function GamePlayController(
  { versusLabel, ...otherProps },
  forwardRef
) {
  const refs = useRefs<GamePlayControllerRefs>();

  useImperativeHandle(forwardRef, () => refs.element.current!);

  const transitionController = useTransitionController<GamePlayControllerRefs>({
    ref: refs.element,
    refs,
    setupTransitionInTimeline,
  });

  const { computerPositionValue, playerPositionValue } =
    useGamePlayController(transitionController);

  const { gamePlayScreenIsHidden } = useFlags();

  return (
    <div
      className={classNames(
        styles.element,
        gamePlayScreenIsHidden && styles.isHidden
      )}
      ref={refs.element}
    >
      <div className={classNames('heading-01', styles.positionValue)}>
        {otherProps[`${computerPositionValue}Label` as labelSelector]}
      </div>
      <div className={classNames('heading-02', styles.versusLabel)}>
        {versusLabel}
      </div>
      <div className={classNames('heading-01', styles.positionValue)}>
        {otherProps[`${playerPositionValue}Label` as labelSelector]}
      </div>
    </div>
  );
});

export default GamePlayController;
