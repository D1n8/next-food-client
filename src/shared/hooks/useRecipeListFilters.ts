import { useSearchParams } from 'next/navigation'
import { QueryParams } from '@/shared/types/shared'

type RecipeFilters = {
    query: string
    categories: string[]
    sort: string
    isVegetarian: boolean
    ingredientsIncluded: string[]
    ingredientsExcluded: string[]
}

export const useRecipeListFilters = (): RecipeFilters => {
    const searchParams = useSearchParams()

    const query = searchParams.get(QueryParams.Name) || ''
    const sort = searchParams.get(QueryParams.SortBy) || ''
    const isVegetarian = searchParams.get(QueryParams.Vegetarian) === 'true'

    const categoriesParam = searchParams.get(QueryParams.Categories)
    const categories = categoriesParam ? categoriesParam.split(',') : []

    const ingsIncludedParam = searchParams.get(QueryParams.IngredientsIncluded)
    const ingredientsIncluded = ingsIncludedParam
        ? ingsIncludedParam.split(',').map(s => s.trim()).filter(Boolean)
        : []

    const ingsExcludedParam = searchParams.get(QueryParams.IngredientsExcluded)
    const ingredientsExcluded = ingsExcludedParam
        ? ingsExcludedParam.split(',').map(s => s.trim()).filter(Boolean)
        : []

    return {
        query,
        categories,
        sort,
        isVegetarian,
        ingredientsIncluded,
        ingredientsExcluded
    }
}