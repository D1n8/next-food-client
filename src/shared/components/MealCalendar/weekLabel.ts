import { addDays, format } from 'date-fns'

export const getWeekLabel = (weekStart: Date): string => {
    const weekEnd = addDays(weekStart, 6)
    return `${format(weekStart, 'd MMM')} - ${format(weekEnd, 'd MMM yyyy')}`
}