import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { destructureRefObjects } from '../../utils/destructureRefs';
import { useTransitionControllerStore } from './useTransitionControllerStore';
import {
  TransitionControllerParameters,
  TransitionController,
} from './TransitionController.types';

export const useTransitionController = <T extends {}, U = undefined>(
  {
    ref,
    refs,
    setupTransitionInTimeline,
    setupTransitionOutTimeline,
    exposeTransitionController = false,
    transitionControllerProps,
  }: TransitionControllerParameters<T, U>,
  dependencies?: React.DependencyList
): TransitionController => {
  const elements = useRef<T>();
  const transitionInTimeline = useRef<gsap.core.Timeline>(gsap.timeline());
  const transitionOutTimeline = useRef<gsap.core.Timeline | null>(null);
  const transitionInTimelineProgress = useRef<number>(0);
  const {
    setElementTransitionController,
    getElementTimeline,
    deleteElementTransitionController,
  } = useTransitionControllerStore();

  const transitionController = useRef<TransitionController>({
    transitionIn: () => {
      transitionOutTimeline.current?.kill();

      return transitionInTimeline.current.tweenTo(
        transitionInTimeline.current.duration()
      ) as unknown as gsap.core.Timeline;
    },
    transitionOut: (timeScale = 1.4) => {
      if (setupTransitionOutTimeline) {
        transitionOutTimeline.current?.kill();
        transitionOutTimeline.current = gsap.timeline();

        setupTransitionOutTimeline(
          elements.current!,
          transitionOutTimeline.current,
          {
            getElementTimeline,
          },
          transitionControllerProps as U extends undefined ? never : U
        );

        transitionInTimeline.current.progress(0);

        return transitionOutTimeline.current;
      }

      const transitionInIsNotUsed =
        transitionInTimeline.current.progress() === 0;
      const transitionOutTween = transitionInIsNotUsed
        ? transitionInTimeline.current.tweenFromTo(
            transitionInTimeline.current.duration(),
            0
          )
        : transitionInTimeline.current.tweenTo(0);
      transitionOutTween.timeScale(timeScale);
      return transitionOutTween as unknown as gsap.core.Timeline;
    },
  });

  useEffect(() => {
    elements.current = destructureRefObjects<T>(refs);

    setupTransitionInTimeline(
      elements.current!,
      transitionInTimeline.current,
      {
        getElementTimeline,
      },
      transitionControllerProps as U extends undefined ? never : U
    );

    transitionInTimeline.current.progress(transitionInTimelineProgress.current);
    transitionInTimelineProgress.current = 0;
    transitionInTimeline.current.pause();

    if (exposeTransitionController) {
      setElementTransitionController(
        ref.current!,
        transitionController.current
      );
    }

    return () => {
      deleteElementTransitionController(ref.current!);
      transitionInTimelineProgress.current =
        transitionInTimeline.current.progress();
      transitionInTimeline.current.clear();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    ...(dependencies ?? []),
    exposeTransitionController,
    ref,
    refs,
    setElementTransitionController,
    deleteElementTransitionController,
  ]);

  return transitionController.current;
};
