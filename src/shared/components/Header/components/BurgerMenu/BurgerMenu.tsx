'use client'
import { useCallback, useState } from 'react';
import BurgerButton from '../BurgerButton';
import styles from './BurgerMenu.module.scss'
import Text from '@components/Text';
import Link from 'next/link';
import classNames from 'classnames';
import { routes } from '@/shared/config/routes';

function BurgerMenu() {
    const [isOpen, setIsOpen] = useState(false)
    const handleOpen = useCallback(() => {
        setIsOpen(false)
    }, [])

    return (
        <>
            <BurgerButton onClick={() => setIsOpen(!isOpen)} />
            <nav className={classNames(styles.nav, isOpen && styles.open)}>
                <div className={styles.burgerNav}>
                    <Link className={styles.link} href={routes.main.mask}>
                        <Text onClick={handleOpen} view="p-16">
                            Recipes
                        </Text>
                    </Link>
                </div>
            </nav>
        </>
    );
}

export default BurgerMenu;