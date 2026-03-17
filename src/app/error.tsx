'use client'
import styles from './RecipesList.module.scss'
import Text from '@components/Text';

function Error() {
    return ( 
        <div className={styles.listPageContainer}>
            <div className={styles.errorPage}>
                <Text color='primary' view='title'>Something went wrong</Text>
            </div>
        </div>
     );
}

export default Error;