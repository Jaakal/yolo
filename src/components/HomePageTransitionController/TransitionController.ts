import { HomePageTransitionControllerRefs } from './HomePageTransitionController';
import { SetupTransitionTimeline } from '../../hooks/TransitionController';
import { vinnieInOut } from '@/animation/eases';

export const setupTransitionInTimeline: SetupTransitionTimeline<
  HomePageTransitionControllerRefs
> = (refs, timeline, { getElementTimeline }) => {
  const {
    element,
    backgroundWrapper,
    statsBar,
    gamePositionPicker,
    gameNavigation,
  } = refs;

  timeline.set(element, { autoAlpha: 1 });
  timeline.fromTo(
    backgroundWrapper,
    { yPercent: -200 },
    { yPercent: 0, clearProps: 'all', ease: vinnieInOut }
  );

  const statsBarTimeline = getElementTimeline(statsBar);
  if (statsBarTimeline) {
    timeline.add(statsBarTimeline, 0.25);
  }

  const gamePositionPickerTimeline = getElementTimeline(gamePositionPicker);
  if (gamePositionPickerTimeline) {
    timeline.add(gamePositionPickerTimeline, 0.45);
  }

  const gameNavigationTimeline = getElementTimeline(gameNavigation);
  if (gameNavigationTimeline) {
    timeline.add(gameNavigationTimeline, 0.75);
  }
};
