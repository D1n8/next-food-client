import { BASE_URL } from "@shared/consts"
import axios from "axios"
import { action, computed, makeObservable, observable, runInAction } from "mobx"
import qs from "qs"
import { LocalStorageItem, type ILocalStore } from "@shared/types/shared"
import { type IFavoriteModel, type IFavoriteApi, normalizeRecipe } from "@shared/store/models/recipe"

type PrivateFields = '_favorites' | '_isLoading'

export default class FavoritesStore implements ILocalStore {
    private _favorites: IFavoriteModel[] = []
    private _isLoading: boolean = false

    constructor() {
        makeObservable<FavoritesStore, PrivateFields>(this, {
            _favorites: observable,
            _isLoading: observable,
            fetchFavorites: action,
            addToFavorites: action,
            removeFromFavorites: action,
            favorites: computed,
            isLoading: computed,
            favoritesDocIds: computed
        })
    }

    get favorites(): IFavoriteModel[] {
        return this._favorites
    }

    get isLoading(): boolean {
        return this._isLoading
    }

    get favoritesDocIds(): Set<string> {
        return new Set(this._favorites.map(item => item.recipe.documentId))
    }

    destroy() {}

    async fetchFavorites() {
        this._isLoading = true
        try {
            const response = await axios.get<IFavoriteApi[]>(`${BASE_URL}/favorites`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem(LocalStorageItem.JWT)}`
                    },
                    params: {
                        populate: ['images', 'ingradients'],
                    },
                    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'indices' })
                })
            runInAction(() => {
                this._isLoading = false
                this._favorites = response.data.map(
                    item => {
                        return {
                            id: item.id,
                            documentId: item.documentId,
                            originalRecipeId: item.originalRecipeId,
                            recipe: normalizeRecipe(item.recipe)
                        }
                    }
                )
            })
        } catch (error) {
            this._isLoading = false
            console.error(error)
        }
    }

    async addToFavorites(id: number) {
        this._isLoading = true
        try {
            await axios.post(`${BASE_URL}/favorites/add`,
                { recipe: id },
                { headers: { 'Authorization': `Bearer ${localStorage.getItem(LocalStorageItem.JWT)}` } }
            )

            await this.fetchFavorites()
        } catch {
            this._isLoading = false
            console.error('Adding error')
        }
    }

    async removeFromFavorites(id: number) {
        this._isLoading = true
        try {
            await axios.post(`${BASE_URL}/favorites/remove`,
                { recipe: id },
                { headers: { 'Authorization': `Bearer ${localStorage.getItem(LocalStorageItem.JWT)}` } }
            )

            await this.fetchFavorites()
        } catch {
            this._isLoading = false
            console.error('Removing error')
        }
    }
}