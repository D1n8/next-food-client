import styles from './RecipesList.module.scss'
import Text from '@components/Text'

function NotFound() {
    return (
        <div className={styles.listPageContainer}>
            <div className={styles.notFoundPage}>
                <Text color='primary' view='title'>404</Text>
                <Text color='primary'>Not Found</Text>
                <Text color='primary'>Could not find requested resource</Text>
            </div>
        </div>
    );
}

export default NotFound;