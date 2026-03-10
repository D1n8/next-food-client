import Clock from '@components/Icons/Clock';
import Text from '@components/Text'
import styles from './CaptionSlot.module.scss'
import Star from '@components/Icons/Star';
import { memo } from 'react';

type CaptionSlot = {
    totalTime: number,
    rating: number
}

const CaptionSlot = memo(({totalTime, rating}: CaptionSlot) => {
    return (
        <>
            <div className={styles.clock}>
                <Clock />
                <Text color='secondary'>{totalTime} minutes</Text>
            </div>
            <div className={styles.rating}>
                <Star />
                <Text color='secondary' view='p-16'>{rating}</Text>
            </div>
        </>
    );
})

export default CaptionSlot;