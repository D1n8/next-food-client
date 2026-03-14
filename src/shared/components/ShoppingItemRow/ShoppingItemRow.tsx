import classNames from "classnames"
import { observer } from "mobx-react-lite"
import { useCallback, useRef } from "react"
import CheckBox from "@components/CheckBox"
import Text from "@components/Text"
import { ShoppingItem } from "@/shared/store/ShoppingStore"
import styles from './ShoppingItemRow.module.scss'
import Close from "@/shared/components/CloseButton"

const ShoppingItemRow = observer(({ item, onToggle, onRemove, onUpdate }: {
    item: ShoppingItem
    onToggle: (id: string) => void
    onRemove: (id: string) => void
    onUpdate: (id: string, changes: Partial<Pick<ShoppingItem, 'name' | 'amount'>>) => void
}) => {
    const nameRef = useRef<HTMLInputElement>(null)
    const amountRef = useRef<HTMLInputElement>(null)

    const handleNameBlur = useCallback(() => {
        const val = nameRef.current?.value.trim()
        if (val && val !== item.name) onUpdate(item.id, { name: val })
    }, [item.id, item.name, onUpdate])

    const handleAmountBlur = useCallback(() => {
        const val = parseFloat(amountRef.current?.value ?? '')
        if (!isNaN(val) && val > 0 && val !== item.amount) onUpdate(item.id, { amount: val })
    }, [item.id, item.amount, onUpdate])

    const handleAmountKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') amountRef.current?.blur()
    }, [])

    const handleNameKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') nameRef.current?.blur()
    }, [])

    return (
        <li className={classNames(styles.item, item.isBought && styles.itemBought)}>
            <CheckBox
                checked={item.isBought}
                onChange={() => onToggle(item.id)}
            />
            <input
                ref={nameRef}
                className={classNames(styles.nameInput, item.isBought && styles.inputBought)}
                defaultValue={item.name}
                key={item.name}
                onBlur={handleNameBlur}
                onKeyDown={handleNameKeyDown}
            />
            <div className={styles.amountWrap}>
                <input
                    ref={amountRef}
                    className={classNames(styles.amountInput, item.isBought && styles.inputBought)}
                    type="number"
                    defaultValue={item.amount}
                    key={item.amount}
                    min={0.01}
                    step="any"
                    onBlur={handleAmountBlur}
                    onKeyDown={handleAmountKeyDown}
                />
                {item.unit && (
                    <Text view="p-14" color="secondary" className={styles.unit}>{item.unit}</Text>
                )}
            </div>

            <Close className={styles.closeBtn} onClick={() => onRemove(item.id)} />
        </li>
    )
})

export default ShoppingItemRow;