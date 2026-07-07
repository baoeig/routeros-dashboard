import { routerClient } from "../router/client.js";
import type { SystemResource, SystemInfo } from "../router/types.js";

export async function getSystemInfo(): Promise<SystemInfo> {
  const [res] = await routerClient.get<SystemResource>("system/resource");
  const totalMem = parseInt(res["total-memory"]);
  const freeMem = parseInt(res["free-memory"]);
  const totalHdd = parseInt(res["total-hdd-space"]);
  const freeHdd = parseInt(res["free-hdd-space"]);

  return {
    uptime: res.uptime,
    cpuLoad: parseInt(res["cpu-load"]),
    memoryUsed: totalMem - freeMem,
    memoryTotal: totalMem,
    hddUsed: totalHdd - freeHdd,
    hddTotal: totalHdd,
    architecture: res["architecture-name"],
    boardName: res["board-name"],
    version: res.version,
    platform: res.platform,
    cpuCount: parseInt(res["cpu-count"] || "1"),
  };
}
