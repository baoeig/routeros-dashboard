import { routerClient } from "../router/client.js";
import type { DnsCacheEntry } from "../router/types.js";

interface Connection {
  "src-address": string;
  "dst-address": string;
  "dst-port"?: string;
  protocol: string;
  "orig-bytes"?: string;
  "repl-bytes"?: string;
}

export interface ClientDomain {
  clientIp: string;
  domain: string;
  dstIp: string;
  port: string;
  protocol: string;
  txBytes: number;
  rxBytes: number;
}

export async function getClientDomains(): Promise<ClientDomain[]> {
  const [connections, dnsEntries] = await Promise.all([
    routerClient.get<Connection>("ip/firewall/connection"),
    routerClient.get<DnsCacheEntry>("ip/dns/cache/all"),
  ]);

  const ipToDomain = new Map<string, string>();
  for (const e of dnsEntries) {
    if (e.type === "A" || e.type === "AAAA") {
      ipToDomain.set(e.data, e.name);
    }
  }

  const results: ClientDomain[] = [];
  for (const conn of connections) {
    const srcIp = conn["src-address"]?.split(":")[0];
    const dstFull = conn["dst-address"] || "";
    const dstIp = dstFull.split(":")[0];
    if (!srcIp?.startsWith("192.168.")) continue;

    const domain = ipToDomain.get(dstIp);
    if (!domain) continue;

    results.push({
      clientIp: srcIp,
      domain,
      dstIp,
      port: conn["dst-port"] || "",
      protocol: conn.protocol,
      txBytes: parseInt(conn["orig-bytes"] || "0"),
      rxBytes: parseInt(conn["repl-bytes"] || "0"),
    });
  }

  return results;
}

export async function getDnsCache(): Promise<DnsCacheEntry[]> {
  return routerClient.get<DnsCacheEntry>("ip/dns/cache/all");
}
