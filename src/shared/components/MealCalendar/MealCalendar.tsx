'use client'
import React, { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { DndContext, DragEndEvent, DragOverlay, useSensor, useSensors, PointerSensor, DragStartEvent } from '@dnd-kit/core'
import { addDays, subDays, format } from 'date-fns'
import { useRootStore } from '@/shared/store/RootStore'
import { useLocalStore } from '@shared/hooks'
import FavoritesStore from '@shared/store/FavoritesStore'
import { IRecipeModel } from '@shared/store/models/recipe'
import DayColumn from './DayColumn'
import DraggableRecipeCard from './DraggableRecipeCard'
import styles from './MealCalendar.module.scss'
import Text from '../Text'
import Button from '../Button'

const MealCalendar: React.FC = observer(() => {
    const { mealPlannerStore, shoppingStore } = useRootStore()
    const favoritesStore = useLocalStore(() => new FavoritesStore())
    const [activeRecipe, setActiveRecipe] = React.useState<IRecipeModel | null>(null)

    useEffect(() => {
        favoritesStore.fetchFavorites()
    }, [favoritesStore])

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8
            }
        })
    )

    const handleDragStart = (event: DragStartEvent) => {
        const recipe = event.active.data.current?.recipe as IRecipeModel | undefined
        if (recipe) {
            setActiveRecipe(recipe)
        }
    }

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveRecipe(null)
        const { active, over } = event
        if (!over) return

        const recipe = active.data.current?.recipe as IRecipeModel
        if (!recipe) return

        const overId = over.id as string

        // Check if dropping on a day column
        const isDroppingOnDay = /^\d{4}-\d{2}-\d{2}$/.test(overId)

        if (isDroppingOnDay) {
            const isFromCalendar = active.data.current?.isInCalendar
            if (isFromCalendar) {
                const sourceDate = active.data.current?.date as string
                if (sourceDate && sourceDate !== overId) {
                    mealPlannerStore.moveRecipe(sourceDate, overId, recipe.id)
                    mealPlannerStore.syncIngredientsToShoppingList(shoppingStore)
                }
            } else {
                // Adding from favorites
                mealPlannerStore.addRecipeToDate(overId, recipe)
                mealPlannerStore.syncIngredientsToShoppingList(shoppingStore)
            }
        }
    }

    const handleRemoveRecipe = (date: string, recipeId: number) => {
        mealPlannerStore.removeRecipeFromDate(date, recipeId)
        mealPlannerStore.syncIngredientsToShoppingList(shoppingStore)
    }

    const goToPrevWeek = () => {
        mealPlannerStore.setCurrentWeekStart(subDays(mealPlannerStore.currentWeekStart, 7))
    }

    const goToNextWeek = () => {
        mealPlannerStore.setCurrentWeekStart(addDays(mealPlannerStore.currentWeekStart, 7))
    }

    const goToCurrentWeek = () => {
        mealPlannerStore.setCurrentWeekStart(new Date())
    }

    const weekStart = mealPlannerStore.currentWeekStart
    const weekEnd = addDays(weekStart, 6)
    const weekLabel = `${format(weekStart, 'd MMM')} - ${format(weekEnd, 'd MMM yyyy')}`

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className={styles.container}>
                <div className={styles.sidebar}>
                    <Text color='primary' className={styles.sidebarTitle}>Favorites</Text>
                    <div className={styles.favoritesList}>
                        {favoritesStore.favorites.length === 0 ? (
                            <div className={styles.emptyFavorites}>
                                No favorite recipes
                            </div>
                        ) : (
                            favoritesStore.favorites.map(fav => (
                                <DraggableRecipeCard
                                    key={fav.id}
                                    recipe={fav.recipe}
                                />
                            ))
                        )}
                    </div>
                </div>

                <div className={styles.calendar}>
                    <div className={styles.navigation}>
                        <Button className={styles.todayBtn} onClick={goToCurrentWeek}>Today</Button>
                        <div className={styles.navWeek}>
                            <button className={styles.navBtn} onClick={goToPrevWeek}>←</button>
                            <Text tag='span' color='primary' className={styles.weekLabel}>{weekLabel}</Text>
                            <button className={styles.navBtn} onClick={goToNextWeek}>→</button>
                        </div>
                    </div>

                    <div className={styles.week}>
                        {mealPlannerStore.weekDates.map(date => (
                            <DayColumn
                                key={date}
                                date={date}
                                recipes={mealPlannerStore.getRecipesForDate(date)}
                                onRemoveRecipe={(recipeId) => handleRemoveRecipe(date, recipeId)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <DragOverlay>
                {activeRecipe ? (
                    <DraggableRecipeCard recipe={activeRecipe} />
                ) : null}
            </DragOverlay>
        </DndContext>
    )
})

export default MealCalendar