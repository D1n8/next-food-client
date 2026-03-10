import EquipmentIcon from '@components/Icons/EquipmentIcon';
import styles from './Equipment.module.scss'
import Text from '@components/Text';

type EquipmentProp = {
    name: string
}

function Equipment({ name }: EquipmentProp) {
    return (
        <li className={styles.equipment}>
            <EquipmentIcon/>
            <Text view='p-16' color='primary'>{name}</Text>
        </li>
    );
}

export default Equipment;