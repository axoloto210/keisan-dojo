import { Server, Socket } from 'socket.io'
import { ROOM_EVENTS } from './const'
import { createQuestionNumbersAndSolution } from './utils/createQuestionNumbers'
import { Timer } from './utils/timer'

const INITIAL_HP = 5

export const KUMITE_PHASES = {
    BEFORE_START: 'before_start',
    READY: 'ready',
    CALCULATION: 'calculation',
    RESOLVE: 'resolve',
    GAME_END: 'game_end',
    SYNC_STATUS: 'sync_status',
} as const satisfies { [key: string]: string }

type Phase = (typeof KUMITE_PHASES)[keyof typeof KUMITE_PHASES]

type PlayerStatus = {
    userName: string
    hp: number
    calculationTime?: number
}

type PlayerStatuses = {
    [playerId: string]: PlayerStatus
}

export type QuestionNumbers = [number, number]
export type Solution = number

export type KumiteStatus = {
    phase: Phase
    playerStatuses: PlayerStatuses
    questionNumbers?: QuestionNumbers
    solution?: number
}

export type CalculationAnswer = {
    answer: number
}

export class KumiteHandler {
    private readonly MAX_PLAYERS = 2
    private isGameStarted: boolean = false

    private playerMap: Map<string, string> = new Map() // socketId -> userName
    private timerMap: Map<string, Timer> = new Map() // socketId -> timer

    private questionNumbers: QuestionNumbers = [0, 0]
    private solution?: Solution

    private kumiteStatus: KumiteStatus = {
        phase: KUMITE_PHASES.BEFORE_START,
        playerStatuses: {},
    }

    constructor(
        private io: Server,
        private roomId: string
    ) {}

    canJoin(socket: Socket): boolean {
        if (this.playerMap.size < this.MAX_PLAYERS) {
            return true
        } else {
            socket.emit(ROOM_EVENTS.ROOM_FULL, {
                message: 'このルームは満員です',
            })
            return false
        }
    }

    cleanupRoom() {
        this.io.to(this.roomId).emit(ROOM_EVENTS.ROOM_DISMISS, {
            message: `部屋:${this.roomId}が解散されました。`,
        })
        this.playerMap.clear()
        this.isGameStarted = false
    }
    sendGameStatusToClient() {
        this.io
            .to(this.roomId)
            .emit(KUMITE_PHASES.SYNC_STATUS, this.kumiteStatus)
    }

    setupSocket(socket: Socket, userName: string): boolean {
        const playerId = socket.id
        this.playerMap.set(playerId, userName)
        this.timerMap.set(playerId, new Timer(playerId))

        socket.on(KUMITE_PHASES.CALCULATION, (data: CalculationAnswer) => {
            this.handleCalculation(socket, data)
        })

        if (this.playerMap.size === this.MAX_PLAYERS) {
            this.startGame()
        }

        return true
    }

    private startGame() {
        this.isGameStarted = true
        this.io.to(this.roomId).emit(KUMITE_PHASES.CALCULATION, {
            players: Array.from(this.playerMap.values()),
        })
        // ゲーム開始時の初期化処理

        const newPlayerStatuses = Array.from(
            this.playerMap.keys()
        ).reduce<PlayerStatuses>((previousValue, userName) => {
            const name = this.playerMap.get(userName)
            if (name === undefined) {
                return previousValue
            }

            return {
                ...previousValue,
                [userName]: {
                    userName: name,
                    hp: INITIAL_HP,
                },
            }
        }, {})

        ;[this.questionNumbers, this.solution] =
            createQuestionNumbersAndSolution()

        this.kumiteStatus = {
            phase: KUMITE_PHASES.CALCULATION,
            playerStatuses: newPlayerStatuses,
            questionNumbers: this.questionNumbers,
        }

        this.timerMap.forEach((timer, _playerId) => {
            timer.saveStartTime()
        })

        this.sendGameStatusToClient()
    }

    private playerAnswerMap = new Map<string, number>()

    // 回答を受け付けて登録するハンドラー
    handleCalculation(socket: Socket, data: CalculationAnswer) {
        const playerId = socket.id

        if (!this.playerMap.has(playerId) || !this.isGameStarted) {
            return
        }
        // 既に回答済みの場合は処理しない
        if (this.playerAnswerMap.has(playerId)) {
            return
        }
        //回答時間を記録
        const playerTimer = this.timerMap.get(playerId)
        playerTimer?.saveEndTime()

        const playerStatus = this.kumiteStatus.playerStatuses[playerId]

        playerStatus.calculationTime = playerTimer?.getTime()
        playerTimer?.resetTimer

        // 回答を記録
        this.playerAnswerMap.set(playerId, data.answer)

        // 全プレイヤーが回答したら解決
        if (this.playerAnswerMap.size === this.MAX_PLAYERS) {
            this.resolveAnswers()
        }
    }

    private resolveAnswers() {
        this.kumiteStatus = {
            ...this.kumiteStatus,
            solution: this.solution,
            phase: KUMITE_PHASES.RESOLVE,
        }

        this.sendGameStatusToClient()

        setTimeout(() => {
            this.resolveRound()
        }, 5000)
    }

    private resolveRound() {
        // 計算結果解決
        const players = Array.from(
            Object.keys(this.kumiteStatus.playerStatuses)
        )
        const [player1Id, player2Id] = players

        const player1Status = this.kumiteStatus.playerStatuses[player1Id]
        const player2Status = this.kumiteStatus.playerStatuses[player2Id]

        const isPlayer1Correct =
            this.playerAnswerMap.get(player1Id) === this.solution
        const isPlayer2Correct =
            this.playerAnswerMap.get(player2Id) === this.solution

        // 勝敗判定
        const isPlayer1WinOrDraw = this.isPlayer1WinOrDraw({
            isPlayer1Correct,
            isPlayer2Correct,
            player1Status,
            player2Status,
        })

        // ダメージを適用
        if (isPlayer1WinOrDraw === 'draw') {
            player1Status.hp -= 1
            player2Status.hp -= 1
        } else if (isPlayer1WinOrDraw) {
            player2Status.hp -= 1
        } else {
            player1Status.hp -= 1
        }

        // ゲームの勝敗判定
        if (player1Status.hp === 0 || player2Status.hp === 0) {
            this.kumiteStatus.phase = KUMITE_PHASES.GAME_END
        }

        ;[this.questionNumbers, this.solution] =
            createQuestionNumbersAndSolution()
        // 次のラウンドの準備
        this.playerAnswerMap.clear()
        player1Status.calculationTime = undefined
        player2Status.calculationTime = undefined
        this.kumiteStatus = {
            ...this.kumiteStatus,
            questionNumbers: this.questionNumbers,
            solution: undefined,
            phase:
                this.kumiteStatus.phase === KUMITE_PHASES.GAME_END
                    ? KUMITE_PHASES.GAME_END
                    : KUMITE_PHASES.CALCULATION,
        }
        this.timerMap.forEach((timer, _playerId) => {
            timer.saveStartTime()// TODO:出題前に準備OKボタンを追加して移す
        })
        this.sendGameStatusToClient()
    }

    private isPlayer1WinOrDraw({
        player1Status,
        player2Status,
        isPlayer1Correct,
        isPlayer2Correct,
    }: {
        player1Status: PlayerStatus
        player2Status: PlayerStatus
        isPlayer1Correct: boolean
        isPlayer2Correct: boolean
    }): boolean | 'draw' {
        if (isPlayer1Correct && !isPlayer2Correct) {
            return true
        } else if (!isPlayer1Correct && isPlayer2Correct) {
            return false
        } else if (isPlayer1Correct && isPlayer2Correct) {
            const player1Time = player1Status.calculationTime
            const player2Time = player2Status.calculationTime

            //player1 win
            if ((player1Time ?? 0) < (player2Time ?? 0)) {
                return true
            } else if ((player1Time ?? 0) > (player2Time ?? 0)) {
                return false
            }
        }
        return 'draw'
    }
}
