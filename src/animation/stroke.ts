import { gsap } from 'gsap';

export type TransitionStepIndexes = Array<{
  highlightedCharacterIndexes: Array<number>;
  strokeCharacterIndexes: Array<number>;
}>;

const findTransitionStepIndexes = (
  rounds: number,
  highlightLength: number,
  charactersCount: number,
  flashes: number,
  flashStateFrameCount: number
): TransitionStepIndexes => {
  const characterIndexes = [...Array(charactersCount)].map((_, index) => index);
  const elementIndexWrapper = gsap.utils.wrap(characterIndexes);
  const transitionStepIndexes: TransitionStepIndexes = [];

  for (
    let lastCharacterIndex = -1;
    lastCharacterIndex < charactersCount * rounds;
    lastCharacterIndex += 1
  ) {
    const highlightedCharacterIndexes = [...Array(highlightLength)].map(
      (_, index) => elementIndexWrapper(Math.max(0, lastCharacterIndex - index))
    );
    const strokeCharacterIndexes = characterIndexes.filter(
      (characterIndex) => !highlightedCharacterIndexes.includes(characterIndex)
    );
    transitionStepIndexes.push({
      highlightedCharacterIndexes,
      strokeCharacterIndexes,
    });
  }

  for (
    let index = charactersCount - highlightLength - 1;
    index >= 0;
    index -= 1
  ) {
    const highlightedCharacterIndexes = [
      ...transitionStepIndexes[transitionStepIndexes.length - 1]
        .highlightedCharacterIndexes,
    ];
    highlightedCharacterIndexes.push(index);
    const strokeCharacterIndexes = characterIndexes.filter(
      (characterIndex) => !highlightedCharacterIndexes.includes(characterIndex)
    );
    transitionStepIndexes.push({
      highlightedCharacterIndexes,
      strokeCharacterIndexes,
    });
  }

  for (let flashIndex = 0; flashIndex < flashes; flashIndex += 1) {
    for (
      let flashStateFrameIndex = 0;
      flashStateFrameIndex < flashStateFrameCount;
      flashStateFrameIndex += 1
    ) {
      transitionStepIndexes.push({
        highlightedCharacterIndexes: [],
        strokeCharacterIndexes: [...characterIndexes],
      });
    }
    for (
      let flashStateFrameIndex = 0;
      flashStateFrameIndex < flashStateFrameCount;
      flashStateFrameIndex += 1
    ) {
      transitionStepIndexes.push({
        highlightedCharacterIndexes: [...characterIndexes],
        strokeCharacterIndexes: [],
      });
    }
  }

  return transitionStepIndexes;
};

export const stroke = (
  elements: Array<HTMLElement>,
  highlightLength: number,
  className: string,
  rounds = 2,
  flashes = 2,
  duration = 0.7
): gsap.core.Timeline => {
  const flashStateFrameCount = 5;
  const flashStateCount = 2;
  const flashesFrameCount = flashes * flashStateCount * flashStateFrameCount;
  const transitionStepIndexes = findTransitionStepIndexes(
    rounds,
    highlightLength,
    elements.length,
    flashes,
    flashStateFrameCount
  );
  const stepCount =
    elements.length * rounds +
    elements.length -
    highlightLength +
    flashesFrameCount;
  const currentStep = {
    value: 0,
  };
  const timeline = gsap.timeline();

  timeline.to(currentStep, {
    value: stepCount,
    duration,
    ease: `steps(${stepCount})`,
    onUpdate: () => {
      const { highlightedCharacterIndexes, strokeCharacterIndexes } =
        transitionStepIndexes[currentStep.value];

      if (highlightedCharacterIndexes.length) {
        const highlightedElements = Array(highlightedCharacterIndexes.length);

        for (let index = 0; index < highlightedElements.length; index += 1) {
          highlightedElements[index] =
            elements[highlightedCharacterIndexes[index]];
        }

        gsap.set(highlightedElements, { className: `-${className}` });
      }

      if (strokeCharacterIndexes.length) {
        const strokeElements = Array(strokeCharacterIndexes.length);

        for (let index = 0; index < strokeElements.length; index += 1) {
          strokeElements[index] = elements[strokeCharacterIndexes[index]];
        }

        gsap.set(strokeElements, { className });
      }
    },
  });

  return timeline;
};
