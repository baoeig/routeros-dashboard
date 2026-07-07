import { useTraffic } from "../hooks/useTraffic";
import { SpeedChart } from "./SpeedChart";
import { formatBps } from "../utils";

export function TrafficCard() {
  const { current, history } = useTraffic();

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-lg font-medium text-white mb-2">Real-time Traffic</h2>
      <div className="flex gap-8 mb-4">
        <div>
          <span className="text-blue-400 text-sm">Upload</span>
          <p className="text-2xl font-bold text-white">
            {current ? formatBps(current.txBps) : "--"}
          </p>
        </div>
        <div>
          <span className="text-green-400 text-sm">Download</span>
          <p className="text-2xl font-bold text-white">
            {current ? formatBps(current.rxBps) : "--"}
          </p>
        </div>
      </div>
      <SpeedChart history={history} />
    </div>
  );
}
