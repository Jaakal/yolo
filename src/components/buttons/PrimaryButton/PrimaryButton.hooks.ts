import { useCallback, useState, useEffect } from 'react';
import { useUpdateEffect } from 'react-use';
import { destructureRefObject } from '@/utils/destructureRefs';
import {
  onClickTransition,
  splitLabelInTransition,
  splitLabelOutTransition,
  isDisabledTransition,
} from './TransitionController';
import { PrimaryButtonRefObjects } from './PrimaryButton';
import { createElementArrayKeys } from '@/utils/createElementArrayKeys';
import { wait } from '@/utils/time';
import { useSoundManager } from '@/hooks/SoundManager/useSoundManager';
import { SampleName } from '@/hooks/SoundManager/SampleName';

export const usePrimaryButtonClickHandler = (
  element: React.RefObject<HTMLButtonElement | null>,
  onClick: React.MouseEventHandler<HTMLButtonElement> | undefined
): ((event: React.MouseEvent<HTMLButtonElement>) => void) => {
  const soundManager = useSoundManager();
  return useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      soundManager[SampleName.Click].play();
      onClick?.(event);
      onClickTransition(element.current!);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onClick]
  );
};

export const useSplitLabel = (
  refs: PrimaryButtonRefObjects,
  splitLabel: string,
  labelCharacterKeys: React.MutableRefObject<Array<string>>
): string => {
  const [currentSplitLabel, setCurrentSplitLabel] =
    useState<string>(splitLabel);

  useUpdateEffect(() => {
    const elements = destructureRefObject(refs.chars);
    splitLabelInTransition(elements!);
  }, [currentSplitLabel]);

  useUpdateEffect(() => {
    (async () => {
      const elements = destructureRefObject(refs.chars);
      await splitLabelOutTransition(elements!);
      labelCharacterKeys.current = createElementArrayKeys(splitLabel.length);
      setCurrentSplitLabel(splitLabel);
    })();
  }, [splitLabel]);

  return currentSplitLabel;
};

export const useToggleDisabledState = (
  elementRef: React.RefObject<HTMLButtonElement>,
  disabled: boolean | undefined
): void => {
  useEffect(() => {
    (async () => {
      await wait(0.04);
      const element = destructureRefObject(elementRef);
      isDisabledTransition(element!, Boolean(disabled));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled]);
};
