'use client'
import { Suspense, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useRootStore } from '@/shared/store/RootStore'
import Text from '@components/Text'
import Button from '@components/Button'
import styles from './ShoppingList.module.scss'
import ShoppingItemRow from '@/shared/components/ShoppingItemRow'
import Loader from '@/shared/components/Loader'

const ShoppingList = observer(() => {
    const { shoppingStore } = useRootStore()

    useEffect(() => {
        if (!shoppingStore.isHydrated) {
            shoppingStore.init()
        }
    }, [shoppingStore])

    if (!shoppingStore.isHydrated) {
        return null
    }

    const isEmpty = shoppingStore.totalCount === 0

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <Text tag="h2" view="title" color="primary">Shopping List</Text>
                {!isEmpty && (
                    <div className={styles.actions}>
                        {shoppingStore.boughtItems.length > 0 && (
                            <Button
                                onClick={() => shoppingStore.clearBought()}
                            >
                                Remove bought
                            </Button>
                        )}
                        <Button
                            className={styles.clearAllBtn}
                            onClick={() => shoppingStore.clearAll()}
                        >
                            Clear all
                        </Button>
                    </div>
                )}
            </div>

            {isEmpty ? (
                <div className={styles.empty}>
                    <Text view="p-18" color="secondary">
                        Your shopping list is empty. Go to a recipe and add ingredients!
                    </Text>
                </div>
            ) : (
                <div className={styles.lists}>
                    {shoppingStore.toBuyItems.length > 0 && (
                        <section>
                            <Text tag="h3" view="p-20" color="primary" className={styles.sectionTitle}>
                                To buy ({shoppingStore.toBuyItems.length})
                            </Text>
                            <ul className={styles.list}>
                                {shoppingStore.toBuyItems.map(item => (
                                    <ShoppingItemRow
                                        key={item.id}
                                        item={item}
                                        onToggle={shoppingStore.toggleBought.bind(shoppingStore)}
                                        onRemove={shoppingStore.removeItem.bind(shoppingStore)}
                                        onUpdate={shoppingStore.updateItem.bind(shoppingStore)}
                                    />
                                ))}
                            </ul>
                        </section>
                    )}

                    {shoppingStore.boughtItems.length > 0 && (
                        <section>
                            <Text tag="h3" view="p-20" color="primary" className={styles.sectionTitle}>
                                Bought ({shoppingStore.boughtItems.length})
                            </Text>
                            <ul className={styles.list}>
                                {shoppingStore.boughtItems.map(item => (
                                    <ShoppingItemRow
                                        key={item.id}
                                        item={item}
                                        onToggle={shoppingStore.toggleBought.bind(shoppingStore)}
                                        onRemove={shoppingStore.removeItem.bind(shoppingStore)}
                                        onUpdate={shoppingStore.updateItem.bind(shoppingStore)}
                                    />
                                ))}
                            </ul>
                        </section>
                    )}
                </div>
            )}
        </div>
    )
})

export default function ShoppingListPage() {
    return (
        <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}><Loader size='l' /></div>}>
            <ShoppingList/>
        </Suspense>
    )
}
