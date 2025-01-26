import { useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useRoom } from '@/features/kumite/hooks/useRoom'
import styles from '@/features/kumite/kumiteArea.module.scss'
import { Kumite } from './Kumite'

const socket: Socket = io(process.env.NEXT_PUBLIC_BACKEND_URL)

export const KumiteArea = () => {
    const [roomId, setRoomId] = useState<string>('')
    const { currentRoomId, errorMessage, joinRoom, leaveRoom } = useRoom(socket)

    const clickJoinHandler = () => {
        joinRoom(roomId)
    }

    const isInRoom = currentRoomId && !errorMessage

    return (
        <div className={styles.container}>
            {!currentRoomId && (
                <div className={styles.roomInputSection}>
                    <input
                        type="text"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        placeholder="ルームIDを入力"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                clickJoinHandler()
                            }
                        }}
                    />
                    <button
                        onClick={clickJoinHandler}
                        className={styles.button}
                    >
                        ルームに参加
                    </button>
                </div>
            )}

            {errorMessage && (
                <div className={styles.errorMessage}>{errorMessage}</div>
            )}

            {isInRoom && (
                <div className={styles.currentRoom}>
                    <p>現在のルーム: {currentRoomId}</p>
                    <button onClick={leaveRoom} className={styles.button}>
                        ルームから出る
                    </button>
                </div>
            )}

            {isInRoom && (
                <Kumite socket={socket} currentRoomId={currentRoomId} />
            )}
        </div>
    )
}
