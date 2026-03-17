import { notFound } from 'next/navigation'

import { getRecipe } from '@shared/lib/serverRecipe'

import RecipeClient from './RecipeClient'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const recipe = await getRecipe(id)
    return {
      title: `${recipe.name} | Food App`,
      description: recipe.summary.replace(/<[^>]*>/g, '').slice(0, 160)
    }
  } catch {
    return { title: 'Recipe not found' }
  }
}

export default async function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  let recipe = null
  try {
    recipe = await getRecipe(id)
  } catch {
  }

  if (!recipe) {
    notFound()
  }

  return <RecipeClient recipe={recipe} />
}