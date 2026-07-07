import { useState, useEffect } from "react";
import { getSocket } from "../api/ws";
import type { TrafficData } from "../types";

export function useTraffic() {
  const [history, setHistory] = useState<TrafficData[]>([]);
  const [current, setCurrent] = useState<TrafficData | null>(null);

  useEffect(() => {
    const socket = getSocket();
    const handler = (data: TrafficData) => {
      setCurrent(data);
      setHistory((prev) => {
        const next = [...prev, data];
        return next.length > 60 ? next.slice(-60) : next;
      });
    };
    socket.on("traffic:update", handler);
    return () => {
      socket.off("traffic:update", handler);
    };
  }, []);

  return { current, history };
}
