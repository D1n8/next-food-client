import React from 'react';
import styles from './CheckBox.module.scss'
import CheckIcon from '@components/Icons/CheckIcon';
import classNames from 'classnames';

export type CheckBoxProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange'
> & {
  /** Вызывается при клике на чекбокс */
  onChange: (checked: boolean) => void;
};

const CheckBox: React.FC<CheckBoxProps> = ({ 
  checked, 
  onChange, 
  disabled, 
  className,
  ...rest 
}) => {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return
    onChange(e.target.checked)
  }

  return (
   <label className={classNames(styles.checkboxContainer, disabled && styles.disabled)}>
      <input
        {...rest}
        type="checkbox"
        className={classNames(styles.checkboxInput, checked && styles.checked, className)}
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
      />
      
      {checked && (
        <CheckIcon 
            width={24} 
            height={24} 
            color={disabled ? 'secondary' : 'primary'}
            className={styles.checkboxIcon}
        />
      )}
    </label>
  );
};

export default CheckBox;