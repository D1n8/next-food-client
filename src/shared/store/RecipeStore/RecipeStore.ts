import { BASE_URL } from "@shared/consts";
import axios from "axios";
import { action, computed, makeObservable, observable, runInAction } from "mobx";
import qs from "qs";
import { Meta, type ILocalStore } from "@shared/types/shared";
import { normalizeFullRecipe, type IFullRecipeModel } from "@shared/store/models/recipe";

type PrivateFields = '_recipe' | '_meta'

export default class RecipeStore implements ILocalStore {
    private _recipe: IFullRecipeModel | null = null
    private _meta: Meta = Meta.Initial

    constructor() {
        makeObservable<RecipeStore, PrivateFields>(this, {
            _recipe: observable,
            _meta: observable,
            getRecipe: action,
            clearRecipe: action,
            recipe: computed,
            meta: computed
        })
    }

    get recipe() {
        return this._recipe
    }

    get meta() {
        return this._meta
    }

    async getRecipe(id: string) {
        this._meta = Meta.Loading
        this._recipe = null
        try {
            const response = await axios({
                method: "GET",
                url: `${BASE_URL}/recipes/${id}`,
                params: { populate: ['ingradients', 'equipments', 'directions.image', 'images', 'category'] },
                paramsSerializer: params => qs.stringify(params, { arrayFormat: 'indices' })
            })
            runInAction(() => {
                this._recipe = normalizeFullRecipe(response.data.data)
                this._meta = Meta.Success
            })
        } catch {
            this._meta = Meta.Error
        }
    }

    clearRecipe() {
        this._recipe = null
        this._meta = Meta.Initial
    }

    destroy() {
        this.clearRecipe()
    }
}