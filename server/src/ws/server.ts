import { Server as IOServer } from "socket.io";
import type { Server as HttpServer } from "node:http";
import { config } from "../config.js";
import { getTraffic } from "../services/traffic.service.js";
import { getClients } from "../services/clients.service.js";
import {
  getBandwidth,
  ensureMangleRules,
  updateHostnames,
} from "../services/bandwidth.service.js";

export function setupWebSocket(httpServer: HttpServer) {
  const io = new IOServer(httpServer, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log(`[ws] client connected: ${socket.id}`);
    socket.on("disconnect", () =>
      console.log(`[ws] client disconnected: ${socket.id}`)
    );
  });

  // Traffic polling
  setInterval(async () => {
    try {
      const data = await getTraffic();
      io.emit("traffic:update", data);
    } catch (e) {
      console.error("[traffic]", (e as Error).message);
    }
  }, config.pollMs.traffic);

  // Clients polling
  setInterval(async () => {
    try {
      const clients = await getClients();
      io.emit("clients:update", { clients, count: clients.length });

      updateHostnames(clients);

      const activeIps = clients
        .filter((c) => c.status === "active")
        .map((c) => c.ipAddress);
      await ensureMangleRules(activeIps);
    } catch (e) {
      console.error("[clients]", (e as Error).message);
    }
  }, config.pollMs.clients);

  // Bandwidth polling
  setInterval(async () => {
    try {
      const data = await getBandwidth();
      io.emit("bandwidth:update", data);
    } catch (e) {
      console.error("[bandwidth]", (e as Error).message);
    }
  }, config.pollMs.bandwidth);

  return io;
}
