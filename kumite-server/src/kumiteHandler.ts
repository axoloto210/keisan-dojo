import { Server, Socket } from 'socket.io'
import { ROOM_EVENTS } from './const'

const INITIAL_HP = 5

const KUMITE_PHASES = {
    BEFORE_START: 'before_start',
    PENDING: 'pending',
    START: 'start',
    SYNC_STATUS: 'sync_status',
    RESOLVE: 'resolve',
    GAME_END: 'game_end'
} as const

type Phase = (typeof KUMITE_PHASES)[keyof typeof KUMITE_PHASES]

type PlayerStatus = {
    playerName: string
    hp: number
}

type PlayerStatuses = {
    [playerId: string]: PlayerStatus
}

type KumiteStatus = {
    phase: Phase
    playerStatuses: PlayerStatuses
}

export class KumiteHandler {
    private readonly MAX_PLAYERS = 2
    private isGameStarted: boolean = false
    private playerMap: Map<string, string> = new Map() // socketId -> userName
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

    setupSocket(socket: Socket, userName: string): boolean {
        this.playerMap.set(socket.id, userName)

        socket.on(KUMITE_PHASES.PENDING, (data) => {

        })

        if (this.playerMap.size === this.MAX_PLAYERS) {
            this.startGame()
        }

        return true
    }

    private startGame() {
        this.isGameStarted = true
        this.io.to(this.roomId).emit(KUMITE_PHASES.START, {
            players: Array.from(this.playerMap.values()),
        })
        // ゲーム開始時の初期化処理

        const newPlayerStatuses: PlayerStatuses = Array.from(
            this.playerMap.keys()
        ).reduce((previousValue, currentValue) => {
            return {
                ...previousValue,
                [currentValue]: {
                    userName: this.playerMap.get(currentValue),
                    hp: INITIAL_HP,
                },
            }
        }, {})

        this.kumiteStatus = {
            phase: KUMITE_PHASES.START,
            playerStatuses: newPlayerStatuses,
        }

        this.sendGameStatusToClient()
    }

    sendGameStatusToClient() {
        this.io
            .to(this.roomId)
            .emit(KUMITE_PHASES.SYNC_STATUS, this.kumiteStatus)
    }

    cleanupRoom() {
        this.io.to(this.roomId).emit(ROOM_EVENTS.ROOM_DISMISS, {
            message: `部屋:${this.roomId}が解散されました。`,
        })
        this.playerMap.clear()
        this.isGameStarted = false
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

        // 次のラウンドの準備
        this.kumiteStatus = {
            ...this.kumiteStatus,
            phase:
                this.kumiteStatus.phase === KUMITE_PHASES.GAME_END
                    ? KUMITE_PHASES.GAME_END
                    : KUMITE_PHASES.START,
        }
        this.sendGameStatusToClient()
    }

    private determineBattleResult(
        player1Id: string,
        player2Id: string,
    ) {
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
