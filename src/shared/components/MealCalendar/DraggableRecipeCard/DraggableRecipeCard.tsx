'use client'
import React, { memo } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { IRecipeModel } from '@/shared/store/models/recipe'
import styles from './DraggableRecipeCard.module.scss'
import classNames from 'classnames'
import Text from '../../Text'
import Button from '../../Button'

export type DraggableRecipeCardProps = {
    recipe: IRecipeModel
    onRemove?: () => void
    isInCalendar?: boolean
    date?: string
}

const DraggableRecipeCard: React.FC<DraggableRecipeCardProps> = ({ recipe, onRemove, isInCalendar = false, date }) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: isInCalendar && date ? `${date}-${recipe.id}-${recipe.documentId}` : `fav-${recipe.id}`,
        data: { recipe, isInCalendar, date }
    })

    const imageUrl = recipe.images?.[0]?.formats?.small?.url || recipe.images?.[0]?.url || ''

    return (
        <div
            ref={setNodeRef}
            className={classNames(styles.card, { [styles.dragging]: isDragging })}
            {...listeners}
            {...attributes}
        >
            {imageUrl && (
                <div className={styles.image}>
                    <img src={imageUrl} alt={recipe.name} />
                </div>
            )}

            <div className={styles.info}>
                <Text color='primary' className={styles.name}>{recipe.name}</Text>
                {recipe.totalTime > 0 && (
                    <Text color='primary' className={styles.time}>{recipe.totalTime} min</Text>
                )}
            </div>

            {isInCalendar && onRemove && (
                <button
                    className={styles.removeBtn}
                    onClick={(e) => {
                        e.stopPropagation()
                        onRemove()
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                >
                    ×
                </button>
            )}
        </div>
    )
}

export default memo(DraggableRecipeCard)