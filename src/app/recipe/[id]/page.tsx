'use client'
import styles from './Recipe.module.scss'
import { useCallback, useEffect } from "react";
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
import parse from 'html-react-parser';
import Image from 'next/image';

const Recipe = observer(() => {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string

    const store = useLocalStore(() => new RecipeStore())

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
                    <Text tag="h3" view='p-20' color='primary' className={styles.subtitle}>Ingredients</Text>
                    <ul className={styles.ingredientsList}>
                        {
                            recipe.ingredients.map(ingredient =>
                                <Ingredient key={ingredient.id} {...ingredient} />
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
                <Text tag="h3" view='p-20' color='primary' className={styles.subtitle}>Directions</Text>
                <ul className={styles.directionsList}>
                    {
                        recipe.directions.map((direction, index) =>
                            <Direction key={direction.id} step={index + 1} text={direction.description} />
                        )
                    }
                </ul>
            </div>
        </div>
    );
})

export default Recipe;