export interface Client {
  id: string;
  ipAddress: string;
  macAddress: string;
  hostname: string;
  interface: string;
  source: "dhcp" | "arp" | "both";
  status: "active" | "inactive";
  lastSeen: string;
}

export interface TrafficData {
  interface: string;
  txBps: number;
  rxBps: number;
  timestamp: number;
}

export interface ClientBandwidth {
  ipAddress: string;
  hostname: string;
  txRate: number;
  rxRate: number;
  txBytesTotal: number;
  rxBytesTotal: number;
  lastUpdated: number;
}

export interface SystemInfo {
  uptime: string;
  cpuLoad: number;
  memoryUsed: number;
  memoryTotal: number;
  hddUsed: number;
  hddTotal: number;
  architecture: string;
  boardName: string;
  version: string;
  platform: string;
  cpuCount: number;
}

export interface DnsCacheEntry {
  name: string;
  type: string;
  data: string;
  ttl: string;
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
