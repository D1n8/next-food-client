import React from 'react'
import styles from './Loader.module.scss'
import classNames from 'classnames';

export type LoaderProps = {
    size?: 's' | 'm' | 'l';
    className?: string;
    style?: React.CSSProperties;
};

const Loader: React.FC<LoaderProps> = ({ size, className, style }) => {
    return (
        <div className={classNames(styles.loaderContainer, size && styles[size], className && styles[className])}>
            <div className={classNames(styles.loader, size && styles[size])} style={style}></div>
        </div>
    )
};

export default Loader;