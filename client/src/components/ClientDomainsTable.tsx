import { useState } from "react";
import { useClientDomains } from "../hooks/useClientDomains";
import { formatBytes } from "../utils";

export function ClientDomainsTable() {
  const { data, isLoading } = useClientDomains();
  const [search, setSearch] = useState("");
  const [ipFilter, setIpFilter] = useState("");

  const domains = data?.domains || [];

  const clientIps = [...new Set(domains.map((d) => d.clientIp))].sort(
    (a, b) => {
      const pa = a.split(".").map(Number);
      const pb = b.split(".").map(Number);
      for (let i = 0; i < 4; i++) {
        if (pa[i] !== pb[i]) return pa[i] - pb[i];
      }
      return 0;
    }
  );

  const grouped = new Map<
    string,
    { domain: string; port: string; protocol: string; txBytes: number; rxBytes: number; count: number }
  >();
  for (const d of domains) {
    if (ipFilter && d.clientIp !== ipFilter) continue;
    if (search && !d.domain.toLowerCase().includes(search.toLowerCase()) && !d.clientIp.includes(search)) continue;
    const key = `${d.clientIp}||${d.domain}`;
    const existing = grouped.get(key);
    if (existing) {
      existing.txBytes += d.txBytes;
      existing.rxBytes += d.rxBytes;
      existing.count++;
    } else {
      grouped.set(key, {
        domain: d.domain,
        port: d.port,
        protocol: d.protocol,
        txBytes: d.txBytes,
        rxBytes: d.rxBytes,
        count: 1,
      });
    }
  }

  const rows = [...grouped.entries()]
    .map(([key, val]) => ({
      clientIp: key.split("||")[0],
      ...val,
    }))
    .sort((a, b) => b.rxBytes + b.txBytes - (a.rxBytes + a.txBytes));

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
        <div>
          <h2 className="text-lg font-medium text-white">Client Domains</h2>
          <p className="text-xs text-gray-500">
            Matched from active connections + DNS cache
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={ipFilter}
            onChange={(e) => setIpFilter(e.target.value)}
            className="bg-gray-700 text-white text-sm rounded px-2 py-1.5 outline-none"
          >
            <option value="">All Clients</option>
            {clientIps.map((ip) => (
              <option key={ip} value={ip}>
                {ip}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search domain..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-gray-700 text-white text-sm rounded px-3 py-1.5 outline-none focus:ring-1 focus:ring-blue-500 w-48"
          />
        </div>
      </div>
      <div className="overflow-x-auto max-h-96 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-gray-800">
            <tr className="border-b border-gray-700">
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">
                Client IP
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">
                Domain
              </th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-400 uppercase">
                Conns
              </th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-400 uppercase">
                Upload
              </th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-400 uppercase">
                Download
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center text-gray-500 py-8">
                  Loading...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-gray-500 py-8">
                  No domain data
                </td>
              </tr>
            ) : (
              rows.map((r, i) => (
                <tr
                  key={`${r.clientIp}-${r.domain}-${i}`}
                  className="border-b border-gray-700/50 hover:bg-gray-700/30"
                >
                  <td className="px-3 py-1.5 text-gray-300 font-mono text-xs">
                    {r.clientIp}
                  </td>
                  <td className="px-3 py-1.5 text-white font-mono text-xs truncate max-w-xs">
                    {r.domain}
                  </td>
                  <td className="px-3 py-1.5 text-right text-gray-400">
                    {r.count}
                  </td>
                  <td className="px-3 py-1.5 text-right text-blue-400">
                    {formatBytes(r.txBytes)}
                  </td>
                  <td className="px-3 py-1.5 text-right text-green-400">
                    {formatBytes(r.rxBytes)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
