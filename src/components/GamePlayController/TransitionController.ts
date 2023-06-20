import { GamePlayControllerRefs } from './GamePlayController';
import { SetupTransitionTimeline } from '../../hooks/TransitionController';

export const setupTransitionInTimeline: SetupTransitionTimeline<
  GamePlayControllerRefs
> = (refs, timeline, { getElementTimeline }) => {
  const { element } = refs;

  timeline.fromTo(element, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 });
};
