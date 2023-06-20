import { StatsBarStatRefs } from './StatsBarStat';
import { SetupTransitionTimeline } from '../../../hooks/TransitionController';
import { fadeFromTo } from '@/animation/fade';

export const setupTransitionInTimeline: SetupTransitionTimeline<
  StatsBarStatRefs
> = (refs, timeline, { getElementTimeline }) => {
  const { label, counter } = refs;

  timeline.add(fadeFromTo(label, 0.15));

  const counterTimeline = getElementTimeline(counter);

  if (counterTimeline) {
    timeline.add(counterTimeline, 0);
  }
};
