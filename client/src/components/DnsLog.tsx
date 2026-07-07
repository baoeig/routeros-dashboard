import { useState } from "react";
import { useDns } from "../hooks/useDns";

export function DnsLog() {
  const { data, isLoading } = useDns();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("A");

  const entries = (data?.entries || [])
    .filter((e) => {
      if (typeFilter && e.type !== typeFilter) return false;
      if (search && !e.name.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    })
    .slice(0, 200);

  const types = [...new Set((data?.entries || []).map((e) => e.type))].sort();

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
        <div>
          <h2 className="text-lg font-medium text-white">DNS Cache</h2>
          <p className="text-xs text-gray-500">
            Router-level cache. Individual client queries are not attributed.
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-gray-700 text-white text-sm rounded px-2 py-1.5 outline-none"
          >
            <option value="">All Types</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
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
      <div className="overflow-x-auto max-h-80 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-gray-800">
            <tr className="border-b border-gray-700">
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">
                Domain
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">
                Type
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">
                Data
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">
                TTL
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="text-center text-gray-500 py-8">
                  Loading...
                </td>
              </tr>
            ) : entries.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center text-gray-500 py-8">
                  No entries
                </td>
              </tr>
            ) : (
              entries.map((e, i) => (
                <tr
                  key={`${e.name}-${e.type}-${i}`}
                  className="border-b border-gray-700/50 hover:bg-gray-700/30"
                >
                  <td className="px-3 py-1.5 text-white font-mono text-xs truncate max-w-xs">
                    {e.name}
                  </td>
                  <td className="px-3 py-1.5 text-gray-400">{e.type}</td>
                  <td className="px-3 py-1.5 text-gray-300 font-mono text-xs truncate max-w-xs">
                    {e.data}
                  </td>
                  <td className="px-3 py-1.5 text-gray-400">{e.ttl}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
