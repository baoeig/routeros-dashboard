export interface DhcpLease {
  ".id": string;
  address: string;
  "mac-address": string;
  "host-name"?: string;
  status: string;
  "active-address"?: string;
  "active-mac-address"?: string;
  server: string;
  "expires-after"?: string;
  "last-seen"?: string;
  dynamic?: string;
}

export interface ArpEntry {
  ".id": string;
  address: string;
  "mac-address": string;
  interface: string;
  dynamic?: string;
  complete?: string;
}

export interface InterfaceTraffic {
  name: string;
  "rx-bits-per-second": string;
  "tx-bits-per-second": string;
}

export interface MangleRule {
  ".id": string;
  chain: string;
  action: string;
  "src-address"?: string;
  "dst-address"?: string;
  "in-interface"?: string;
  "out-interface"?: string;
  bytes: string;
  packets: string;
  comment?: string;
  disabled?: string;
}

export interface DnsCacheEntry {
  name: string;
  type: string;
  data: string;
  ttl: string;
}

export interface SystemResource {
  uptime: string;
  "cpu-load": string;
  "free-memory": string;
  "total-memory": string;
  "free-hdd-space": string;
  "total-hdd-space": string;
  "architecture-name": string;
  "board-name": string;
  version: string;
  platform: string;
  "cpu-count": string;
}

export interface RouterInterface {
  ".id": string;
  name: string;
  type: string;
  running: string;
  disabled: string;
  "tx-byte"?: string;
  "rx-byte"?: string;
}

export interface FirewallFilter {
  ".id": string;
  chain: string;
  action: string;
  disabled?: string;
  comment?: string;
}

// Dashboard types
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
