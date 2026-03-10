'use client'
import { useCallback, useEffect, useState } from 'react';
import styles from './RecipesList.module.scss';
import RecipeCard from '@components/RecipeCard';
import Button from '@components/Button';
import Text from '@components/Text';
import { useRouter } from 'next/navigation';
import { formatIngredients, formatKcal } from '@shared/utils';
import Loader from '@components/Loader';
import { observer } from 'mobx-react-lite';
import RecipeListStore from '@shared/store/RecipeListStore';
import Search from '@components/Search';
import { toJS } from 'mobx';
import InfiniteScroll from 'react-infinite-scroll-component';
import CategoryDropdown from '@shared/components/CategoryDropdown';
import FavoritesStore from '@shared/store/FavoritesStore';
import { routes } from '@shared/config/routes';
import CaptionSlot from '@components/CaptionSlot';
import SortDropdown from '@components/SortDropdown';
import ScrollToTop from '@components/ScrollToTop';
import VegetarianCheckbox from '@components/VegetarianCheckbox';
import { useRootStore } from '@shared/store/RootStore';
import { useSearchParams } from 'next/navigation';

const RecipesList = observer(() => {
    const router = useRouter()
    const [recipeListStore] = useState(() => new RecipeListStore())
    const [favoritesStore] = useState(() => new FavoritesStore())
    const { userStore } = useRootStore()
    const searchParams = useSearchParams()
    const isAuth = userStore.isAuth
    const listKey = searchParams.toString() || 'default-list'

    useEffect(() => {
        const query = searchParams.get('name') || ''
        const sort = searchParams.get('sort-by') || ''
        const isVegetarian = searchParams.get('vegetarian') === 'true'
        const categoriesParam = searchParams.get('categories')
        const categories = categoriesParam ? categoriesParam.split(',') : []
        recipeListStore.fetchRecipeList(query, categories, sort, isVegetarian )
    }, [recipeListStore, searchParams])

    useEffect(() => {
        if (isAuth) {
            favoritesStore.fetchFavorites()
        }
    }, [isAuth, favoritesStore])

    const handleCardClick = useCallback((id: string) => {
        router.push(routes.recipe.create(id))
    }, [router])

    const handleFavoriteClick = useCallback((e: React.MouseEvent, docId: string, actionId: number) => {
        e.stopPropagation()

        if (!isAuth) {
            router.push(routes.login.mask)
            return
        }

        if (favoritesStore.favoritesDocIds.has(docId)) {
            favoritesStore.removeFromFavorites(actionId)
        } else {
            favoritesStore.addToFavorites(actionId)
        }
    }, [favoritesStore, isAuth, router])

    const isLoading = recipeListStore.meta === 'loading'
    const isError = recipeListStore.meta === 'error'
    const recipes = toJS(recipeListStore.list)

    return (
        <div className={styles.listPage}>
            <div className={styles.hero}></div>

            <section className={styles.listPageContainer}>
                <Text
                    className={styles.subtitle}
                    view='p-20'
                    color='primary'
                    tag='h2'>Find the perfect food and <u>drink ideas</u> for every occasion, from <u>weeknight dinners</u> to <u>holiday feasts</u>.</Text>

                <Search />
                <div className={styles.filtersContainer}>
                    <div className={styles.filtersBox}>
                        <SortDropdown />
                        <VegetarianCheckbox />
                    </div>
                    <CategoryDropdown />
                </div>

                <InfiniteScroll
                    key={listKey}
                    style={{ overflow: 'visible' }}
                    dataLength={recipes.length}
                    next={recipeListStore.loadMore}
                    hasMore={recipeListStore.hasMore}
                    loader={
                        <div className={styles.loaderContainer}>
                            <Loader size='l' />
                        </div>}
                >
                    {
                        <div className={styles.list}>{
                            (!isError && recipes.length > 0) &&
                            recipes.map(recipe => {
                                const isFavorite = favoritesStore.favoritesDocIds.has(recipe.documentId)

                                return (<RecipeCard
                                    key={recipe.documentId}
                                    image={recipe.images[0].url}
                                    title={recipe.name}
                                    subtitle={formatIngredients(recipe.ingredients)}
                                    captionSlot={<CaptionSlot totalTime={recipe.totalTime} rating={recipe.rating} />}
                                    contentSlot={<Text color='accent' view='p-18'>{formatKcal(recipe.calories)} kcal</Text>}
                                    actionSlot={<Button children={isFavorite ? 'Unsave' : 'Save'} onClick={(e) => handleFavoriteClick(e, recipe.documentId, recipe.id)} />}
                                    onClick={() => handleCardClick(recipe.documentId)}
                                />
                                )
                            })
                        }
                        </div>
                    }

                    {
                        (!isLoading && recipes.length === 0) && (
                            <Text color='primary' view="p-18">No recipes found</Text>
                        )
                    }
                </InfiniteScroll>

                <ScrollToTop />
            </section>
        </div>

    );
})

export default RecipesList;