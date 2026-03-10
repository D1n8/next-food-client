import { BASE_URL } from '@shared/consts'
import axios from "axios";
import { action, computed, makeObservable, observable, runInAction } from "mobx";
import qs from "qs";
import { normalizeRecipe, type IRecipeApi, type IRecipeModel } from "../models/recipe";
import { Meta } from "../../types/shared";

type PrivateFields = '_list' | '_meta' | '_hasMore' | '_selectedCategories'

export default class RecipeListStore {
    private _list: IRecipeModel[] = []
    private _meta: Meta = Meta.Initial
    private _searchQuery: string = ''
    private _isVegetarian: boolean = false
    private _sort: string = ''
    private _page: number = 1
    private _hasMore: boolean = true
    private _pageSize: number = 6
    private _selectedCategories: string[] = []

    constructor(initialData?: IRecipeModel[]) {
        makeObservable<RecipeListStore, PrivateFields>(this, {
            _list: observable,
            _meta: observable,
            _hasMore: observable,
            _selectedCategories: observable,

            fetchRecipeList: action,
            loadMore: action,

            list: computed,
            meta: computed,
            hasMore: computed
        });

        if (initialData && initialData.length > 0) {
            this._list = initialData;
            this._meta = Meta.Success;
            this._page = 2;
            this._hasMore = initialData.length === this._pageSize;
        }
    }

    get list(): IRecipeModel[] {
        return this._list
    }

    get meta(): Meta {
        return this._meta
    }

    get hasMore(): boolean {
        return this._hasMore
    }

    loadMore = () => {
        this.fetchRecipeList(this._searchQuery, this._selectedCategories, this._sort, this._isVegetarian, true)
    }

    async fetchRecipeList(searchQuery: string = '', categories: string[] = [], sort: string = '', isVegetarian: boolean = false, isLoadMore = false) {
        if (this._meta === 'loading') return

        if (!isLoadMore) {
            this._meta = Meta.Loading
            this._page = 1
            this._hasMore = true
            this._searchQuery = searchQuery
            this._selectedCategories = categories
            this._sort = sort
            this._isVegetarian = isVegetarian
        }

        const queryParams: any = {
            populate: ['images', 'ingradients'],
            pagination: {
                page: this._page,
                pageSize: this._pageSize
            },
            filters: {},
            sort: ''
        }

        if (this._searchQuery) {
            queryParams.filters.name = { $containsi: this._searchQuery }
        }

        if (this._selectedCategories.length > 0) {
            queryParams.filters.category = {
                id: {
                    $in: this._selectedCategories
                }
            }
        }

        if (this._isVegetarian) {
            queryParams.filters.vegetarian = {
                $eq: 'true'
            }
        }

        if (this._sort) {
            queryParams.sort = this._sort
        }

        try {
            const response = await axios({
                method: "GET",
                url: `${BASE_URL}/recipes`,
                params: queryParams,
                paramsSerializer: params => qs.stringify(params, { arrayFormat: 'indices' })
            })

            runInAction(() => {
                if (!response.data || !response.data.data) {
                    this._meta = Meta.Error
                    return
                }

                const newRecipes = response.data.data.map((item: IRecipeApi) => normalizeRecipe(item))

                if (newRecipes.length < this._pageSize) {
                    this._hasMore = false
                }

                this._meta = Meta.Success

                if (isLoadMore) {
                    this._list = [...this._list, ...newRecipes]
                } else {
                    this._list = newRecipes
                }

                this._page += 1
            })
        } catch {
            runInAction(() => {
                this._meta = Meta.Error
                if (!isLoadMore) this._list = []
            })
        }
    }
}