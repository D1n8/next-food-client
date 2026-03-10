import React from 'react';
import styles from './Input.module.scss'
import classNames from 'classnames';

export type InputProps = Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'value'
> & {
    value: string;
    onChange: (value: string) => void;
    afterSlot?: React.ReactNode;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (props, ref) => {
        const { value, onChange, afterSlot, className, ...rest } = props;

        return (
            <div className={classNames(styles.inputContainer, className)}>
                <input
                    name='input'
                    ref={ref}
                    type='text'
                    className={styles.input}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder='Текст'
                    {...rest} />
                {afterSlot && <div className={styles.inputIcon}>{afterSlot}</div>}
            </div>)
    });

export default Input;