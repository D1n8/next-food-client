export type ParsedTime = {
    id: string
    label: string
    seconds: number
}

const TIME_REGEX = /(\d+)\s*(hours?|hrs?|minutes?|mins?|seconds?|secs?)/gi

export function parseTimesFromText(text: string): ParsedTime[] {
    const results: ParsedTime[] = []
    const regex = new RegExp(TIME_REGEX.source, 'gi')
    let match: RegExpExecArray | null
    let index = 0

    while ((match = regex.exec(text)) !== null) {
        const value = parseInt(match[1], 10)
        const unit = match[2].toLowerCase()
        let seconds = 0

        if (/^hours?$|^hrs?$/.test(unit)) {
            seconds = value * 3600
        } else if (/^minutes?$|^mins?$/.test(unit)) {
            seconds = value * 60
        } else if (/^seconds?$|^secs?$/.test(unit)) {
            seconds = value
        }

        if (seconds > 0) {
            results.push({
                id: `t${index}`,
                label: `${value} ${unit}`,
                seconds,
            })
            index++
        }
    }

    return results
}

export function formatTime(seconds: number): string {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60

    if (h > 0) {
        return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    }
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function playBeep() {
    try {
        const AudioCtxClass =
            window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        const ctx = new AudioCtxClass()
        const oscillator = ctx.createOscillator()
        const gainNode = ctx.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(ctx.destination)
        oscillator.frequency.value = 880
        oscillator.type = 'sine'
        gainNode.gain.setValueAtTime(0.8, ctx.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2)
        oscillator.start(ctx.currentTime)
        oscillator.stop(ctx.currentTime + 1.2)
    } catch {
        // Web Audio API not supported
    }
}
