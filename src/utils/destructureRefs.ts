import { RefObject } from 'react';

export type RefObjects<T extends {}> = {
  [K in keyof T]: React.RefObject<T[K]>;
};

export const destructureRefObject = <T extends unknown>(
  ref: React.RefObject<T>
) => ref.current;

export const destructureRefObjects = <T extends {}>(refs: RefObjects<T>): T => {
  return Object.keys(refs).reduce((destructuredRefs, key) => {
    destructuredRefs[key as keyof T] = destructureRefObject(
      refs[key as keyof T]
    )!;
    return destructuredRefs;
  }, {} as T);
};
