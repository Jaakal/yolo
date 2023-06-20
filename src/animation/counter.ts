import { gsap } from 'gsap';

type CountToOptions = {
  minValue: number;
  maxValue: number;
  minDuration: number;
  maxDuration: number;
};

const defaultCountToOptions: CountToOptions = {
  minValue: 500,
  maxValue: 5000,
  minDuration: 0.5,
  maxDuration: 1,
};

export const countTo = (
  startValue: number,
  targetValue: number,
  setStatValue: React.Dispatch<React.SetStateAction<number>>,
  staticDuration?: number,
  options?: CountToOptions
): gsap.core.Tween => {
  const { minValue, maxValue, minDuration, maxDuration } = {
    ...defaultCountToOptions,
    ...options,
  };

  const delta = targetValue - startValue;

  if (delta === 0) {
    return gsap.to({}, { duration: 0 });
  }

  let duration = staticDuration;

  if (duration === undefined) {
    /**
     * Tweaking the speed of the counter taking into account range from
     * 500 - 5000 and remapping it to 0.5 - 1 seconds in duration
     */
    const clampedDelta = gsap.utils.clamp(minValue, maxValue, delta);
    duration = gsap.utils.mapRange(
      minValue,
      maxValue,
      minDuration,
      maxDuration,
      clampedDelta
    );
  }

  const currentStatValue = {
    value: startValue,
  };

  return gsap.to(currentStatValue, {
    value: targetValue,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      setStatValue(Math.ceil(currentStatValue.value));
    },
  });
};
