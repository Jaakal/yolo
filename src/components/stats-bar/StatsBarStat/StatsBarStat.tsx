'use client';

import { forwardRef, useImperativeHandle } from 'react';
import { useRefs } from '../../../hooks/useRefs';
import { useTransitionController } from '../../../hooks/TransitionController';
import { setupTransitionInTimeline } from './TransitionController';
import { StatsBarStats } from '@/data/enums/StatsBarStats';
import StatsBarStatCounter from '../StatsBarStatCounter/StatsBarStatCounter';
import styles from './StatsBarStat.module.scss';
import classNames from 'classnames';

export interface StatsBarStatProps extends React.HTMLProps<HTMLDivElement> {
  stat: StatsBarStats;
  label: string;
}

export type StatsBarStatRefs = {
  element: HTMLDivElement;
  label: HTMLDivElement;
  counter: HTMLDivElement;
};

const StatsBarStat: React.ForwardRefExoticComponent<
  StatsBarStatProps & React.RefAttributes<HTMLDivElement>
> = forwardRef(function StatsBarStat({ className, stat, label }, forwardRef) {
  const refs = useRefs<StatsBarStatRefs>();

  useImperativeHandle(forwardRef, () => refs.element.current!);

  useTransitionController<StatsBarStatRefs>({
    ref: refs.element,
    refs,
    setupTransitionInTimeline,
    exposeTransitionController: true,
  });

  return (
    <div
      className={classNames('copy-02', styles.element, className)}
      ref={refs.element}
    >
      <div
        className={styles.label}
        ref={refs.label}
      >{`${label}:`}</div>
      <StatsBarStatCounter
        className={styles.counter}
        stat={stat}
        ref={refs.counter}
      />
    </div>
  );
});

export default StatsBarStat;
