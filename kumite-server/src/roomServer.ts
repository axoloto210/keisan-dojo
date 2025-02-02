import { Server } from "socket.io";
import { ROOM_EVENTS } from "./const";
import { KumiteHandler } from "./kumiteHandler";


export const roomServer = (
  io: Server
) => {
  const roomMap = new Map(); // roomId -> Set()
  const userMap = new Map(); // socketId -> userName

  const kumiteHandlers = new Map<string, KumiteHandler>(); //roomId -> KumiteHandler

  io.on(ROOM_EVENTS.CONNECTION, (socket) => {
    console.log("User connected:", socket.id);

    socket.on(ROOM_EVENTS.JOIN_ROOM, ({ roomId, userName }) => {
      console.log(`ユーザー ${socket.id} がルーム ${roomId} に参加しました。`)

      let kumiteHandler = kumiteHandlers.get(roomId);

      if (!kumiteHandler) {
        kumiteHandler = new KumiteHandler(io, roomId);
        kumiteHandlers.set(roomId, kumiteHandler);
      }

      // ルームが満員でない場合のみ参加処理
      if (kumiteHandler.canJoin(socket)) {
        socket.join(roomId);
        console.log(
          `${userName}：${socket.id} がルーム ${roomId} に参加しました。`
        );
        kumiteHandler.setupSocket(socket, userName);
      } else {
        console.log(`${userName}：${socket.id} がルーム ${roomId} に参加しようとしましたが満員でした。`)
        return;
      }

      if (!roomMap.has(roomId)) {
        roomMap.set(roomId, new Set());
      }
      roomMap.get(roomId).add(socket.id);

      if (!userMap.has(socket.id)) {
        userMap.set(socket.id, userName);
      }

    });

    socket.on(ROOM_EVENTS.LEAVE_ROOM, (roomId) => {
      socket.leave(roomId);
      kumiteHandlers.get(roomId)?.cleanupRoom();

      console.log(roomId)
      io.to(roomId).emit(ROOM_EVENTS.ROOM_DISMISS, {
        message: `部屋:${roomId}が解散されました。`,
      });

      if (roomMap.has(roomId)) {
        roomMap.get(roomId).delete(socket.id);
        if (roomMap.get(roomId).size === 0) {
          roomMap.delete(roomId);
        }
        if (userMap.get(socket.id)) {
          userMap.delete(socket.id);
        }

      }
      console.log(`ユーザー ${socket.id} がルーム ${roomId} から退出しました`);
    });

    socket.on(ROOM_EVENTS.DISCONNECT, () => {
      roomMap.forEach((roomUserSet, roomId) => {
        if (roomUserSet.has(socket.id)) {
          roomUserSet.delete(socket.id);
          kumiteHandlers.get(roomId)?.cleanupRoom();
          if (roomUserSet.size === 0) {
            roomMap.delete(roomId);
          }
        }
      });
      console.log(
        `ユーザー${userMap.get(socket.id)}:${socket.id}が切断しました。`
      );
    });
  });
};