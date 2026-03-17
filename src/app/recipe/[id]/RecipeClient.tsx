'use client'
import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import parse from 'html-react-parser'
import classNames from 'classnames'
import Ingredient from '@components/Ingredient'
import Equipment from '@components/Equipment'
import Direction from '@components/Direction'
import ArrowBack from '@components/Icons/ArrowBack'
import AboutItem from '@components/AboutItem'
import Text from '@components/Text'
import ServingsCounter from '@components/ServingsCounter'
import Button from '@components/Button'
import InteractiveChefView from '@components/InteractiveChefView'
import { useRootStore } from '@/shared/store/RootStore'
import { IFullRecipeModel } from '@shared/store/models/recipe'
import styles from './Recipe.module.scss'

type RecipeClientProps = {
  recipe: IFullRecipeModel
}

const RecipeClient: React.FC<RecipeClientProps> = ({ recipe }) => {
  const router = useRouter()
  const { shoppingStore } = useRootStore()

  const handleBack = useCallback(() => {
    router.back()
  }, [router])

  const [currentServings, setCurrentServings] = useState<number | null>(null)
  const [isChefModeOpen, setIsChefModeOpen] = useState(false)
  const [addedToList, setAddedToList] = useState(false)

  const servings = currentServings ?? recipe.servings ?? 1
  const ratio = servings / recipe.servings

  const handleAddToShoppingList = useCallback(() => {
    shoppingStore.addIngredients(
      recipe.ingredients.map(i => ({
        name: i.name,
        amount: parseFloat((i.amount * ratio).toFixed(2)),
        unit: i.unit,
      }))
    )
    setAddedToList(true)
  }, [recipe.ingredients, ratio, shoppingStore])

  return (
    <div className={styles.recipePage}>
      <div className={styles.topContainer}>
        <button className={styles.btn} type="button" onClick={handleBack}>
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
          alt={recipe.name}
        />

        <div className={styles.aboutContent}>
          <AboutItem name='Perparation' value={`${recipe.preparationTime} minutes`} />
          <AboutItem name='Cooking' value={`${recipe.cookingTime} minutes`} />
          <AboutItem name='Total' value={`${recipe.preparationTime + recipe.cookingTime} minutes`} />
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
            {recipe.ingredients.map(ingredient =>
              <Ingredient
                key={ingredient.id}
                {...ingredient}
                amount={parseFloat((ingredient.amount * ratio).toFixed(2))}
              />
            )}
          </ul>
        </div>

        <div className={styles.equipments}>
          <Text tag="h3" view='p-20' color='primary' className={styles.subtitle}>Equipment</Text>
          <ul className={styles.equipmentsList}>
            {recipe.equipments.map(equipment =>
              <Equipment key={equipment.id} {...equipment} />
            )}
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
          {recipe.directions.map((direction, index) =>
            <Direction key={direction.id} step={index + 1} text={direction.description} />
          )}
        </ul>
      </div>

      <InteractiveChefView
        isOpen={isChefModeOpen}
        onClose={() => setIsChefModeOpen(false)}
        directions={recipe.directions}
      />
    </div>
  )
}

export default RecipeClient