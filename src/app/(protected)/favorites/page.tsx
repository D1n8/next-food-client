'use client'
import { useCallback, useEffect } from 'react';
import styles from './Favorites.module.scss';
import { observer } from 'mobx-react-lite';
import RecipeCard from '@components/RecipeCard';
import { formatKcal } from '@shared/utils';
import Text from '@components/Text';
import Button from '@components/Button';
import { useRouter } from 'next/navigation';
import FavoritesStore from '@shared/store/FavoritesStore';
import { useLocalStore } from '@shared/hooks/useLocalStore';
import Loader from '@components/Loader';
import { routes } from '@config/routes';
import CaptionSlot from '@components/CaptionSlot';

const Favorites = observer(() => {
    const store = useLocalStore(() => new FavoritesStore())
    const router = useRouter()

    useEffect(() => {
        store.fetchFavorites()
    }, [store])

    const removeFromFavorites = useCallback((e: React.MouseEvent, id: number) => {
        e.stopPropagation()
        store.removeFromFavorites(id)
    }, [store])

    const handleClick = useCallback((id: string) => {
        router.push(routes.recipe.create(id))
    }, [router])

    if (store.isLoading) {
        return (
            <div className={styles.loaderContainer}>
                <Loader size='l' />
            </div>)
    }

    return (
        <div className={styles.favoritesPage}>
            <Text tag='h2' view='title' color='primary'>Favorites</Text>
            {
                <div className={styles.list}>{
                    (store.favorites.length > 0) &&
                    store.favorites.map(item => {
                        const recipeId = item.recipe.id
                        const documentId = item.recipe.documentId

                        return (
                            <RecipeCard
                                key={item.documentId}
                                image={item.recipe.images[0].url}
                                title={item.recipe.name}
                                subtitle={item.recipe.summary}
                                captionSlot={<CaptionSlot totalTime={item.recipe.totalTime} rating={item.recipe.rating}/>}
                                contentSlot={<Text color='accent' view='p-18'>{formatKcal(item.recipe.calories)} kcal</Text>}
                                actionSlot={<Button children={'Unsave'} onClick={(e) => removeFromFavorites(e, recipeId)} />}
                                onClick={() => handleClick(documentId)}
                            />
                        )
                    }

                    )}
                </div>
            }
        </div>
    );
})

export default Favorites;