import { routerClient } from "../router/client.js";
import { config } from "../config.js";
import type { MangleRule, ClientBandwidth } from "../router/types.js";

const COMMENT_PREFIX = "bw-acct-";

interface CounterSnapshot {
  bytes: number;
  timestamp: number;
}

const prevCounters = new Map<string, CounterSnapshot>();
const clientHostnames = new Map<string, string>();

export function updateHostnames(
  clients: Array<{ ipAddress: string; hostname: string }>
) {
  for (const c of clients) {
    if (c.hostname) clientHostnames.set(c.ipAddress, c.hostname);
  }
}

export async function getBandwidth(): Promise<ClientBandwidth[]> {
  const rules = await routerClient.get<MangleRule>("ip/firewall/mangle");
  const tracked = rules.filter(
    (r) => r.comment && r.comment.startsWith(COMMENT_PREFIX)
  );

  const now = Date.now();
  const bandwidthMap = new Map<string, ClientBandwidth>();

  for (const rule of tracked) {
    const comment = rule.comment!;
    const isTx = comment.startsWith(`${COMMENT_PREFIX}tx-`);
    const ip = comment.replace(`${COMMENT_PREFIX}tx-`, "").replace(`${COMMENT_PREFIX}rx-`, "");
    const currentBytes = parseInt(rule.bytes || "0");

    const prev = prevCounters.get(comment);
    let rateBps = 0;
    if (prev && currentBytes >= prev.bytes) {
      const deltaBytes = currentBytes - prev.bytes;
      const elapsedSec = (now - prev.timestamp) / 1000;
      if (elapsedSec > 0) rateBps = (deltaBytes * 8) / elapsedSec;
    }
    prevCounters.set(comment, { bytes: currentBytes, timestamp: now });

    let entry = bandwidthMap.get(ip);
    if (!entry) {
      entry = {
        ipAddress: ip,
        hostname: clientHostnames.get(ip) || "",
        txRate: 0,
        rxRate: 0,
        txBytesTotal: 0,
        rxBytesTotal: 0,
        lastUpdated: now,
      };
      bandwidthMap.set(ip, entry);
    }

    if (isTx) {
      entry.txRate = rateBps;
      entry.txBytesTotal = currentBytes;
    } else {
      entry.rxRate = rateBps;
      entry.rxBytesTotal = currentBytes;
    }
  }

  return Array.from(bandwidthMap.values());
}

export async function ensureMangleRules(clientIps: string[]) {
  if (!config.autoCreateMangle) return;

  const rules = await routerClient.get<MangleRule>("ip/firewall/mangle");
  const existingComments = new Set(rules.map((r) => r.comment).filter(Boolean));

  for (const ip of clientIps) {
    const txComment = `${COMMENT_PREFIX}tx-${ip}`;
    const rxComment = `${COMMENT_PREFIX}rx-${ip}`;

    if (!existingComments.has(txComment)) {
      await routerClient.put("ip/firewall/mangle", {
        chain: "forward",
        "src-address": ip,
        "out-interface": config.wanInterface,
        action: "passthrough",
        comment: txComment,
      });
    }
    if (!existingComments.has(rxComment)) {
      await routerClient.put("ip/firewall/mangle", {
        chain: "forward",
        "dst-address": ip,
        "in-interface": config.wanInterface,
        action: "passthrough",
        comment: rxComment,
      });
    }
  }
}
