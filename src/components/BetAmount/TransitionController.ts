import { BetAmountRefs } from './BetAmount';
import { SetupTransitionTimeline } from '../../hooks/TransitionController';
import { softElastic } from '@/animation/eases';
import { gsap } from 'gsap';
import { bounceInCustom } from '@/animation/bounce';

export const setupTransitionInTimeline: SetupTransitionTimeline<
  BetAmountRefs
> = (refs, timeline, { getElementTimeline }) => {
  const { element } = refs;
  timeline.add(bounceInCustom(element));
};

export const setupTransitionOutTimeline: SetupTransitionTimeline<
  BetAmountRefs
> = (refs, timeline, { getElementTimeline }) => {
  const { element, oldBet, newBet } = refs;

  timeline.to(element, {
    scale: 0.5,
    duration: 0.1,
  });
  timeline.to(
    element,
    {
      autoAlpha: 0,
      duration: 0.1,
      ease: 'power1.in',
      onComplete: () => {
        gsap.set(oldBet, { autoAlpha: 0 });
        gsap.set(newBet, { autoAlpha: 1 });
      },
    },
    0
  );
};

let increaseBetTimeline = gsap.timeline();

export const increaseBetTransition = (refs: BetAmountRefs) => {
  const { background, oldBet, newBet } = refs;

  increaseBetTimeline.kill();
  increaseBetTimeline = gsap.timeline();

  gsap.set(oldBet, { autoAlpha: 1 });

  increaseBetTimeline.to(background, {
    scale: 1.15,
    duration: 0.1,
  });
  increaseBetTimeline.to(background, {
    scale: 1,
    duration: 0.1,
  });
  increaseBetTimeline.to(
    oldBet,
    {
      autoAlpha: 0,
      scale: 1.2,
      duration: 0.1,
    },
    0
  );
  increaseBetTimeline.fromTo(
    newBet,
    { scale: 0.5, autoAlpha: 0 },
    { scale: 1, autoAlpha: 1, duration: 0.2, ease: softElastic },
    0.1
  );
};
