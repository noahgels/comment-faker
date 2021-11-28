import {useEffect, useState} from "react";
import io from "socket.io-client";

export default function useSocket(cb) {
  const [activeSocket, setActiveSocket] = useState(null);

  useEffect(() => {

    if (activeSocket) return;

    fetch('/api/socket.io')
      .catch((e) => null)
      .finally(() => {

        if (activeSocket) return;

        const socket = io();

        cb && cb(socket);

        setActiveSocket(socket);
      })

    return function cleanup() {
      activeSocket && activeSocket.off("message.chat1", cb);
    };
  }, [activeSocket, cb]);

  return activeSocket;
}
