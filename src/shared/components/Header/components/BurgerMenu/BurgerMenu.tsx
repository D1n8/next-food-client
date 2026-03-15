'use client'
import { useCallback, useState } from 'react';
import BurgerButton from '../BurgerButton';
import styles from './BurgerMenu.module.scss'
import Text from '@components/Text';
import Link from 'next/link';
import classNames from 'classnames';
import { routes } from '@/shared/config/routes';
import CategoryList from '../CategoryList';

function BurgerMenu() {
    const [isOpen, setIsOpen] = useState(false)
    const [listVisible, setListIsVisible] = useState(false)

    const handleOpen = useCallback(() => {
        setIsOpen(false)
        setListIsVisible(false)
    }, [])

    const handleOpenShopList = (e: React.MouseEvent) => {
        e.stopPropagation()
        setListIsVisible(true)
    }

    return (
        <>
            <BurgerButton onClick={() => setIsOpen(!isOpen)} />
            <nav className={classNames(styles.nav, isOpen && styles.open)}>
                <div className={styles.burgerNav} style={{ position: 'relative', height: '100%' }}>
                    <Link className={styles.link} href={routes.main.mask}>
                        <Text onClick={handleOpen} view="p-16">
                            Recipes
                        </Text>
                    </Link>

                    <Text
                        view="p-16"
                        color='primary'
                        className={styles.link}
                        onClick={handleOpenShopList}>
                        Categories
                    </Text>


                    <Link className={styles.link} href={routes.shoppingList.mask}>
                        <Text onClick={handleOpen} view="p-16">
                            Shopping List
                        </Text>
                    </Link>

                    <CategoryList
                        visible={listVisible}
                        onClose={handleOpen}
                        isMobile={true}
                        backToMenu={() => setListIsVisible(false)}
                    />
                </div>
            </nav>
        </>
    );
}

export default BurgerMenu;