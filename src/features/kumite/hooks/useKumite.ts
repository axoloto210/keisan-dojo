import { useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'
import {
    CalculationAnswer,
    KUMITE_PHASES,
    KumiteStatus,
} from '../../../../kumite-server/src/kumiteHandler'

export const GAME_RESULTS = {
    IN_GAME: 'in_game',
    WIN: 'win',
    LOSE: 'lose',
} as const

export type GameResult = (typeof GAME_RESULTS)[keyof typeof GAME_RESULTS]

export const useKumite = (socket: Socket) => {
    const [kumiteStatus, setKumiteStatus] = useState<KumiteStatus>({
        phase: KUMITE_PHASES.BEFORE_START,
        playerStatuses: {},
    })

    const [answer, setAnswer] = useState<number>()

    const isGameEnd = kumiteStatus.phase === KUMITE_PHASES.GAME_END

    const getGameResult = (opponentHp?: number) => {
        if (opponentHp == null) {
            return GAME_RESULTS.IN_GAME
        }

        if (isGameEnd && opponentHp <= 0) {
            return GAME_RESULTS.WIN
        } else if (isGameEnd && opponentHp > 0) {
            return GAME_RESULTS.LOSE
        }

        return GAME_RESULTS.IN_GAME
    }

    // kumite statusの同期メッセージを受信するリスナーを登録
    useEffect(() => {
        socket.on(KUMITE_PHASES.SYNC_STATUS, (data) => {
            setKumiteStatus(data)
        })

        return () => {
            socket.off(KUMITE_PHASES.SYNC_STATUS)
        }
    }, [socket])

    const submitAnswer = (calculationAnswer: CalculationAnswer) => {
        socket.emit(KUMITE_PHASES.CALCULATION, calculationAnswer)
    }

    return {
        answer,
        setAnswer,
        kumiteStatus,
        setKumiteStatus,
        submitAnswer,
        getGameResult,
    }
}
