import Button from '@components/Button';
import styles from './BurgerButton.module.scss'

function BurgerButton({...props}) {
    return ( 
        <Button {...props} className={styles.burger}>
            <span className={styles.line}></span>
            <span className={styles.line}></span>
            <span className={styles.line}></span>
        </Button>
     );
}

export default BurgerButton;