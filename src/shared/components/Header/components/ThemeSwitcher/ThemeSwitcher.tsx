'use client'
import Sun from "@components/Icons/Sun";
import Moon from "@components/Icons/Moon";
import { useCallback } from "react";
import styles from './ThemeSwitcher.module.scss'
import { observer } from "mobx-react-lite";
import { useRootStore } from "@shared/store/RootStore";

const ThemeSwitcher = observer(() => {
    const { uiStore } = useRootStore()

    const handleSwitch = useCallback(() => {
        uiStore.toggleTheme()
    }, [uiStore])

    return (
        <button className={styles.btn} onClick={handleSwitch}>
            { uiStore.isDark ? 
                <Moon/>
                :
                <Sun/>
            }
        </button>
    );
})

export default ThemeSwitcher;