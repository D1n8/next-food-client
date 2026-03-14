'use client'
import Logo from "@components/Logo";
import Text from "@components/Text";
import Favorites from "@components/Icons/Favorites";
import User from "@components/Icons/User";
import styles from './Header.module.scss';
import BurgerMenu from "./components/BurgerMenu";
import Link from "next/link";
import { observer } from "mobx-react-lite";
import ThemeSwitcher from "./components/ThemeSwitcher";
import { useRootStore } from "@/shared/store/RootStore";
import { routes } from "@/shared/config/routes";
import { useState } from "react";
import CategoryList from "./components/CategoryList";

const Header = observer(() => {
    const { userStore } = useRootStore()
    const [listVisible, setListIsVisible] = useState(false)

    return (
        <header className={styles.header}>
            <div className={styles.headerContainer}>
                <BurgerMenu />
                <div className={styles.headerLogo}>
                    <Logo />
                    <Text view="p-20" tag="h1" color="primary" className={styles.title}>Food Client</Text>
                </div>

                <nav className={styles.nav}>
                    <ul className={styles.pageLinks}>
                        <Text tag="li" view="p-16">
                            <Link className={styles.link} href={routes.main.mask}>Recipes</Link>
                        </Text>

                        <li
                            className={styles.link}
                            onMouseEnter={() => setListIsVisible(true)}
                            onMouseLeave={() => setListIsVisible(false)}
                        >
                            <Text view="p-16" className={styles.link}>
                                Categories
                            </Text>
                            <CategoryList visible={listVisible} onClose={() => setListIsVisible(false)} />
                        </li>

                        <Text tag="li" view="p-16">
                            <Link className={styles.link} href={routes.shoppingList.mask}>
                                Shopping List
                            </Link>
                        </Text>

                    </ul>

                    <div className={styles.userInfo}>
                        <Link href={routes.favorites.mask}>
                            <Favorites />
                        </Link>
                        <Link href={userStore.isAuth ? routes.profile.mask : routes.login.mask}>
                            <User />
                        </Link>
                        <ThemeSwitcher />
                    </div>
                </nav>
            </div>
        </header>
    );
})

export default Header;