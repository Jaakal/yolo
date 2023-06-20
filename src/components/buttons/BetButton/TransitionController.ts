import { BetButtonRefs } from './BetButton';
import { SetupTransitionTimeline } from '../../../hooks/TransitionController';
import { softElastic } from '@/animation/eases';

export const setupTransitionInTimeline: SetupTransitionTimeline<
  BetButtonRefs
> = (refs, timeline, { getElementTimeline }) => {
  const { element } = refs;
  const duration = 0.5;

  timeline.fromTo(element, { autoAlpha: 0 }, { autoAlpha: 1, duration });
  timeline.fromTo(
    element,
    { scale: 0.5 },
    { scale: 1, duration, ease: softElastic },
    0
  );
};
