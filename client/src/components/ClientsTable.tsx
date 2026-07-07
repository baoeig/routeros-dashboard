import { useState } from "react";
import { useClients } from "../hooks/useClients";

type SortKey = "hostname" | "ipAddress" | "macAddress" | "interface" | "status";

export function ClientsTable() {
  const { data, isLoading } = useClients();
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("ipAddress");
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const clients = (data?.clients || [])
    .filter((c) => {
      const q = search.toLowerCase();
      return (
        !q ||
        c.hostname.toLowerCase().includes(q) ||
        c.ipAddress.includes(q) ||
        c.macAddress.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const va = a[sortKey] || "";
      const vb = b[sortKey] || "";
      return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
    });

  const SortHeader = ({ k, label }: { k: SortKey; label: string }) => (
    <th
      className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase cursor-pointer hover:text-white select-none"
      onClick={() => handleSort(k)}
    >
      {label} {sortKey === k ? (sortAsc ? "↑" : "↓") : ""}
    </th>
  );

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-medium text-white">
          Clients{" "}
          <span className="text-sm text-gray-400 font-normal">
            ({data?.count ?? 0})
          </span>
        </h2>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-gray-700 text-white text-sm rounded px-3 py-1.5 outline-none focus:ring-1 focus:ring-blue-500 w-48"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <SortHeader k="hostname" label="Hostname" />
              <SortHeader k="ipAddress" label="IP Address" />
              <SortHeader k="macAddress" label="MAC" />
              <SortHeader k="interface" label="Interface" />
              <SortHeader k="status" label="Status" />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center text-gray-500 py-8">
                  Loading...
                </td>
              </tr>
            ) : clients.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-gray-500 py-8">
                  No clients found
                </td>
              </tr>
            ) : (
              clients.map((c) => (
                <tr
                  key={c.macAddress}
                  className="border-b border-gray-700/50 hover:bg-gray-700/30"
                >
                  <td className="px-3 py-2 text-white">
                    {c.hostname || <span className="text-gray-500">--</span>}
                  </td>
                  <td className="px-3 py-2 text-gray-300 font-mono text-xs">
                    {c.ipAddress}
                  </td>
                  <td className="px-3 py-2 text-gray-300 font-mono text-xs">
                    {c.macAddress}
                  </td>
                  <td className="px-3 py-2 text-gray-300">
                    {c.interface || "--"}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                        c.status === "active"
                          ? "bg-green-900/50 text-green-400"
                          : "bg-gray-700 text-gray-400"
                      }`}
                    >
                      {c.status}
                    </span>
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
