'use client'
import ArrowDownIcon from "@components/Icons/ArrowDownIcon";
import Button from "@components/Button";
import styles from './ScrollToTop.module.scss'
import { useEffect, useState } from "react";
import classNames from "classnames";

function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false)

    const toogleVisibility = () => {
        if (window.scrollY > 300) {
            setIsVisible(true)
        } else {
            setIsVisible(false)
        }
    }

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    useEffect(() => {
        window.addEventListener('scroll', toogleVisibility)
        return () => window.removeEventListener('scroll', toogleVisibility)
    }, [])

    return (
        <Button onClick={scrollToTop} className={classNames(styles.btnToTop, isVisible && styles.visible)}>
            <ArrowDownIcon color="accent" style={{ transform: 'rotate(180deg)' }} />
        </Button>
    );
}

export default ScrollToTop;