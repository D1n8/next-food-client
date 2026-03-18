import Loader from '@components/Loader' 
import styles from './Recipe.module.scss'

export default function RecipeLoading() {
  return (
    <div className={styles.loaderContainer}>
      <Loader size="l" />
    </div>
  )
}