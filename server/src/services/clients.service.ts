import { routerClient } from "../router/client.js";
import type { DhcpLease, ArpEntry, Client } from "../router/types.js";

export async function getClients(): Promise<Client[]> {
  const [leases, arps] = await Promise.all([
    routerClient.get<DhcpLease>("ip/dhcp-server/lease"),
    routerClient.get<ArpEntry>("ip/arp"),
  ]);

  const clientMap = new Map<string, Client>();

  for (const lease of leases) {
    const mac = (lease["active-mac-address"] || lease["mac-address"]).toUpperCase();
    const ip = lease["active-address"] || lease.address;
    const isActive = lease.status === "bound";

    clientMap.set(mac, {
      id: lease[".id"],
      ipAddress: ip,
      macAddress: mac,
      hostname: lease["host-name"] || "",
      interface: "",
      source: "dhcp",
      status: isActive ? "active" : "inactive",
      lastSeen: lease["last-seen"] || "",
    });
  }

  for (const arp of arps) {
    if (arp.complete === "false") continue;
    const mac = arp["mac-address"].toUpperCase();
    const existing = clientMap.get(mac);
    if (existing) {
      existing.interface = arp.interface;
      existing.source = "both";
    } else {
      clientMap.set(mac, {
        id: arp[".id"],
        ipAddress: arp.address,
        macAddress: mac,
        hostname: "",
        interface: arp.interface,
        source: "arp",
        status: "active",
        lastSeen: "",
      });
    }
  }

  return Array.from(clientMap.values());
}
