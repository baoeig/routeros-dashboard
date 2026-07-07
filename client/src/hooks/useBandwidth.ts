import { useState, useEffect } from "react";
import { getSocket } from "../api/ws";
import type { ClientBandwidth } from "../types";

export function useBandwidth() {
  const [data, setData] = useState<ClientBandwidth[]>([]);

  useEffect(() => {
    const socket = getSocket();
    const handler = (payload: ClientBandwidth[]) => setData(payload);
    socket.on("bandwidth:update", handler);
    return () => {
      socket.off("bandwidth:update", handler);
    };
  }, []);

  return data;
}
