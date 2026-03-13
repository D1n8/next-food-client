'use client'
import CheckBox from '@components/CheckBox';
import Text from '@components/Text';
import styles from './VegetarianCheckbox.module.scss'
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import classNames from 'classnames';
import { QueryParams } from '@/shared/types/shared';

function VegetarianCheckbox() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const isChecked = Boolean(searchParams.get(QueryParams.Vegetarian))

    const handleCheck = (value: boolean) => {
        const newParams = new URLSearchParams(searchParams.toString())

        if (!value) {
            newParams.delete(QueryParams.Vegetarian)
        } else {
            newParams.set(QueryParams.Vegetarian, 'true')
        }

        router.push(`${pathname}?${newParams.toString()}`, { scroll: false })
    }

    return (
        <div className={classNames(styles.vegetarian, isChecked && styles.checked)}>
            <Text color='secondary'>Vegetarian</Text>
            <CheckBox className={styles.checkbox} checked={isChecked} onChange={handleCheck} />
        </div>
    )
}

export default VegetarianCheckbox;