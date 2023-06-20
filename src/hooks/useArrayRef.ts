import { useRef, useCallback } from 'react';

export const useArrayRef = <T extends unknown>(): [
  React.RefObject<Array<T>>,
  (element: T) => () => void
] => {
  const refsArray = useRef<Array<T>>([]);

  const addToRefs = useCallback((element: T): (() => void) => {
    refsArray.current.push(element);

    return () => {
      refsArray.current.splice(refsArray.current.indexOf(element), 1);
    };
  }, []);

  return [refsArray, addToRefs];
};
