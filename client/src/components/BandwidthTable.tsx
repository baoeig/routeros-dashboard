import { useBandwidth } from "../hooks/useBandwidth";
import { formatBps, formatBytes } from "../utils";

export function BandwidthTable() {
  const data = useBandwidth();

  const sorted = [...data].sort((a, b) => b.rxRate - a.rxRate);

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-lg font-medium text-white mb-3">
        Per-Client Bandwidth
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">
                IP
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">
                Hostname
              </th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-400 uppercase">
                Upload
              </th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-400 uppercase">
                Download
              </th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-400 uppercase">
                Total TX
              </th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-400 uppercase">
                Total RX
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-gray-500 py-8">
                  No bandwidth data yet
                </td>
              </tr>
            ) : (
              sorted.map((c) => (
                <tr
                  key={c.ipAddress}
                  className="border-b border-gray-700/50 hover:bg-gray-700/30"
                >
                  <td className="px-3 py-2 text-gray-300 font-mono text-xs">
                    {c.ipAddress}
                  </td>
                  <td className="px-3 py-2 text-white">
                    {c.hostname || <span className="text-gray-500">--</span>}
                  </td>
                  <td className="px-3 py-2 text-right text-blue-400">
                    {formatBps(c.txRate)}
                  </td>
                  <td className="px-3 py-2 text-right text-green-400">
                    {formatBps(c.rxRate)}
                  </td>
                  <td className="px-3 py-2 text-right text-gray-400">
                    {formatBytes(c.txBytesTotal)}
                  </td>
                  <td className="px-3 py-2 text-right text-gray-400">
                    {formatBytes(c.rxBytesTotal)}
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
