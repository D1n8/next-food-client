'use client'
import { useLocalStore } from '@/shared/hooks/useLocalStore';
import styles from './CategoryList.module.scss'
import CategoryStore from '@/shared/store/CategoryStore';
import { Suspense, useEffect, useMemo } from 'react';
import Text from '@/shared/components/Text';
import { useRouter, useSearchParams } from 'next/navigation';
import { QueryParams } from '@/shared/types/shared';
import { routes } from '@/shared/config/routes';
import classNames from 'classnames';

interface ICategoryList {
    visible: boolean,
    onClose: () => void,
    isMobile?: boolean,
    backToMenu?: () => void
}

function CategoryListMenu({ visible, onClose, isMobile, backToMenu }: ICategoryList) {
    const store = useLocalStore(() => new CategoryStore())
    const searchParams = useSearchParams()
    const router = useRouter()

    useEffect(() => {
        store.fetchCategoryList()
    }, [store])

    const categoryOptions = useMemo(
        () => store.list.map(item => ({ key: item.id.toString(), value: item.title })),
        [store.list])

    const handleClick = (id: string) => {
        const newParams = new URLSearchParams(searchParams.toString())
        newParams.set(QueryParams.Categories, id)
        router.push(`${routes.main.mask}?${newParams.toString()}`, { scroll: false })
        onClose()
        window.scrollTo({
            top: 500,
            left: 0,
            behavior: 'smooth'
        })
    }

    if (categoryOptions.length === 0) return null;

    return (
        <div className={classNames(styles.container, { 
            [styles.visible]: visible, 
            [styles.mobile]: isMobile
        })}>

            {isMobile && backToMenu && (
                <div className={styles.backButton} onClick={(e) => {
                    e.stopPropagation()
                    backToMenu()
                }}>
                    <Text view="p-16" color="primary">Back to Menu</Text>
                </div>
            )}

            <ul className={styles.categoryList}>
                {
                    categoryOptions.map(opt =>
                        <Text
                            key={opt.key}
                            tag='li'
                            color='primary'
                            className={styles.category}
                            onClick={() => handleClick(opt.key)}>{opt.value}</Text>
                    )
                }
            </ul>
        </div>
    );
}

export default function CategoryList(props: ICategoryList) {
    return (
        <Suspense fallback={null}>
            <CategoryListMenu {...props}/>
        </Suspense>
    );
}