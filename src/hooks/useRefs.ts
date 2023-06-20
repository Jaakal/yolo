import { useRef, createRef } from 'react';
import { RefObjects } from '../utils/destructureRefs';

type IsEmptyType<Obj extends Record<PropertyKey, unknown>> = [
  keyof Obj
] extends [never]
  ? true
  : false;

type ArrayRefs<T> = {
  [key in keyof T as Extract<
    key,
    T[key] extends Array<any> ? key : never
  >]: T[key];
};

type RefObjectOfArrayRefs<T> = {
  [K in keyof T]: React.RefObject<T[K]>;
};

export const useRefs = <T extends {}>(
  ...args: IsEmptyType<ArrayRefs<T>> extends true
    ? []
    : [RefObjectOfArrayRefs<ArrayRefs<T>>]
): RefObjects<T> => {
  const refObjects = useRef<RefObjects<T>>(
    new Proxy((args[0] ? { ...args[0] } : {}) as RefObjects<T>, {
      get<K extends keyof T>(target: RefObjects<T>, property: string | symbol) {
        if (!target[property as K]) {
          target[property as K] = createRef<T[K]>() as React.RefObject<T[K]>;
        }

        return target[property as K];
      },
    })
  );

  return refObjects.current as RefObjects<T>;
};
