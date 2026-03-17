import { BASE_URL } from '@shared/consts'
import { normalizeFullRecipe, IFullRecipeModel } from '@shared/store/models/recipe'
import qs from 'qs'

export async function getRecipe(id: string): Promise<IFullRecipeModel> {
  const params = {
    populate: ['ingradients', 'equipments', 'directions.image', 'images', 'category']
  }

  const queryString = qs.stringify(params, { arrayFormat: 'indices' })

  const res = await fetch(`${BASE_URL}/recipes/${id}?${queryString}`, {
    cache: 'no-store'
  })

  if (!res.ok) {
    throw new Error('Failed to fetch recipe')
  }

  const json = await res.json()
  return normalizeFullRecipe(json.data)
}