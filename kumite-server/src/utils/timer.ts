export class Timer {
    private playerId: string
    private startTime?: number
    private endTime?: number

    constructor(playerId: string) {
        this.playerId = playerId
    }

    saveStartTime() {
        this.startTime = performance.now()
        console.log(this.playerId)
        console.log('start:', this.startTime)
    }

    saveEndTime() {
        if (this.startTime === undefined) {
            return
        }
        this.endTime = performance.now()
        console.log(this.playerId)
        console.log('start:', this.endTime)
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
