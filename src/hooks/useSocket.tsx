import { useEffect, useRef, useState } from "react";
import { type Socket, io } from "socket.io-client";

const useSocket = () => {
  const [socketStatus, setSocketStatus] = useState<
    "connected" | "disconnected"
  >("disconnected");
  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    const socketInitializer = async () => {
      await fetch("/api/socket");
      socket.current = io({
        path: "/api/socket",
      });

      socket.current.on("connect", () => {
        console.log("Socket connected!", socket.current?.id);

        setSocketStatus("connected");
      });
    };

    void socketInitializer();
  }, []);

  return { socket: socket.current, socketStatus };
};

export { useSocket };
