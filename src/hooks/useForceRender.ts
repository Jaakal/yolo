import { useCallback, useState } from 'react';

type ForceRender = () => () => void;

export const useForceRender: ForceRender = () => {
  const [_, setCounter] = useState(0);

  const forceRender = useCallback(() => {
    setCounter((counter: number) => (counter % Number.MAX_SAFE_INTEGER) + 1);
  }, []);

  return forceRender;
};
