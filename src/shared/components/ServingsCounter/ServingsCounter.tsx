'use client'
import React, { memo, useCallback } from 'react';
import classNames from 'classnames';
import styles from './ServingsCounter.module.scss';
import Button from '../Button';

export type ServingsCounterProps = {
    className?: string;
    value: number;
    min?: number;
    onChange: (value: number) => void;
};

const ServingsCounter: React.FC<ServingsCounterProps> = ({ className, value, min = 1, onChange }) => {
    const handleDecrement = useCallback(() => {
        if (value > min) onChange(value - 1);
    }, [value, min, onChange]);

    const handleIncrement = useCallback(() => {
        onChange(value + 1);
    }, [value, onChange]);

    const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const parsed = parseInt(e.target.value, 10);
        if (!isNaN(parsed) && parsed >= min) onChange(parsed);
    }, [min, onChange]);

    return (
        <div className={classNames(styles.root, className)}>
            <Button
                className={styles.btn}
                onClick={handleDecrement}
                disabled={value <= min}
                aria-label="Decrease servings"
            >
                −
            </Button>
            <input
                className={styles.input}
                type="number"
                min={min}
                value={value}
                onChange={handleInput}
            />
            <Button
                className={styles.btn}
                onClick={handleIncrement}
                aria-label="Increase servings"
            >
                +
            </Button>
        </div>
    );
};

export default memo(ServingsCounter);
