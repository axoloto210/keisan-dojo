export class Timer {
    private playerId: string
    private startTime?: number
    private endTime?: number

    constructor(playerId: string) {
        this.playerId = playerId
    }

    saveStartTime() {
        this.startTime = performance.now()
    }

    saveEndTime() {
        if (this.startTime === undefined) {
            return
        }
        this.endTime = performance.now()
    }

    getTime() {
        if (this.startTime && this.endTime) {
            return this.endTime - this.startTime
        }
    }

    resetTimer() {
        this.startTime = undefined
        this.endTime = undefined
    }
}
