'use client';

import { forwardRef, useImperativeHandle, useRef } from 'react';
import { useRefs } from '../../../hooks/useRefs';
import { useTransitionController } from '../../../hooks/TransitionController';
import { setupTransitionInTimeline } from './TransitionController';
import StatsBarStat from '../StatsBarStat/StatsBarStat';
import { StatsBarStats } from '@/data/enums/StatsBarStats';
import { createElementArrayKeys } from '@/utils/createElementArrayKeys';
import { useArrayRef } from '@/hooks/useArrayRef';
import styles from './StatsBar.module.scss';
import classNames from 'classnames';

export interface StatsBarProps extends React.HTMLProps<HTMLDivElement> {
  playerBalanceLabel: string;
  playerLastRoundBet: string;
  playerLastRoundWin: string;
}

export type StatsBarRefs = {
  element: HTMLDivElement;
  stats: Array<HTMLDivElement>;
};

const StatsBar: React.ForwardRefExoticComponent<
  StatsBarProps & React.RefAttributes<HTMLDivElement>
> = forwardRef(function StatsBar(
  { className, playerBalanceLabel, playerLastRoundBet, playerLastRoundWin },
  forwardRef
) {
  const [stats, addStatRef] = useArrayRef<HTMLDivElement>();
  const refs = useRefs<StatsBarRefs>({ stats });
  const statsBarStatsData = useRef<
    Array<{ stat: StatsBarStats; label: string }>
  >([
    { stat: StatsBarStats.PlayerBalance, label: playerBalanceLabel },
    { stat: StatsBarStats.PlayerLastRoundBet, label: playerLastRoundBet },
    { stat: StatsBarStats.PlayerLastRoundWin, label: playerLastRoundWin },
  ]);
  const statsBarStatsKeys = useRef<Array<string>>(
    createElementArrayKeys(statsBarStatsData.current.length)
  );

  useImperativeHandle(forwardRef, () => refs.element.current!);

  useTransitionController<StatsBarRefs>({
    ref: refs.element,
    refs,
    setupTransitionInTimeline,
    exposeTransitionController: true,
  });

  return (
    <div
      className={classNames(styles.element, className)}
      ref={refs.element}
    >
      {statsBarStatsData.current.map(({ stat, label }, index) => (
        <StatsBarStat
          className={styles.statsBarStat}
          stat={stat}
          label={label}
          ref={addStatRef}
          key={statsBarStatsKeys.current[index]}
        />
      ))}
    </div>
  );
});

export default StatsBar;
