import { GameNavigationRefs } from './GameNavigation';
import { SetupTransitionTimeline } from '../../hooks/TransitionController';

export const setupTransitionInTimeline: SetupTransitionTimeline<
  GameNavigationRefs
> = (refs, timeline, { getElementTimeline }) => {
  const { playCta } = refs;

  const playCtaTimeline = getElementTimeline(playCta);
  if (playCtaTimeline) {
    timeline.add(playCtaTimeline);
  }
};
