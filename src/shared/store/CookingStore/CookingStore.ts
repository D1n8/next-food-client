import { makeObservable, observable, action, computed, runInAction } from 'mobx'
import { type ILocalStore } from '@shared/types/shared'

export type TimerState = {
    id: string
    initialDuration: number
    remainingTime: number
    isActive: boolean
    isFinished: boolean
    label: string
}

type PrivateFields = '_currentStepIndex' | '_timers' | '_steps'

export default class CookingStore implements ILocalStore {
    private _currentStepIndex: number = 0
    private _timers: TimerState[] = []
    private _steps: string[] = []
    private _intervalId: ReturnType<typeof setInterval> | null = null

    constructor(steps: string[]) {
        this._steps = steps
        makeObservable<CookingStore, PrivateFields>(this, {
            _currentStepIndex: observable,
            _timers: observable,
            _steps: observable,
            currentStepIndex: computed,
            currentStep: computed,
            totalSteps: computed,
            timers: computed,
            nextStep: action,
            prevStep: action,
            startTimer: action,
            pauseTimer: action,
            resetTimer: action,
            tick: action,
        })
    }

    get currentStepIndex() {
        return this._currentStepIndex
    }

    get currentStep() {
        return this._steps[this._currentStepIndex] ?? ''
    }

    get totalSteps() {
        return this._steps.length
    }

    get timers() {
        return this._timers
    }

    nextStep() {
        if (this._currentStepIndex < this._steps.length - 1) {
            this._currentStepIndex++
        }
    }

    prevStep() {
        if (this._currentStepIndex > 0) {
            this._currentStepIndex--
        }
    }

    startTimer(id: string, durationSeconds: number, label: string) {
        const existing = this._timers.find(t => t.id === id)
        if (existing) {
            existing.isActive = true
            existing.isFinished = false
            return
        }
        this._timers.push({
            id,
            initialDuration: durationSeconds,
            remainingTime: durationSeconds,
            isActive: true,
            isFinished: false,
            label,
        })
    }

    pauseTimer(id: string) {
        const timer = this._timers.find(t => t.id === id)
        if (timer) timer.isActive = false
    }

    resetTimer(id: string) {
        const timer = this._timers.find(t => t.id === id)
        if (timer) {
            timer.remainingTime = timer.initialDuration
            timer.isActive = false
            timer.isFinished = false
        }
    }

    tick() {
        for (const timer of this._timers) {
            if (!timer.isActive || timer.remainingTime <= 0) continue
            timer.remainingTime -= 1
            if (timer.remainingTime === 0) {
                timer.isActive = false
                timer.isFinished = true
            }
        }
    }

    startTickInterval() {
        if (this._intervalId !== null) return
        this._intervalId = setInterval(() => {
            runInAction(() => this.tick())
        }, 1000)
    }

    stopTickInterval() {
        if (this._intervalId !== null) {
            clearInterval(this._intervalId)
            this._intervalId = null
        }
    }

    destroy() {
        this.stopTickInterval()
    }
}
