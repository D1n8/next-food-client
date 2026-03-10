import type { Option } from '@components/Dropdowns/types/types'
import type { Ingredient } from '../store/models/recipe'

export function formatKcal(value: number) {
    return Math.floor(value)
}

export function formatIngredients(ingredients: Ingredient[]) {
    return ingredients.reduce((acc, curr, index) => {
        if (index === 0) {
            return acc + curr.name
        }
        return acc + ' + ' + curr.name
    }, '')
}

export function formatSeletedCategories(values: Option[]) {
    let result = ''
    for (let i = 0; i < values.length; i++) {
        if (i === 0) {
            result += values[i].value
            continue
        }
        result += `, ${values[i].value}`
    }
    return result
}