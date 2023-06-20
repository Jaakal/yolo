import { forwardRef } from 'react';
import classNames from 'classnames';
import styles from './Button.module.scss';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  disableFocus?: boolean;
}

const Button: React.ForwardRefExoticComponent<
  ButtonProps & React.RefAttributes<HTMLButtonElement>
> = forwardRef(
  ({ className, children, disableFocus, ...otherProps }, forwardRef) => {
    return (
      <button
        className={classNames(styles.button, className)}
        tabIndex={disableFocus ? -1 : undefined}
        {...(otherProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        ref={forwardRef}
      >
        {children}
      </button>
    );
  }
);

export default Button;
