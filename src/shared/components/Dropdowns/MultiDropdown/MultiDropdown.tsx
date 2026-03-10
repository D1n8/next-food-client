'use client'
import React, { useState, useRef, useMemo, useEffect } from 'react';
import Input from '@components/Input';
import styles from './MultiDropdown.module.scss';
import ArrowDownIcon from '@components/Icons/ArrowDownIcon';
import classNames from 'classnames';
import type { MultiDropdownProps, Option } from '../types/types';
import Button from '@components/Button';

const MultiDropdown: React.FC<MultiDropdownProps> = ({
    className,
    options,
    value,
    onChange,
    disabled,
    getTitle,
    placeholder,
    action
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [filter, setFilter] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [])

    useEffect(() => {
        if (!isOpen) setFilter('');
    }, [isOpen]);

    const handleOptionClick = (option: Option) => {
        const isSelected = value.some((v) => v.key === option.key);
        if (isSelected) {
            onChange(value.filter((v) => v.key !== option.key));
        } else {
            onChange([...value, option]);
        }
    };

    const filteredOptions = useMemo(() => {
        return options.filter((opt) =>
            opt.value.toLowerCase().includes(filter.toLowerCase())
        );
    }, [options, filter]);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsOpen(false)
        action()
    }

    const displayValue = isOpen ? filter : value.length > 0 ? getTitle(value) : '';
    const placeholderValue = isOpen ? (value.length === 0 ? getTitle(value) : 'Selected:') : placeholder;

    return (
        <div className={classNames(styles.multiDropdown, className)} ref={containerRef} onClick={() => setIsOpen(true)}>
            <Input
                className={styles.multiDropdownInput}
                value={displayValue}
                placeholder={placeholderValue}
                disabled={disabled}
                onChange={(val) => {
                    setFilter(val);
                    setIsOpen(true);
                }}
                afterSlot={
                    <ArrowDownIcon color='secondary' />
                }
            />

            {isOpen && !disabled && (
                <div className={styles.box}>

                    <div className={styles.multiDropdownOptions}>
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt) => {
                                const isSelected = value.some((v) => v.key === opt.key);
                                return (
                                    <div
                                        key={opt.key}
                                        className={classNames(styles.multiDropdownOption, isSelected && styles.selected)}
                                        onClick={() => handleOptionClick(opt)}
                                    >
                                        {opt.value}
                                    </div>
                                );
                            })
                        ) : (
                            <div className={styles.multiDropdownOption}>Nothing found</div>
                        )}
                    </div>

                    <Button onClick={handleClick} style={{ justifyContent: 'center' }}>Aplly</Button>
                </div>
            )}
        </div>
    );
};

export default MultiDropdown;