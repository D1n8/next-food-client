import styles from './Direction.module.scss'
import Text from '@components/Text'

type DirectionProps = {
    step: number,
    text: string
}

function Direction({step, text}: DirectionProps) {
    return ( 
        <li className={styles.direction}>
            <Text view='p-16' color='primary' className={styles.step}>Step {step}</Text>
            <Text view='p-14' color='primary' className={styles.text}>{text}</Text>
        </li>
     );
}

export default Direction;