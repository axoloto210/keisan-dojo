import { FC } from 'react'
import { Socket } from 'socket.io-client'
import { GAME_RESULTS, useKumite } from './hooks/useKumite'
import { Heart } from './components/Heart'
import styles from '@/features/kumite/Kumite.module.scss'
import {
    KUMITE_PHASES,
    QuestionNumbers,
} from '../../../kumite-server/src/kumiteHandler'
import { formatTimeToSSMMM } from './utils/time'
import GameResult from './components/GameResult'

type KumiteProps = {
    socket: Socket
    currentRoomId: string
}
export const Kumite: FC<KumiteProps> = (props: KumiteProps) => {
    const { socket } = props

    const { answer, setAnswer, kumiteStatus, submitAnswer, getGameResult } =
        useKumite(socket)

    const playerStatus = kumiteStatus.playerStatuses[socket.id!]

    const opponentStatusKey = Object.keys(kumiteStatus.playerStatuses).filter(
        (key) => key !== socket.id!
    )[0]

    const opponentStatus = kumiteStatus.playerStatuses[opponentStatusKey]

    const gameResult = getGameResult(opponentStatus?.hp)

    const clickSubmitAnswerHandler = () => {
        if (answer === undefined || isNaN(answer)) {
            return
        }
        submitAnswer({ answer })
        setAnswer(undefined)
    }

    return (
        <>
            {gameResult !== GAME_RESULTS.IN_GAME && (
                <GameResult result={gameResult} />
            )}
            {playerStatus && (
                <>
                    <div>あいて：{opponentStatus.userName}</div>
                    <div className={styles.hp_container}>
                        {[...Array(opponentStatus.hp)].map((_, i) => (
                            // このkeyの付け方は望ましくない
                            <div key={i} className={styles.hp_box}>
                                <Heart />
                            </div>
                        ))}
                    </div>
                    {!!opponentStatus.calculationTime && (
                        <div>
                            Time:
                            {`${formatTimeToSSMMM(opponentStatus.calculationTime)}`}
                        </div>
                    )}
                    {kumiteStatus.questionNumbers !== undefined && (
                        <Question
                            questionNumbers={kumiteStatus.questionNumbers}
                        />
                    )}
                    {kumiteStatus.phase === KUMITE_PHASES.RESOLVE &&
                        kumiteStatus.solution && (
                            <div>{kumiteStatus.solution}</div>
                        )}
                    {kumiteStatus.phase === KUMITE_PHASES.CALCULATION ? (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                clickSubmitAnswerHandler()
                            }}
                        >
                            <input
                                type="number"
                                min="0"
                                pattern="[0-9]*"
                                inputMode="numeric"
                                value={answer ?? ''}
                                onChange={(e) =>
                                    setAnswer(e.target.valueAsNumber)
                                }
                            />
                            <button type="submit">こたえる！</button>
                        </form>
                    ) : (
                        <div></div>
                    )}

                    {!!playerStatus.calculationTime && (
                        <div>
                            Time:
                            {`${formatTimeToSSMMM(playerStatus.calculationTime)}`}
                        </div>
                    )}

                    <div>じぶん：{playerStatus.userName}</div>
                    <div className={styles.hp_container}>
                        {[...Array(playerStatus.hp)].map((_, i) => (
                            <div key={i} className={styles.hp_box}>
                                <Heart />
                            </div>
                        ))}
                    </div>
                </>
            )}
        </>
    )
}

type QuestionProps = {
    questionNumbers: QuestionNumbers
}

const Question = (props: QuestionProps) => {
    const [firstNumber, secondNumber] = [
        props.questionNumbers[0],
        props.questionNumbers[1],
    ]
    return (
        <>
            <div>
                {firstNumber}×{secondNumber}
            </div>
        </>
    )
}
