import { gsap } from 'gsap';
import { softElastic } from './eases';

export const bounceIn = (
  element: HTMLElement,
  duration = 0.5
): gsap.core.Timeline => {
  const timeline = gsap.timeline();

  timeline.fromTo(element, { autoAlpha: 0 }, { autoAlpha: 1, duration });
  timeline.fromTo(
    element,
    { scale: 0.5 },
    { scale: 1, duration, ease: softElastic },
    0
  );

  return timeline;
};

export const bounceInCustom = (
  element: HTMLElement,
  scale = 1.12,
  duration = 0.15
) => {
  const timeline = gsap.timeline();

  timeline.fromTo(
    element,
    { scale: 0.5, autoAlpha: 0 },
    { scale, autoAlpha: 1, duration: 0.4 * duration }
  );
  timeline.to(element, { scale: 1, duration: 0.6 * duration });

  return timeline;
};
