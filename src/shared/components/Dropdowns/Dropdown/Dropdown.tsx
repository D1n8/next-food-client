'use client'
import { useEffect, useRef, useState } from "react";
import styles from './Dropdown.module.scss'
import Text from "@components/Text";
import type { DropdownProps } from "../types/types";
import classNames from "classnames";
import type { SortKey } from "@components/SortDropdown/const";

function Dropdown({ getTitle, options, selectedKey, onSelect }: DropdownProps) {
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


    return (
        <div className={styles.sort} ref={containerRef}>
            <Text className={styles.title} color="secondary" onClick={() => setIsOpen(true)}>{getTitle(selectedKey)}</Text>

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
                                    onClick={() => onSelect(opt.key as SortKey)} >
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