'use client'
import React, { useState, useEffect, useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import classNames from 'classnames'
import styles from './InteractiveChefView.module.scss'
import Modal from '@components/Modal'
import Button from '@components/Button'
import Text from '@components/Text'
import CookingStore from '@shared/store/CookingStore'
import { parseTimesFromText, formatTime, playBeep } from './utils/parseTime'
import { useLocalStore } from '@/shared/hooks/useLocalStore'
import PlayButton from './components/PlayButton'
import PauseButton from './components/PauseButton'
import ResetButton from './components/ResetButton'
import CloseButton from '@components/CloseButton' 

export type InteractiveChefViewProps = {
    isOpen: boolean
    onClose: () => void
    directions: Array<{ id: number; description: string }>
}

const InteractiveChefView: React.FC<InteractiveChefViewProps> = observer(({ isOpen, onClose, directions }) => {
    const [showConfirmExit, setShowConfirmExit] = useState(false)
    const [notifiedTimers, setNotifiedTimers] = useState<Set<string>>(new Set())
    const [timerWarning, setTimerWarning] = useState<string | null>(null)

    const steps = useMemo(() => directions.map(d => d.description), [directions])
    const store = useLocalStore(() => new CookingStore(steps))

    useEffect(() => {
        if (isOpen) {
            store.startTickInterval()
        }
        return () => {
            store.stopTickInterval()
        }
    }, [isOpen, store])

    useEffect(() => {
        for (const timer of store.timers) {
            if (timer.isFinished && !notifiedTimers.has(timer.id)) {
                playBeep()
                setNotifiedTimers(prev => new Set(prev).add(timer.id))
            }
        }
    }, [store.timers, notifiedTimers])

    const handleClose = () => {
        const hasActiveTimers = store.timers.some(t => t.isActive || t.remainingTime < t.initialDuration)
        if (hasActiveTimers) {
            setShowConfirmExit(true)
        } else {
            onClose()
        }
    }

    const handleConfirmExit = () => {
        store.timers.forEach(t => store.deleteTimer(t.id))
        setShowConfirmExit(false)
        onClose()
    }

    const handleCancelExit = () => {
        setShowConfirmExit(false)
    }

    const parsedTimes = useMemo(() => {
        return parseTimesFromText(store.currentStep)
    }, [store.currentStep])

    const progress = store.totalSteps > 1
        ? (store.currentStepIndex / (store.totalSteps - 1)) * 100
        : 100

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={handleClose}
                className={styles.chefModal}
            >
                <div className={styles.container}>
                    <Text tag='h2' color='primary' className={styles.title}>Interactive Chef Mode</Text>

                    <div className={styles.progressContainer}>
                        <div className={styles.progressBar}>
                            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                        </div>
                        <Text view='p-16' color='secondary' className={styles.progressText}>
                            Step {store.currentStepIndex + 1} of {store.totalSteps}
                        </Text>
                    </div>

                    <div className={styles.stepContent}>
                        <Text className={styles.stepText}>{store.currentStep}</Text>

                        {timerWarning && (
                            <Text color='accent' view='p-16' className={styles.warning}>
                                {timerWarning}
                            </Text>
                        )}

                        {parsedTimes.length > 0 && (
                            <div className={styles.timerButtons}>
                                {parsedTimes.map(time => {
                                    const uniqueTimerId = `step-${store.currentStepIndex}-${time.id}`
                                    
                                    const existingTimer = store.timers.find(t => t.id === uniqueTimerId)
                                    const isActive = existingTimer?.isActive
                                    const isFinished = existingTimer?.isFinished

                                    return (
                                        <Button
                                            key={uniqueTimerId}
                                            className={classNames(styles.timerButton, {
                                                [styles.activeTimer]: isActive,
                                                [styles.finishedTimer]: isFinished,
                                            })}
                                            onClick={() => {
                                                if (isActive) {
                                                    store.pauseTimer(uniqueTimerId)
                                                } else {
                                                    if (!existingTimer && store.timers.length >= 2) {
                                                        setTimerWarning("You can only run 2 timers at the same time.")
                                                        setTimeout(() => setTimerWarning(null), 3000)
                                                        return
                                                    }
                                                    
                                                    const displayLabel = `Step ${store.currentStepIndex + 1}: ${time.label}`
                                                    store.startTimer(uniqueTimerId, time.seconds, displayLabel)
                                                }
                                            }}
                                        >
                                            {isActive ? 'Pause' : 'Start'} Timer ({time.label})
                                        </Button>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    {store.timers.length > 0 && (
                        <div className={styles.timersList}>
                            <Text tag='h3' view='p-18' color='primary' className={styles.timersTitle}>Active Timers</Text>
                            {store.timers.map(timer => (
                                <div
                                    key={timer.id}
                                    className={classNames(styles.timerItem, {
                                        [styles.timerFinished]: timer.isFinished,
                                    })}
                                >
                                    <Text color='secondary' className={styles.timerLabel}>{timer.label}</Text>
                                    
                                    <Text color='primary' view='p-20' className={classNames(styles.timerValue, {
                                        [styles.timerValueFinished]: timer.isFinished,
                                    })}>
                                        {formatTime(timer.remainingTime)}
                                    </Text>
                                    
                                    <div className={styles.timerControls}>
                                        {!timer.isFinished && (
                                            timer.isActive ?
                                                <PauseButton
                                                    className={styles.timerControlBtn}
                                                    onClick={() => store.pauseTimer(timer.id)}
                                                />
                                                :
                                                <PlayButton
                                                    className={styles.timerControlBtn}
                                                    onClick={() => store.startTimer(timer.id, timer.initialDuration, timer.label)}
                                                />
                                        )}
                                        <ResetButton
                                            type="button"
                                            className={styles.timerControlBtn}
                                            onClick={() => store.resetTimer(timer.id)}
                                        />
                                        
                                        <CloseButton 
                                            onClick={() => store.deleteTimer(timer.id)} 
                                        />
                                    </div>
                                    
                                    {timer.isFinished && (
                                        <Text className={styles.timerNotification}>Timer Done!</Text>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className={styles.navigation}>
                        <Button
                            className={classNames(styles.navButton, styles.moveButton)}
                            onClick={() => store.prevStep()}
                            disabled={store.currentStepIndex === 0}
                        >
                            Back
                        </Button>
                        <Button
                            className={classNames(styles.navButton, styles.moveButton)}
                            onClick={() => store.nextStep()}
                            disabled={store.currentStepIndex === store.totalSteps - 1}
                        >
                            Next Step
                        </Button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={showConfirmExit} onClose={handleCancelExit} showCloseButton={false} className={styles.confirmModal}>
                <div className={styles.confirmContent}>
                    <Text tag='h3' color='primary' view='p-20' className={styles.confirmTitle}>Exit Cooking Mode?</Text>
                    <Text color='secondary' view='p-16' className={styles.confirmText}>
                        You have active timers. Are you sure you want to exit? All timers will be reset.
                    </Text>
                    <div className={styles.confirmButtons}>
                        <Button onClick={handleCancelExit}>Cancel</Button>
                        <Button onClick={handleConfirmExit} className={styles.confirmExitBtn}>
                            Exit Anyway
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    )
})

export default InteractiveChefView