'use client';

import { forwardRef, useImperativeHandle, useRef } from 'react';
import { useRefs } from '../../../hooks/useRefs';
import { useTransitionController } from '../../../hooks/TransitionController';
import { setupTransitionInTimeline } from './TransitionController';
import Button from '../Button/Button';
import styles from './PrimaryButton.module.scss';
import classNames from 'classnames';
import {
  usePrimaryButtonClickHandler,
  useSplitLabel,
  useToggleDisabledState,
} from './PrimaryButton.hooks';
import { useArrayRef } from '@/hooks/useArrayRef';
import { createElementArrayKeys } from '@/utils/createElementArrayKeys';
import SplitLine from '@/components/type/SplitLine/SplitLine';

export interface PrimaryButtonProps extends React.HTMLProps<HTMLButtonElement> {
  splitLabel: string;
}

export type PrimaryButtonRefs = {
  element: HTMLButtonElement;
  backgrounds: Array<HTMLDivElement>;
  label: HTMLDivElement;
  chars: Array<HTMLSpanElement>;
};

export type PrimaryButtonRefObjects = {
  [key in keyof PrimaryButtonRefs]: React.RefObject<PrimaryButtonRefs[key]>;
};

const backgroundLayersCount = 3;

const PrimaryButton: React.ForwardRefExoticComponent<
  PrimaryButtonProps & React.RefAttributes<HTMLButtonElement>
> = forwardRef(function PrimaryButton(
  { className, splitLabel, disabled, onClick, ...otherProps },
  forwardRef
) {
  const [backgrounds, addBackgroundRef] = useArrayRef<HTMLDivElement>();
  const [chars, addCharRef] = useArrayRef<HTMLSpanElement>();
  const refs = useRefs<PrimaryButtonRefs>({ backgrounds, chars });
  const backgroundKeys = useRef<Array<string>>(
    createElementArrayKeys(backgroundLayersCount)
  );
  const labelCharacterKeys = useRef<Array<string>>(
    createElementArrayKeys(splitLabel.length)
  );

  useImperativeHandle(forwardRef, () => refs.element.current!);

  const currentSplitLabel = useSplitLabel(refs, splitLabel, labelCharacterKeys);

  useTransitionController<PrimaryButtonRefs>(
    {
      ref: refs.element,
      refs,
      setupTransitionInTimeline,
      exposeTransitionController: true,
    },
    [currentSplitLabel]
  );

  useToggleDisabledState(refs.element, disabled);

  const onPrimaryButtonClick = usePrimaryButtonClickHandler(
    refs.element,
    onClick
  );

  return (
    <Button
      className={classNames('copy-01', styles.element, className)}
      onClick={onPrimaryButtonClick}
      disabled={disabled}
      ref={refs.element}
      {...(otherProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {backgroundKeys.current.map((key, index) => (
        <div
          key={key}
          className={classNames(
            styles.background,
            styles[`background${index}`]
          )}
          ref={addBackgroundRef}
        />
      ))}
      <div
        className={styles.label}
        ref={refs.label}
      >
        <SplitLine
          copy={currentSplitLabel}
          copyCharacterKeys={labelCharacterKeys.current}
          addCharacterRef={addCharRef}
        />
      </div>
    </Button>
  );
});

export default PrimaryButton;
