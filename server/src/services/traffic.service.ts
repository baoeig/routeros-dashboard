import { routerClient } from "../router/client.js";
import { config } from "../config.js";
import type { TrafficData } from "../router/types.js";

export async function getTraffic(): Promise<TrafficData> {
  const res = await routerClient.post<Record<string, string>[]>(
    "interface/monitor-traffic",
    {
      interface: config.wanInterface,
      duration: "1s",
      ".proplist": "name,rx-bits-per-second,tx-bits-per-second",
    }
  );
  const sample = Array.isArray(res) ? res[0] : res;
  return {
    interface: config.wanInterface,
    txBps: parseInt(sample?.["tx-bits-per-second"] || "0"),
    rxBps: parseInt(sample?.["rx-bits-per-second"] || "0"),
    timestamp: Date.now(),
  };
}
