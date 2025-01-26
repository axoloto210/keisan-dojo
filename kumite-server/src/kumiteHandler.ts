import { Server, Socket } from 'socket.io'
import { ROOM_EVENTS } from './const'
import { createQuestionNumbers } from './utils/createQuestionNumbers'
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
    playerName: string
    hp: number
    calculationTime?: number
}

type PlayerStatuses = {
    [playerId: string]: PlayerStatus
}

type QuestionNumbers = number[]

type KumiteStatus = {
    phase: Phase
    playerStatuses: PlayerStatuses
    questionNumbers?: QuestionNumbers
}

export class KumiteHandler {
    private readonly MAX_PLAYERS = 2
    private isGameStarted: boolean = false

    private playerMap: Map<string, string> = new Map() // socketId -> userName
    private timerMap: Map<string, Timer> = new Map() // socketId -> timer

    private questionNumbers: number[] = []

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

        socket.on(KUMITE_PHASES.CALCULATION, (data) => {
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

        const newPlayerStatuses: PlayerStatuses = Array.from(
            this.playerMap.keys()
        ).reduce((previousValue, playerName) => {
            return {
                ...previousValue,
                [playerName]: {
                    userName: this.playerMap.get(playerName),
                    hp: INITIAL_HP,
                },
            }
        }, {})

        this.questionNumbers = createQuestionNumbers()

        this.kumiteStatus = {
            phase: KUMITE_PHASES.CALCULATION,
            playerStatuses: newPlayerStatuses,
            questionNumbers: this.questionNumbers,
        }

        this.timerMap.forEach((timer, playerId)=>{
            timer.saveStartTime()
        } )

        this.sendGameStatusToClient()
    }

    private playerAnswerMap = new Map<string, number>()

    // 回答を受け付けて登録するハンドラー
    handleCalculation(socket: Socket, data: { answer: number }) {
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
            phase: KUMITE_PHASES.RESOLVE,
        }

        this.sendGameStatusToClient()

        setTimeout(() => {
            this.resolveRound()
        }, 5000)
    }

    private resolveRound() {
        console.log('ラウンド解決中')
        // 次のラウンドの準備
        this.kumiteStatus = {
            ...this.kumiteStatus,
            phase:
                this.kumiteStatus.phase === KUMITE_PHASES.GAME_END
                    ? KUMITE_PHASES.GAME_END
                    : KUMITE_PHASES.CALCULATION,
        }
        this.sendGameStatusToClient()
    }

    private determineBattleResult(player1Id: string, player2Id: string) {
        const player1Status = this.kumiteStatus.playerStatuses[player1Id]
        const player2Status = this.kumiteStatus.playerStatuses[player2Id]

        //カードの勝敗判定とダメージ適用
        this.applyDamage({
            player1Id,
            player2Id,
            player1Status,
            player2Status,
        })

        // ゲームの勝敗判定
        if (player1Status.hp <= 0 || player2Status.hp <= 0) {
            this.kumiteStatus.phase = KUMITE_PHASES.GAME_END
        }
    }
    private applyDamage({
        player1Id,
        player2Id,
        player1Status,
        player2Status,
    }: {
        player1Id: string
        player2Id: string
        player1Status: PlayerStatus
        player2Status: PlayerStatus
    }) {
        //player1 勝利時
        if (true) {
            player2Status.hp -= 1
        } // player2 勝利時
        else if (true) {
            player1Status.hp -= 1
        } // 引き分け時
        else {
            let basePoint = 1
            player1Status.hp -= basePoint
            player2Status.hp -= basePoint
        }
    }
}
