'use client'
import { useLocalStore } from '@/shared/hooks';
import styles from './CategoryList.module.scss'
import CategoryStore from '@/shared/store/CategoryStore';
import { useEffect, useMemo } from 'react';
import Text from '@/shared/components/Text';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { QueryParams } from '@/shared/types/shared';

interface ICategoryList {
    visible: boolean,
    onClose: () => void
}

function CategoryList({ visible, onClose, ...props }: ICategoryList) {
    const store = useLocalStore(() => new CategoryStore())
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        store.fetchCategoryList()
    }, [store])

    const categoryOptions = useMemo(
        () => store.list.map(item => ({ key: item.id.toString(), value: item.title })),
        [store.list])

    const handleClick = (id: string) => {
        const newParams = new URLSearchParams(searchParams.toString())
        newParams.set(QueryParams.Categories, id)
        router.push(`${pathname}?${newParams.toString()}`, { scroll: false })
        onClose()
        window.scrollTo({
            top: 500,
            left: 0,
            behavior: 'smooth'
        })
    }

    return (
        visible && categoryOptions.length > 0 &&
        <div className={styles.container}>
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