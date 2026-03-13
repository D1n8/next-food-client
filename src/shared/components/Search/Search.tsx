'use client'
import Input from '@components/Input';
import styles from '@/app/RecipesList.module.scss'
import Button from '@components/Button';
import SearchIcon from '@components/Icons/SearchIcon';
import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import classNames from 'classnames';
import { QueryParams } from '@/shared/types/shared';

function Search() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const [searchValue, setSearchValue] = useState(searchParams.get(QueryParams.Name) || '')

    const handleSearch = (e: React.MouseEvent | React.KeyboardEvent, newValue: string) => {
        e.preventDefault()
        const newParams = new URLSearchParams(searchParams.toString())

        if (newValue.length === 0) {
            newParams.delete(QueryParams.Name)
        } else {
            newParams.set(QueryParams.Name, newValue)
        }

        router.push(`${pathname}?${newParams.toString()}`, { scroll: false })
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch(e, searchValue)
        }
    }

    return (
        <div className={styles.inputContainer}>
            <Input
                style={{ width: '100%' }}
                className={classNames(styles.input, searchValue.length > 0 && styles.active)}
                value={searchValue}
                onChange={setSearchValue}
                onKeyDown={handleKeyDown}
                placeholder='Enter dishes' />
            <Button onClick={(e) => handleSearch(e, searchValue)}>
                <SearchIcon />
            </Button>
        </div>
    );
}

export default Search;