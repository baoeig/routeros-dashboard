import { useSystem } from "../hooks/useSystem";
import { formatMemory } from "../utils";

export function SystemInfo() {
  const { data, isError } = useSystem();

  if (isError)
    return (
      <div className="bg-red-900/50 text-red-200 p-3 rounded-lg text-sm">
        Unable to connect to router
      </div>
    );
  if (!data) return <div className="bg-gray-800 p-3 rounded-lg animate-pulse h-12" />;

  const memPercent = Math.round((data.memoryUsed / data.memoryTotal) * 100);

  return (
    <div className="bg-gray-800 rounded-lg p-4 flex flex-wrap gap-6 items-center text-sm">
      <div>
        <span className="text-gray-400">Board</span>{" "}
        <span className="text-white font-medium">{data.boardName}</span>
      </div>
      <div>
        <span className="text-gray-400">Version</span>{" "}
        <span className="text-white">{data.version}</span>
      </div>
      <div>
        <span className="text-gray-400">Uptime</span>{" "}
        <span className="text-white">{data.uptime}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-400">CPU</span>
        <div className="w-20 bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all"
            style={{ width: `${data.cpuLoad}%` }}
          />
        </div>
        <span className="text-white">{data.cpuLoad}%</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-400">Memory</span>
        <div className="w-20 bg-gray-700 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all"
            style={{ width: `${memPercent}%` }}
          />
        </div>
        <span className="text-white">
          {formatMemory(data.memoryUsed)}/{formatMemory(data.memoryTotal)}
        </span>
      </div>
    </div>
  );
}
