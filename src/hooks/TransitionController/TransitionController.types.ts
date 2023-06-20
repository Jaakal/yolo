import { RefObject } from 'react';
import gsap from 'gsap';

export enum TransitionDirection {
  In = 'in',
  Out = 'out',
}

export type RefObjects<T> = {
  [Property in keyof T]: RefObject<T[Property]>;
};

export type GetElementTimeline = (
  element: Element,
  transitionDirection?: TransitionDirection
) => gsap.core.Timeline | undefined;

export type TransitionControllerHelpers = {
  getElementTimeline: GetElementTimeline;
};

export type SetupTransitionTimeline<T, U = undefined> = (
  refs: T,
  timeline: gsap.core.Timeline,
  transitionControllerHelpers: TransitionControllerHelpers,
  transitionControllerProps: U extends undefined ? never : U
) => void;

export type TransitionControllerParameters<T, U> = {
  ref: RefObject<Element>;
  refs: RefObjects<T>;
  setupTransitionInTimeline: SetupTransitionTimeline<T, U>;
  setupTransitionOutTimeline?: SetupTransitionTimeline<T, U>;
  exposeTransitionController?: boolean;
} & (U extends undefined
  ? { transitionControllerProps?: U }
  : { transitionControllerProps: U });

export type TransitionFunction = (timeScale?: number) => gsap.core.Timeline;

export type TransitionController = {
  transitionIn: TransitionFunction;
  transitionOut: TransitionFunction;
};

export type SetElementTransitionController = (
  element: Element,
  transitionController: TransitionController
) => void;

export type DeleteElementTransitionController = (element: Element) => void;

export type TransitionControllerStore = {
  setElementTransitionController: SetElementTransitionController;
  getElementTimeline: GetElementTimeline;
  deleteElementTransitionController: DeleteElementTransitionController;
};
