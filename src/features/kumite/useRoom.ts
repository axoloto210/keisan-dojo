import { useContext, useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'
import { ROOM_EVENTS } from '../../../kumite-server/src/const'
import { UserContext } from './contexts/userContext'

export const useRoom = (socket: Socket) => {
    const user = useContext(UserContext)

    const [currentRoomId, setCurrentRoomId] = useState<string>('')

    const [errorMessage, setErrorMessage] = useState<string>('')

    useEffect(() => {
        // socket.on('connect', () => {
        //   console.log('Socket connected!');
        // });

        // socket.on('disconnect', () => {
        //   console.log('Socket disconnected!');
        // });
        socket.on(ROOM_EVENTS.ROOM_FULL, ({ message }) => {
            setErrorMessage(message)
        })

        socket.on(ROOM_EVENTS.ROOM_DISMISS, ({ message }) => {
            console.log('dismissssss')
            setErrorMessage(message)
        })
        return () => {
            socket.off(ROOM_EVENTS.ROOM_FULL)
            socket.off(ROOM_EVENTS.ROOM_DISMISS)
        }
    }, [socket])

    // ルーム参加処理
    const joinRoom = (roomId: string) => {
        if (roomId && roomId.trim()) {
            if (currentRoomId) {
                socket.emit(ROOM_EVENTS.LEAVE_ROOM, currentRoomId)
            }
            socket.emit(ROOM_EVENTS.JOIN_ROOM, {
                roomId,
                userName: user.userName,
            })
            setCurrentRoomId(roomId)
        }
    }

    // ルーム退室処理
    const leaveRoom = () => {
        socket.emit(ROOM_EVENTS.LEAVE_ROOM, currentRoomId)
        setCurrentRoomId('')
    }

    return {
        currentRoomId,
        errorMessage,
        joinRoom,
        leaveRoom,
    }
}
