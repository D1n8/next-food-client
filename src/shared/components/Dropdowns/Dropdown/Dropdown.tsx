'use client'
import { useEffect, useRef, useState } from "react";
import styles from './Dropdown.module.scss'
import Text from "@components/Text";
import type { DropdownProps } from "../types/types";
import classNames from "classnames";
import type { SortKey } from "@components/SortDropdown/const";

function Dropdown({ getTitle, options, selectedKey, onSelect, isActive }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false)
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

    const handleOptionClick = (key: string) => {
        onSelect(key as SortKey)
        setIsOpen(false)
    }


    return (
        <div className={styles.sort} ref={containerRef}>
            <Text className={classNames(styles.title, isActive && styles.active)} color="secondary" onClick={() => setIsOpen(!isOpen)}>{getTitle(selectedKey)}</Text>

            {
                isOpen &&
                <div className={styles.dropdown}>
                    {
                        options.map(opt => {
                            const isSelected = opt.key === selectedKey
                            return (
                                <div
                                    key={opt.key}
                                    className={classNames(styles.option, isSelected && styles.selected)}
                                    onClick={() => handleOptionClick(opt.key)} >
                                    {opt.value}
                                </div>
                            )
                        }
                        )
                    }
                </div>
            }
        </div>
    );
}

export default Dropdown;