'use client'
import styles from './Recipe.module.scss'
import { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import RecipeStore from "@shared/store/RecipeStore";
import { useLocalStore } from "@shared/hooks";
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
import Ingredient from "@components/Ingredient";
import Equipment from "@components/Equipment";
import Direction from "@components/Direction";
import ArrowBack from "@components/Icons/ArrowBack";
import AboutItem from "@components/AboutItem";
import Loader from "@components/Loader";
import Text from "@components/Text";
import ServingsCounter from "@components/ServingsCounter";
import Button from "@components/Button";
import InteractiveChefView from "@components/InteractiveChefView";
import { useRootStore } from '@/shared/store/RootStore';
import parse from 'html-react-parser';
import Image from 'next/image';
import classNames from 'classnames';

const Recipe = observer(() => {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string

    const store = useLocalStore(() => new RecipeStore())
    const { shoppingStore } = useRootStore()

    useEffect(() => {
        if (id) {
            store.getRecipe(id)
        }

        return () => store.clearRecipe()
    }, [id, store])

    const handleBack = useCallback(() => {
        router.back()
    }, [router])

    const isLoading = store.meta === 'loading'
    const isError = store.meta === 'error'
    const recipe = store.recipe ? toJS(store.recipe) : null

    const [currentServings, setCurrentServings] = useState<number | null>(null)
    const [isChefModeOpen, setIsChefModeOpen] = useState(false)
    const [addedToList, setAddedToList] = useState(false)
    const servings = currentServings ?? recipe?.servings ?? 1
    const ratio = recipe ? servings / recipe.servings : 1

    const handleAddToShoppingList = useCallback(() => {
        if (!recipe) return
        shoppingStore.addIngredients(
            recipe.ingredients.map(i => ({
                name: i.name,
                amount: parseFloat((i.amount * ratio).toFixed(2)),
                unit: i.unit,
            }))
        )
        setAddedToList(true)
    }, [recipe, ratio, shoppingStore])

    if (isLoading) {
        return (
            <div className={styles.loaderContainer}>
                <Loader size='l' />
            </div>)
    }

    if (isError) {
        return (
            <div className={styles.recipePage}>
                <Text view="p-18" color="primary">Error loading recipe</Text>
            </div>
        )
    }

    if (!recipe) {
        return null
    }

    return (
        <div className={styles.recipePage}>
            <div className={styles.topContainer}>
                <button className={styles.btn} type="button" onClick={handleBack} >
                    <ArrowBack />
                </button>

                <Text className={styles.title} color='primary' tag='h2' view='title'>{recipe.name}</Text>
            </div>

            <div className={styles.about}>
                <Image
                    className={styles.aboutImg}
                    width={450}
                    height={300}
                    src={recipe.images[0].url}
                    alt={recipe.name} />

                <div className={styles.aboutContent}>
                    <AboutItem name='Perparation' value={`${recipe.preparationTime} minutes`} />
                    <AboutItem name='Cooking' value={`${recipe.preparationTime} minutes`} />
                    <AboutItem name='Total' value={`${recipe.preparationTime} minutes`} />
                    <AboutItem name='Likes' value={`${recipe.likes}`} />
                    <AboutItem name='Servings' value={`${recipe.servings} servings`} />
                    <AboutItem name='Ratings' value={`${recipe.rating} / 5`} />
                </div>
            </div>


            <Text className={styles.descr} color='primary' tag="p" view="p-16">{parse(recipe.summary)}</Text>

            <div className={styles.thingsContainer}>
                <div className={styles.ingredients}>
                    <div className={styles.ingredientsHeader}>
                        <Text
                            tag="h3"
                            view='p-20'
                            color='primary'
                            className={classNames(styles.subtitle, styles.ingsSubtitle)}>
                            Ingredients for <ServingsCounter value={servings} onChange={setCurrentServings} /> servings
                        </Text>
                        <Button className={styles.addToShopList} onClick={handleAddToShoppingList}>
                            {addedToList ? 'Added' : 'Add to shopping list'}
                        </Button>
                    </div>
                    <ul className={styles.ingredientsList}>
                        {
                            recipe.ingredients.map(ingredient =>
                                <Ingredient
                                    key={ingredient.id}
                                    {...ingredient}
                                    amount={parseFloat((ingredient.amount * ratio).toFixed(2))}
                                />
                            )
                        }
                    </ul>
                </div>

                <div className={styles.equipments}>
                    <Text tag="h3" view='p-20' color='primary' className={styles.subtitle}>Equipment</Text>
                    <ul className={styles.equipmentsList}>
                        {
                            recipe.equipments.map(equipment =>
                                <Equipment key={equipment.id} {...equipment} />
                            )
                        }
                    </ul>
                </div>
            </div>

            <div className={styles.directions}>
                <div className={styles.directionsHeader}>
                    <Text tag="h3" view='p-20' color='primary' className={styles.dirTitle}>Directions</Text>
                    <Button className={styles.startCooking} onClick={() => setIsChefModeOpen(true)}>
                        Start Cooking
                    </Button>
                </div>
                <ul className={styles.directionsList}>
                    {
                        recipe.directions.map((direction, index) =>
                            <Direction key={direction.id} step={index + 1} text={direction.description} />
                        )
                    }
                </ul>
            </div>

            <InteractiveChefView
                isOpen={isChefModeOpen}
                onClose={() => setIsChefModeOpen(false)}
                directions={recipe.directions}
            />
        </div>
    );
})

export default Recipe;