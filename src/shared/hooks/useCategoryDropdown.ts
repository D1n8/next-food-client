import { useEffect, useMemo, useState } from "react";
import CategoryStore from "@shared/store/CategoryStore";
import { useLocalStore } from "./useLocalStore";
import { useSearchParams, useRouter, usePathname } from "next/navigation"; 
import type { Option } from '@components/Dropdowns/types/types';
import { formatSeletedCategories } from "@shared/utils";
import { QueryParams } from "@/shared/types/shared";

export const useCategoryDropdown = () => {
    const store = useLocalStore(() => new CategoryStore())
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const [localSelected, setLocalSelected] = useState<Option[]>([])

    useEffect(() => {
        store.fetchCategoryList()
    }, [store])

    const categoryOptions = useMemo<Option[]>(
        () => store.list.map(item => ({ key: item.id.toString(), value: item.title })),
        [store.list]
    )

    useEffect(() => {
        const param = searchParams.get(QueryParams.Categories)
        const ids = param ? param.split(',') : []

        const optionsFromUrl = categoryOptions.filter(opt => ids.includes(opt.key))
        setLocalSelected(optionsFromUrl)
    }, [searchParams, categoryOptions])

    const handleChange = (newValues: Option[]) => {
        setLocalSelected(newValues)
    }

    const handleApply = () => {
        const newParams = new URLSearchParams(searchParams.toString())
        
        if (localSelected.length === 0) {
            newParams.delete(QueryParams.Categories)
        } else {
            const ids = localSelected.map(v => v.key).join(',')
            newParams.set(QueryParams.Categories, ids)
        }
        
        router.push(`${pathname}?${newParams.toString()}`, { scroll: false })
    }

    const handleGetTitle = (value: Option[]) => {
        return formatSeletedCategories(value)
    }

    const handleClear = () => {
        setLocalSelected([])
        const newParams = new URLSearchParams(searchParams.toString())
        newParams.delete(QueryParams.Categories)
        router.push(`${pathname}?${newParams.toString()}`, { scroll: false })
    }

    return {
        options: categoryOptions,
        value: localSelected,
        onChange: handleChange,
        onApply: handleApply,
        getTitle: handleGetTitle,
        clear: handleClear
    }
}