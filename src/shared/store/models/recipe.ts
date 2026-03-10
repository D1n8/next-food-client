type Image = {
    id: number,
    url: string,
    formats: {
        medium?: {
            url: string
        },
        small: {
            url: string
        }
    }
}

type Equipment = {
    id: number,
    name: string
}

type Direction = {
    id: number,
    description: string,
    image?: string
}

export type Category = {
    id: number,
    documentId: string,
    title: string,
    createdAt: string,
    updatedAt: string,
    publishedAt: string
}

export type Ingredient = {
    id: number,
    name: string,
    amount: number,
    unit: string
}

export interface IRecipeApi {
    id: number,
    documentId: string,
    calories: number,
    totalTime: number,
    rating: number,
    name: string,
    summary: string,
    images: Image[],
    ingradients: Ingredient[]
}

export interface IRecipeModel {
    id: number,
    documentId: string,
    calories: number,
    totalTime: number,
    rating: number,
    name: string,
    summary: string,
    images: Image[],
    ingredients: Ingredient[]
}

export const normalizeRecipe = (form: IRecipeApi): IRecipeModel => ({
    id: form.id,
    documentId: form.documentId,
    calories: form.calories,
    totalTime: form.totalTime,
    rating: form.rating,
    name: form.name,
    summary: form.summary,
    images: form.images,
    ingredients: form.ingradients
})


export interface IFullRecipeApi extends IRecipeApi {
    likes: number,
    servings: number,
    rating: number,
    preparationTime: number,
    cookingTime: number,
    ingradients: Ingredient[],
    equipments: Equipment[],
    directions: Direction[],
    category: Category
}

export interface IFullRecipeModel extends IRecipeModel {
    likes: number,
    servings: number,
    rating: number,
    preparationTime: number,
    cookingTime: number,
    ingredients: Ingredient[],
    equipments: Equipment[],
    directions: Direction[],
    category: Category
}

export const normalizeFullRecipe = (form: IFullRecipeApi): IFullRecipeModel => ({
    id: form.id,
    documentId: form.documentId,
    calories: form.calories,
    totalTime: form.totalTime,
    name: form.name,
    summary: form.summary,
    images: form.images,
    ingredients: form.ingradients,
    likes: form.likes,
    servings: form.servings,
    rating: form.rating,
    preparationTime: form.preparationTime,
    cookingTime: form.cookingTime,
    equipments: form.equipments,
    directions: form.directions,
    category: form.category
})

export interface IFavoriteApi {
    id: number,
    documentId: string,
    originalRecipeId: number,
    recipe: IRecipeApi
}

export interface IFavoriteModel {
    id: number,
    documentId: string,
    originalRecipeId: number,
    recipe: IRecipeModel
}