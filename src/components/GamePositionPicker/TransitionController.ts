import { GamePositionPickerRefs } from './GamePositionPicker';
import { SetupTransitionTimeline } from '../../hooks/TransitionController';
import { bounceIn } from '@/animation/bounce';
import { gsap } from 'gsap';

export const setupTransitionInTimeline: SetupTransitionTimeline<
  GamePositionPickerRefs
> = (refs, timeline, { getElementTimeline }) => {
  const { element, kicker, betButtons } = refs;

  timeline.set(element, { autoAlpha: 1 });
  timeline.add(bounceIn(kicker));

  betButtons.forEach((betButton) => {
    const betButtonTimeline = getElementTimeline(betButton);

    if (betButtonTimeline) {
      timeline.add(betButtonTimeline, '<0.1');
    }
  });
};

export const kickerToggleTransition = (
  kicker: HTMLDivElement,
  isTransitioningIn = true
): void => {
  const kickerToggleTimeline = gsap.timeline();
  const duration = isTransitioningIn ? 0.3 : 0.25;
  const ease = isTransitioningIn ? 'power1.out' : 'power1.in';

  kickerToggleTimeline.to(kicker, {
    opacity: isTransitioningIn ? 1 : 0,
    ease,
    duration,
  });
  kickerToggleTimeline.to(
    kicker,
    {
      y: isTransitioningIn ? 0 : 10,
      ease,
      duration,
    },
    0
  );
};
