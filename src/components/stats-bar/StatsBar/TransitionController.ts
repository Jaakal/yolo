import { StatsBarRefs } from './StatsBar';
import { SetupTransitionTimeline } from '../../../hooks/TransitionController';
import { vinnieInOut } from '@/animation/eases';

export const setupTransitionInTimeline: SetupTransitionTimeline<
  StatsBarRefs
> = (refs, timeline, { getElementTimeline }) => {
  const { element, stats } = refs;

  timeline.set(element, { autoAlpha: 1 });
  timeline.fromTo(
    element,
    { yPercent: -100 },
    { yPercent: 0, duration: 1, ease: vinnieInOut }
  );

  stats.forEach((stat, index) => {
    const statTimeline = getElementTimeline(stat);

    if (statTimeline) {
      timeline.add(statTimeline, `<${index === 0 ? 0.3 : 0.05}`);
    }
  });
};
