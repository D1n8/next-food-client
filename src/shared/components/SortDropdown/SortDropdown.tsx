'use client'
import Dropdown from '@components/Dropdowns/Dropdown';
import { options, SortKey } from './const';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { QueryParams } from '@/shared/types/shared';

const SortDropdown = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const selectedValue = (searchParams.get(QueryParams.SortBy) as SortKey) || SortKey.Default;

    const handleSelect = (value: SortKey) => {
        const newParams = new URLSearchParams(searchParams.toString())

        if (!value || value === SortKey.Default) {
            newParams.delete(QueryParams.SortBy)
        } else {
            newParams.set(QueryParams.SortBy, value)
        }

        router.push(`${pathname}?${newParams.toString()}`, { scroll: false })

    }

    const getTitle = (key: SortKey) => {
        if (key === SortKey.Default) {
            return "Sort by";
        }

        const option = options.find(opt => opt.key === key);

        return option ? option.value : "Sort by";
    }

    const isActive = selectedValue !== SortKey.Default

    return (
        <Dropdown
            getTitle={getTitle}
            options={options}
            selectedKey={selectedValue}
            onSelect={handleSelect}
            isActive={isActive} />
    );
}

export default SortDropdown;