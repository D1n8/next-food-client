'use client'
import React, { memo } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { IRecipeModel } from '@/shared/store/models/recipe'
import styles from './DraggableRecipeCard.module.scss'
import classNames from 'classnames'
import Text from '../../Text'
import { useRouter } from 'next/navigation'
import { routes } from '@/shared/config/routes'
import CloseButton from '../../CloseButton'

export type DraggableRecipeCardProps = {
    id: string,
    recipe: IRecipeModel,
    onRemove?: () => void,
    dragData?: Record<string, any>
    isOverlay?: boolean
}

const DraggableRecipeCard: React.FC<DraggableRecipeCardProps> = ({ recipe, onRemove, id, dragData, isOverlay = false }) => {
    const router = useRouter()
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: id,
        data: dragData || { recipe },
        disabled: isOverlay
    })

    const imageUrl = recipe.images?.[0]?.formats?.small?.url || recipe.images?.[0]?.url || ''

    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (onRemove)
            onRemove()
    }

    const shouldShowDragging = isDragging && !isOverlay;

    return (
        <div
             ref={isOverlay ? undefined : setNodeRef}
            className={classNames(styles.card, { [styles.dragging]: shouldShowDragging })}
            {...(isOverlay ? {} : listeners)} 
            {...(isOverlay ? {} : attributes)}
        >
            {imageUrl && (
                <div className={styles.image}>
                    <img src={imageUrl} alt={recipe.name} />
                </div>
            )}

            <div className={styles.info} onClick={() => router.push(routes.recipe.create(recipe.documentId))}>
                <Text color='primary' className={styles.name}>{recipe.name}</Text>
                {recipe.totalTime > 0 && (
                    <Text color='primary' className={styles.time}>{recipe.totalTime} min</Text>
                )}
            </div>

            {onRemove && (
                <CloseButton
                    onClick={handleClose}
                    onPointerDown={(e) => e.stopPropagation()} />
            )}
        </div>
    )
}

export default memo(DraggableRecipeCard)