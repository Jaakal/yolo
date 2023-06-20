import { PrimaryButtonRefs } from './PrimaryButton';
import { SetupTransitionTimeline } from '../../../hooks/TransitionController';
import { gsap } from 'gsap';
import { flickerIn } from '@/animation/flicker';

export const setupTransitionInTimeline: SetupTransitionTimeline<
  PrimaryButtonRefs
> = (refs, timeline, { getElementTimeline }) => {
  const { element, backgrounds, chars } = refs;

  timeline.set(element, { autoAlpha: 1 });
  timeline.fromTo(
    backgrounds,
    { scale: 0 },
    { scale: 1, duration: 0.18, stagger: 0.12 }
  );
  timeline.add(flickerIn(chars, 0.5), '-=0.2');
};

export const onClickTransition = (element: HTMLButtonElement) => {
  const onClickTimeline = gsap.timeline();
  onClickTimeline.to(element, {
    scale: 0.95,
    duration: 0.06,
  });
  onClickTimeline.to(element, { scale: 1, duration: 0.09 });
};

export const splitLabelOutTransition = (
  elements: Array<HTMLSpanElement>
): gsap.core.Timeline => {
  const flickerTimeline = flickerIn(elements, 0.2);
  flickerTimeline.progress(1);
  flickerTimeline.reverse();
  return flickerTimeline;
};

export const splitLabelInTransition = (
  elements: Array<HTMLSpanElement>
): gsap.core.Timeline => {
  return flickerIn(elements, 0.3);
};

export const isDisabledTransition = (
  element: HTMLButtonElement,
  isDisabled: boolean
) => {
  gsap.to(element, {
    opacity: isDisabled ? 0.5 : 1,
    duration: 0.2,
    overwrite: 'auto',
  });
};
