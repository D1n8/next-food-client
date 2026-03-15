export enum Meta {
    Initial = 'initial',
    Loading = 'loading',
    Error = 'error',
    Success = 'success'
}

export enum QueryParams {
    Name = 'name',
    SortBy = 'sort-by',
    Vegetarian = 'vegetarian',
    Categories = 'categories',
    IngredientsIncluded = 'ings-included',
    IngredientsExcluded = 'ings-exluded'
}

export enum LocalStorageItem { JWT = 'jwt' }

export interface ILocalStore {
    destroy(): void;
}