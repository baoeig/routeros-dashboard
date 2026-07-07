import { SystemInfo } from "./SystemInfo";
import { TrafficCard } from "./TrafficCard";
import { ClientsTable } from "./ClientsTable";
import { BandwidthTable } from "./BandwidthTable";
import { ClientDomainsTable } from "./ClientDomainsTable";
import { DnsLog } from "./DnsLog";

export function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-white">RouterOS Dashboard</h1>
        <SystemInfo />
        <TrafficCard />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ClientsTable />
          <BandwidthTable />
        </div>
        <ClientDomainsTable />
        <DnsLog />
      </div>
    </div>
  );
}
