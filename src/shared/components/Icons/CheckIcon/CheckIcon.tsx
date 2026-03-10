import * as React from 'react'
import type { IconProps } from '../types/types';
import styles from './CheckIcon.module.scss'
import classNames from 'classnames';

const CheckIcon: React.FC<IconProps> = ({ color, className, width = 24, height = 24, ...rest }) => {
    return (
    <svg className={classNames(styles.checkIcon, className, color && styles[color])} {...rest} width={width} height={height} viewBox={`0 0 24 24`} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 11.6129L9.87755 18L20 7" stroke="black" strokeWidth="2" />
    </svg>
    )
}

export default CheckIcon;