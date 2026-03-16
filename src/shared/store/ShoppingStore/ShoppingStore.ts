import { makeObservable, observable, action, computed, reaction, toJS } from 'mobx'

export type ShoppingItem = {
    id: string
    name: string
    amount: number
    unit: string
    isBought: boolean
}

const STORAGE_KEY = 'shopping-list'

type PrivateFields = '_items' | '_isHydrated'

export default class ShoppingStore {
    private _items: ShoppingItem[] = []
    private _isHydrated: boolean = false

    constructor() {
        makeObservable<ShoppingStore, PrivateFields>(this, {
            _items: observable,
            _isHydrated: observable,
            items: computed,
            isHydrated: computed,
            toBuyItems: computed,
            boughtItems: computed,
            totalCount: computed,
            init: action,
            addIngredients: action,
            removeItem: action,
            toggleBought: action,
            updateItem: action,
            clearBought: action,
            clearAll: action,
        })
    }

    get items() { return this._items }
    get isHydrated() { return this._isHydrated }
    get toBuyItems() { return this._items.filter(i => !i.isBought) }
    get boughtItems() { return this._items.filter(i => i.isBought) }
    get totalCount() { return this._items.length }

    init() {
        if (typeof window === 'undefined') return
        try {
            const raw = localStorage.getItem(STORAGE_KEY)
            if (raw) this._items = JSON.parse(raw)
        } catch {
            this._items = []
        }
        this._isHydrated = true

        reaction(
            () => toJS(this._items),
            (items) => {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
            }
        )
    }

    addIngredients(ingredients: Array<{ name: string; amount: number; unit: string }>) {
        for (const ing of ingredients) {
            const existing = this._items.find(
                i => i.name.toLowerCase() === ing.name.toLowerCase() && i.unit === ing.unit
            )
            if (existing) {
                existing.amount = parseFloat((existing.amount + ing.amount).toFixed(2))
            } else {
                this._items.push({
                    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
                    name: ing.name,
                    amount: ing.amount,
                    unit: ing.unit,
                    isBought: false,
                })
            }
        }
    }

    removeItem(id: string) {
        this._items = this._items.filter(i => i.id !== id)
    }

    toggleBought(id: string) {
        const item = this._items.find(i => i.id === id)
        if (item) item.isBought = !item.isBought
    }

    updateItem(id: string, changes: Partial<Pick<ShoppingItem, 'name' | 'amount'>>) {
        const item = this._items.find(i => i.id === id)
        if (item) Object.assign(item, changes)
    }

    clearBought() {
        this._items = this._items.filter(i => !i.isBought)
    }

    clearAll() {
        this._items = []
    }
}
