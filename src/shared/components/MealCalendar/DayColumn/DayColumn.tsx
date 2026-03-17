'use client'
import React, { memo } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { format, parseISO } from 'date-fns'
import { IRecipeModel } from '@shared/store/models/recipe'
import DraggableRecipeCard from '../DraggableRecipeCard'
import styles from './DayColumn.module.scss'
import classNames from 'classnames'
import Text from '../../Text'

export type DayColumnProps = {
    date: string
    recipes: IRecipeModel[]
    onRemoveRecipe: (recipeId: number) => void
}

const DayColumn: React.FC<DayColumnProps> = ({ date, recipes, onRemoveRecipe }) => {
    const dateObj = parseISO(date)
    const dayName = format(dateObj, 'EEE')
    const dayNumber = format(dateObj, 'd')
    const month = format(dateObj, 'MMM')

    const { isOver, setNodeRef } = useDroppable({
        id: date
    })

    return (
        <div className={styles.column}>
            <div className={styles.header}>
                <Text color='primary' className={styles.dayName}>{dayName}</Text>
                <Text color='primary' className={styles.dayNumber}>{dayNumber}</Text>
                <Text color='primary' className={styles.month}>{month}</Text>
            </div>
            <div
                ref={setNodeRef}
                className={classNames(styles.content, { [styles.over]: isOver })}
            >
                {recipes.length === 0 ? (
                    <Text color='primary' className={styles.empty}>Drag and drop recipe</Text>
                ) : (
                    recipes.map(recipe => {
                        const uniqueId = `${date}-${recipe.id}-${recipe.documentId}`
                        return (<DraggableRecipeCard
                            key={uniqueId}
                            id={uniqueId}
                            recipe={recipe}
                            dragData={{ recipe, isInCalendar: true, date }}
                            onRemove={() => onRemoveRecipe(recipe.id)}
                        />)
                    })
                )
                }
            </div>
        </div>
    )
}

export default memo(DayColumn)