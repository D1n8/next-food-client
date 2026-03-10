import IngredientIcon from '@components/Icons/IngredientIcon';
import styles from './Ingredient.module.scss'
import Text from '@components/Text';

type IngredientProp = {
    name: string,
    amount: number,
    unit: string
}

function Ingredient({ name, amount, unit }: IngredientProp) {
    return (
        <li className={styles.ingredient}>
            <IngredientIcon/>
            <Text view='p-16' color='primary'>{amount} {unit} {name}</Text>
        </li>
    );
}

export default Ingredient;  