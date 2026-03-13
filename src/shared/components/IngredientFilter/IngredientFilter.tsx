'use client'
import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Input from '@components/Input';
import Text from '@components/Text';
import classNames from 'classnames';
import styles from './IngredientFilter.module.scss';

const PARAM_INCLUDED = 'ings-included'

function IngredientFilter() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const [included, setIncluded] = useState(searchParams.get(PARAM_INCLUDED) || '')

    const applyFilter = (paramKey: string, value: string) => {
        const newParams = new URLSearchParams(searchParams.toString())

        if (value.trim().length === 0) {
            newParams.delete(paramKey)
        } else {
            newParams.set(paramKey, value.trim())
        }

        router.push(`${pathname}?${newParams.toString()}`, { scroll: false })
    }

    const handleKeyDown = (e: React.KeyboardEvent, paramKey: string, value: string) => {
        if (e.key === 'Enter') {
            applyFilter(paramKey, value)
        }
    }

    return (
        <div className={styles.root}>
            <div className={styles.field}>
                <Text view='p-14' color='secondary'>Include ingredients</Text>
                <Input
                    className={classNames(styles.input, included.trim().length > 0 && styles.active)}
                    value={included}
                    onChange={setIncluded}
                    onBlur={() => applyFilter(PARAM_INCLUDED, included)}
                    onKeyDown={(e) => handleKeyDown(e, PARAM_INCLUDED, included)}
                    placeholder='e.g. chicken, garlic'
                />
            </div>
        </div>
    );
}

export default IngredientFilter;
