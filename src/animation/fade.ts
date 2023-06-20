import { gsap } from 'gsap';

export const fadeFromTo = (
  element: HTMLElement,
  duration = 0.5
): gsap.core.Timeline => {
  const timeline = gsap.timeline();

  timeline.fromTo(
    element,
    { autoAlpha: 0 },
    { autoAlpha: 1, duration, ease: 'power1.in' }
  );

  return timeline;
};

export const fadeTo = (
  element: HTMLElement,
  duration = 0.35
): gsap.core.Timeline => {
  const timeline = gsap.timeline();

  timeline.to(element, { autoAlpha: 0, duration, ease: 'power1.in' });

  return timeline;
};

export const maskTo = (
  element: HTMLElement,
  duration = 0.5
): gsap.core.Timeline => {
  const timeline = gsap.timeline();

  timeline.fromTo(
    element,
    {
      maskImage:
        'linear-gradient(to right, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0%) 0%)',
    },
    {
      maskImage:
        'linear-gradient(to right, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0%) 100%)',
      ease: 'power1.in',
      duration: duration * 0.4,
    }
  );
  timeline.to(element, {
    maskImage:
      'linear-gradient(to right, rgb(0, 0, 0) 100%, rgba(0, 0, 0, 0%) 100%)',
    duration: duration * 0.6,
  });

  return timeline;
};
