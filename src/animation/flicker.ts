import gsap from 'gsap';
import { shuffleArray } from '@/utils/array';

const flickerPoints = [
  {
    percentage: 10,
    opacity: 0.3,
  },
  {
    percentage: 15,
    opacity: 0.1,
  },
  {
    percentage: 25,
    opacity: 0.7,
  },
  {
    percentage: 30,
    opacity: 0.3,
  },
  {
    percentage: 50,
    opacity: 0,
  },
  {
    percentage: 60,
    opacity: 0.6,
  },
  {
    percentage: 80,
    opacity: 0.4,
  },
  {
    percentage: 100,
    opacity: 1,
  },
];

const createSingleElementFlickerTimeline = (
  element: HTMLElement,
  duration: number
): gsap.core.Timeline => {
  const timeline = gsap.timeline();

  gsap.set(element, { opacity: 0 });

  flickerPoints.forEach(({ percentage, opacity }, index) => {
    const stepDuration =
      ((percentage - (flickerPoints[index - 1]?.percentage ?? 0)) / 100) *
      duration;

    timeline.add(
      gsap.to(element, {
        opacity,
        duration: stepDuration,
        ease: 'none',
      })
    );
  });

  return timeline;
};

export const flickerIn = (
  elements: Array<HTMLElement>,
  duration = 3,
  stagger = 0.03
): gsap.core.Timeline => {
  const singleElementDuration = duration - (elements.length - 1) * stagger;
  const timeline = gsap.timeline();
  const shuffledElements = shuffleArray(elements);

  shuffledElements.forEach((element, index) => {
    const singleElementTimeline = createSingleElementFlickerTimeline(
      element,
      singleElementDuration
    );
    timeline.add(singleElementTimeline, index * stagger);
  });

  return timeline;
};
