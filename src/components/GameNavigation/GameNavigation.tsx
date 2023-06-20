'use client';

import { forwardRef, useImperativeHandle } from 'react';
import { useRefs } from '../../hooks/useRefs';
import { useTransitionController } from '../../hooks/TransitionController';
import { setupTransitionInTimeline } from './TransitionController';
import PrimaryButton from '@/components/buttons/PrimaryButton/PrimaryButton';
import { useFlags, useMainCtaClickHandler } from './GameNavigation.hooks';
import styles from './GameNavigation.module.scss';

export interface GameNavigationProps extends React.HTMLProps<HTMLDivElement> {
  playCtaPrimaryLabel: string;
  playCtaSecondaryLabel: string;
}

export type GameNavigationRefs = {
  element: HTMLDivElement;
  playCta: HTMLButtonElement;
};

export type GameNavigationRefObjects = {
  [key in keyof GameNavigationRefs]: React.RefObject<GameNavigationRefs[key]>;
};

const GameNavigation: React.ForwardRefExoticComponent<
  GameNavigationProps & React.RefAttributes<HTMLDivElement>
> = forwardRef(({ playCtaPrimaryLabel, playCtaSecondaryLabel }, forwardRef) => {
  const refs = useRefs<GameNavigationRefs>();

  useImperativeHandle(forwardRef, () => refs.element.current!);

  useTransitionController<GameNavigationRefs>({
    ref: refs.element,
    refs,
    setupTransitionInTimeline,
    exposeTransitionController: true,
  });

  const onMainCtaClick = useMainCtaClickHandler();
  const { isResultScreenVisible, noOpenPositions, isOnAutoMode } = useFlags();

  return (
    <div
      className={styles.element}
      ref={refs.element}
    >
      <PrimaryButton
        splitLabel={
          isResultScreenVisible ? playCtaSecondaryLabel : playCtaPrimaryLabel
        }
        onClick={onMainCtaClick}
        disabled={noOpenPositions || isOnAutoMode}
        ref={refs.playCta}
      />
    </div>
  );
});

export default GameNavigation;
