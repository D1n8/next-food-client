import React from 'react';
import styles from './Button.module.scss';
import classNames from 'classnames';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    loading?: boolean;
    children?: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({
    className,
    loading,
    children,
    disabled,
    type = 'button',
    ...props
}) => {
    return (
        <button
            type={type}
            className={classNames(styles.btn, className)}
            disabled={disabled || loading}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;