import styles from './AboutItem.module.scss'
import Text from '@components/Text';

type AboutItemProps = {
    name: string,
    value: string
}

function AboutItem({name, value}: AboutItemProps) {
    return ( 
        <div className={styles.aboutItem}>
            <Text view='p-16' color='primary'>{name}</Text>
            <Text view='p-16' className={styles.value} color='accent'>{value}</Text>
        </div>
     );
}

export default AboutItem;