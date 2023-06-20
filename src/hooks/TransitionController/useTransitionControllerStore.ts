import { useCallback } from 'react';
import {
  TransitionDirection,
  TransitionController,
  TransitionControllerStore,
} from './TransitionController.types';

const transitionControllerStore = new Map<Element, TransitionController>();

export const useTransitionControllerStore = (): TransitionControllerStore => {
  const setElementTransitionController = useCallback(
    (element: Element, transitionController: TransitionController) => {
      transitionControllerStore.set(element, transitionController);
    },
    []
  );

  const getElementTimeline = useCallback(
    (
      element: Element,
      transitionDirection = TransitionDirection.In
    ): gsap.core.Timeline | undefined => {
      if (transitionDirection === TransitionDirection.In) {
        return transitionControllerStore.get(element)?.transitionIn?.();
      }

      return transitionControllerStore.get(element)?.transitionOut?.();
    },
    []
  );

  const deleteElementTransitionController = useCallback((element: Element) => {
    transitionControllerStore.delete(element);
  }, []);

  return {
    setElementTransitionController,
    getElementTimeline,
    deleteElementTransitionController,
  };
};
