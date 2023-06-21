'use client';

import { forwardRef, useImperativeHandle, useState } from 'react';
import { useUpdateEffect } from 'react-use';
import { useRefs } from '../../../hooks/useRefs';
import { useTransitionController } from '../../../hooks/TransitionController';
import {
  setupTransitionInTimeline,
  counterTransition,
} from './TransitionController';
import { StatsBarStats } from '@/data/enums/StatsBarStats';
import { useStore } from '@/store/useStore';
import styles from './StatsBarStatCounter.module.scss';
import classNames from 'classnames';

export interface StatsBarStatCounterProps
  extends React.HTMLProps<HTMLDivElement> {
  stat: StatsBarStats;
}

export type StatsBarStatCounterRefs = {
  element: HTMLDivElement;
};

export type TransitionControllerProps = {
  startValue: number;
  targetValue: number;
  setStatValue: React.Dispatch<React.SetStateAction<number>>;
};

const StatsBarStatCounter: React.ForwardRefExoticComponent<
  StatsBarStatCounterProps & React.RefAttributes<HTMLDivElement>
> = forwardRef(function StatsBarStatCounter({ className, stat }, forwardRef) {
  const refs = useRefs<StatsBarStatCounterRefs>();
  const [statValue, setStatValue] = useState<number>(0);
  const targetValue = useStore((state) => state[stat]);

  useImperativeHandle(forwardRef, () => refs.element.current!);

  useTransitionController<StatsBarStatCounterRefs, TransitionControllerProps>({
    ref: refs.element,
    refs,
    setupTransitionInTimeline,
    exposeTransitionController: true,
    transitionControllerProps: {
      startValue: statValue,
      targetValue,
      setStatValue,
    },
  });

  useUpdateEffect(() => {
    counterTransition(statValue, targetValue, setStatValue);
  }, [targetValue]);

  return (
    <div
      className={classNames(
        styles.element,
        styles[`length-${targetValue.toString().length}`],
        className
      )}
      ref={refs.element}
    >
      {statValue}
    </div>
  );
});

export default StatsBarStatCounter;
