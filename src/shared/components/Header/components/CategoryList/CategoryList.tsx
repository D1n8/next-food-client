'use client'
import { useLocalStore } from '@/shared/hooks';
import styles from './CategoryList.module.scss'
import CategoryStore from '@/shared/store/CategoryStore';
import { useEffect, useMemo } from 'react';
import Text from '@/shared/components/Text';
import { useRouter, useSearchParams } from 'next/navigation';
import { QueryParams } from '@/shared/types/shared';
import { routes } from '@/shared/config/routes';

interface ICategoryList {
    visible: boolean,
    onClose: () => void
}

function CategoryList({ visible, onClose }: ICategoryList) {
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
        <div className={`${styles.container} ${visible ? styles.visible : ''}`}>
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

export default CategoryList;