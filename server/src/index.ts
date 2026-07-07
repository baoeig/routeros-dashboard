import express from "express";
import cors from "cors";
import { createServer } from "node:http";
import { config } from "./config.js";
import { setupWebSocket } from "./ws/server.js";
import systemRoutes from "./routes/system.routes.js";
import clientsRoutes from "./routes/clients.routes.js";
import dnsRoutes from "./routes/dns.routes.js";
import interfacesRoutes from "./routes/interfaces.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", systemRoutes);
app.use("/api", clientsRoutes);
app.use("/api", dnsRoutes);
app.use("/api", interfacesRoutes);

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("[error]", err.message);
    res.status(500).json({ error: err.message });
  }
);

const httpServer = createServer(app);
setupWebSocket(httpServer);

httpServer.listen(config.serverPort, () => {
  console.log(`[server] running on http://localhost:${config.serverPort}`);
  console.log(`[server] router: ${config.router.host}:${config.router.port}`);
  console.log(`[server] WAN interface: ${config.wanInterface}`);
});
