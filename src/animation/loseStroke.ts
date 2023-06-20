import { gsap } from 'gsap';
import { TransitionStepIndexes } from './stroke';

const findTransitionStepIndexes = (
  charactersCount: number
): TransitionStepIndexes => {
  const characterIndexes = [...Array(charactersCount)].map((_, index) => index);
  const transitionStepIndexes: TransitionStepIndexes = [];

  transitionStepIndexes.push({
    highlightedCharacterIndexes: [0],
    strokeCharacterIndexes: [...characterIndexes.slice(1)],
  });

  for (let index = 1; index < characterIndexes.length; index += 1) {
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

  return transitionStepIndexes;
};

export const loseStroke = (
  elements: Array<HTMLElement>,
  className: string,
  duration = 0.5
): gsap.core.Timeline => {
  const transitionStepIndexes = findTransitionStepIndexes(elements.length);
  const stepCount = elements.length - 1;
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
