import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

export const config = {
  router: {
    host: process.env.ROUTER_HOST || "192.168.88.1",
    port: parseInt(process.env.ROUTER_PORT || "443"),
    user: process.env.ROUTER_USER || "admin",
    password: process.env.ROUTER_PASSWORD || "",
  },
  wanInterface: process.env.WAN_INTERFACE || "ether1",
  serverPort: parseInt(process.env.SERVER_PORT || "3001"),
  pollMs: {
    traffic: parseInt(process.env.TRAFFIC_POLL_MS || "2000"),
    bandwidth: parseInt(process.env.BANDWIDTH_POLL_MS || "5000"),
    clients: parseInt(process.env.CLIENTS_POLL_MS || "10000"),
    dns: parseInt(process.env.DNS_POLL_MS || "30000"),
    system: parseInt(process.env.SYSTEM_POLL_MS || "10000"),
  },
  autoCreateMangle: process.env.AUTO_CREATE_MANGLE !== "false",
};
