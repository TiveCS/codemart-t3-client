import { type Server as NetServer } from "http";
import { type NextApiRequest } from "next";
import { Server } from "socket.io";
import { type NextApiResponseServerIO } from "~/types";

export default function SocketHandler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (res.socket.server.io) {
    res.end();
    return;
  }

  const httpServer: NetServer = res.socket.server as unknown as NetServer;
  const io = new Server(httpServer, {
    path: "/api/socket",
  });

  res.socket.server.io = io;

  io.on("connection", (socket) => {
    const createdMessage = (msg: unknown) => {
      socket.broadcast.emit("newIncomingMessage", msg);
    };

    socket.on("createdMessage", createdMessage);
  });

  res.end();
}
