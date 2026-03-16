'use client'
import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useRootStore } from '@/shared/store/RootStore'
import MealCalendar from '@components/MealCalendar'
import Text from '@components/Text'
import styles from './MealPlanner.module.scss'

const MealPlannerPage = observer(() => {
    const { mealPlannerStore } = useRootStore()

    useEffect(() => {
        if (!mealPlannerStore.isHydrated) {
            mealPlannerStore.init()
        }
    }, [mealPlannerStore])


    if (!mealPlannerStore.isHydrated) {
        return null
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <Text tag="h2" view="title" color="primary">Meal Planner</Text>
                <Text view="p-18" color="secondary">
                    Drag and drop recipes from your favorites to days of the week
                </Text>
            </div>
            <MealCalendar />
        </div>
    )
})

export default MealPlannerPage