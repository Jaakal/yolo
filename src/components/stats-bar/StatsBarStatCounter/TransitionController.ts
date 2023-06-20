import { StatsBarStatCounterRefs } from './StatsBarStatCounter';
import { SetupTransitionTimeline } from '../../../hooks/TransitionController';
import { TransitionControllerProps } from './StatsBarStatCounter';
import { fadeFromTo } from '@/animation/fade';
import { countTo } from '@/animation/counter';

export const setupTransitionInTimeline: SetupTransitionTimeline<
  StatsBarStatCounterRefs,
  TransitionControllerProps
> = (
  refs,
  timeline,
  { getElementTimeline },
  { startValue, targetValue, setStatValue }
) => {
  const { element } = refs;

  timeline.add(fadeFromTo(element, 0.15));
  timeline.add(countTo(startValue, targetValue, setStatValue));
};

export const counterTransition = (
  startValue: number,
  targetValue: number,
  setStatValue: React.Dispatch<React.SetStateAction<number>>
) => {
  countTo(startValue, targetValue, setStatValue);
};
