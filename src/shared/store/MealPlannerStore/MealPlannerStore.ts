import { makeObservable, observable, action, reaction, computed, toJS } from 'mobx'
import { startOfWeek, addDays, format } from 'date-fns'
import { IRecipeModel } from '../models/recipe'
import ShoppingStore from '../ShoppingStore'

const STORAGE_KEY = 'meal-plan'

export type MealPlan = Record<string, IRecipeModel[]>

type PrivateFields = '_mealPlan' | '_isHydrated' | '_currentWeekStart'

export default class MealPlannerStore {
    private _mealPlan: MealPlan = {}
    private _isHydrated: boolean = false
    private _currentWeekStart: Date = startOfWeek(new Date(), { weekStartsOn: 1 })

    constructor() {
        makeObservable<MealPlannerStore, PrivateFields>(this, {
            _mealPlan: observable,
            _isHydrated: observable,
            _currentWeekStart: observable,
            mealPlan: computed,
            isHydrated: computed,
            currentWeekStart: computed,
            weekDates: computed,
            init: action,
            addRecipeToDate: action,
            removeRecipeFromDate: action,
            moveRecipe: action,
            setCurrentWeekStart: action,
        })
    }

    get mealPlan() { return this._mealPlan }
    get isHydrated() { return this._isHydrated }
    get currentWeekStart() { return this._currentWeekStart }

    get weekDates(): string[] {
        const dates: string[] = []
        for (let i = 0; i < 7; i++) {
            const date = addDays(this._currentWeekStart, i)
            dates.push(format(date, 'yyyy-MM-dd'))
        }
        return dates
    }

    getRecipesForDate(date: string): IRecipeModel[] {
        return this._mealPlan[date] || []
    }

    addRecipeToDate(date: string, recipe: IRecipeModel) {
        if (!this._mealPlan[date]) {
            this._mealPlan[date] = []
        }
        const exists = this._mealPlan[date].some(r => r.id === recipe.id)
        if (!exists) {
            this._mealPlan[date].push(recipe)
        }
    }

    removeRecipeFromDate(date: string, recipeId: number) {
        if (this._mealPlan[date]) {
            this._mealPlan[date] = this._mealPlan[date].filter(r => r.id !== recipeId)
        }
    }

    moveRecipe(fromDate: string, toDate: string, recipeId: number) {
        const recipe = this._mealPlan[fromDate]?.find(r => r.id === recipeId)
        if (!recipe) return

        this.removeRecipeFromDate(fromDate, recipeId)
        this.addRecipeToDate(toDate, recipe)
    }

    setCurrentWeekStart(date: Date) {
        this._currentWeekStart = startOfWeek(date, { weekStartsOn: 1 })
    }

    getAllIngredientsForWeek(): { name: string; amount: number; unit: string }[] {
        const ingredientMap = new Map<string, { name: string; amount: number; unit: string }>()

        for (const date of this.weekDates) {
            const recipes = this.getRecipesForDate(date)
            for (const recipe of recipes) {
                const ingredients = recipe.ingredients
                if (!ingredients || !Array.isArray(ingredients)) continue
                for (const ing of ingredients) {
                    const key = `${ing.name.toLowerCase()}-${ing.unit}`
                    const existing = ingredientMap.get(key)
                    if (existing) {
                        existing.amount = parseFloat((existing.amount + ing.amount).toFixed(2))
                    } else {
                        ingredientMap.set(key, {
                            name: ing.name,
                            amount: ing.amount,
                            unit: ing.unit
                        })
                    }
                }
            }
        }

        return Array.from(ingredientMap.values())
    }

    syncIngredientsToShoppingList(shoppingStore: ShoppingStore) {
        const ingredients = this.getAllIngredientsForWeek()
        shoppingStore.addIngredients(ingredients)
    }

    init() {
        if (typeof window === 'undefined') return
        try {
            const raw = localStorage.getItem(STORAGE_KEY)
            if (raw) this._mealPlan = JSON.parse(raw)
        } catch {
            this._mealPlan = {}
        }
        this._isHydrated = true

        reaction(
            () => toJS(this._mealPlan),
            (mealPlan) => {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(mealPlan))
            }
        )
    }
}