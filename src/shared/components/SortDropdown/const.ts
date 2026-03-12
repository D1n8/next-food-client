import type { Option } from "@components/Dropdowns/types/types"

export enum SortKey {
    Default = 'default',
    Rating = 'rating:desc',
    Quick = 'totalTime:asc',
    Slow = 'totalTime:desc',
    Calories = 'calories:asc'
}

export const options: Option[] = [
    {
        key: SortKey.Default,
        value: "Default"
    },
    {
        key: SortKey.Rating,
        value: "Rating"
    },
    {
        key: SortKey.Quick,
        value: "Quick recipe"
    },
    {
        key: SortKey.Slow,
        value: "Slow recipe"
    },
    {
        key: SortKey.Calories,
        value: "Low-calorie"
    }
]

