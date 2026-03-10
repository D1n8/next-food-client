import { BASE_URL } from "@shared/consts";
import axios from "axios";
import { action, computed, makeObservable, observable, runInAction } from "mobx";
import type { Category } from "@shared/store/models/recipe";
import { Meta } from "@shared/types/shared";

type PrivateFields = '_list' | '_meta'

export default class CategoryStore {
    private _list: Category[] = []
    private _meta: Meta = Meta.Initial

    constructor() {
        makeObservable<CategoryStore, PrivateFields>(this, {
            _list: observable,
            _meta: observable,
            fetchCategoryList: action,
            list: computed,
            meta: computed
        })
    }

    get list() {
        return this._list
    }

    get meta() {
        return this._meta
    }

    async fetchCategoryList() {
        this._meta = Meta.Loading
        try {
            const response = await axios({
                method: "GET",
                url: `${BASE_URL}/meal-categories`
            })

            runInAction(() => {
                if (!response.data || !response.data.data) {
                    this._meta = Meta.Error
                    return
                }

                this._list = [...response.data.data]
                this._meta = Meta.Success
            })
        } catch {
            this._meta = Meta.Error
        }
    }
}