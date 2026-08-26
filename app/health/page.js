import { getHealthData } from "../lib/health";

export default async function HealthPage() {
  const data = await getHealthData();

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold mb-6">System health</h1>

      <div className="border border-border rounded-lg p-6 bg-white/40">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2.5 h-2.5 rounded-full bg-risk-low" />
          <span className="font-medium">{data.status}</span>
        </div>

        <dl className="text-sm space-y-2 text-text/70">
          <div className="flex justify-between">
            <dt>Service</dt>
            <dd className="text-text">{data.service}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Checked at</dt>
            <dd className="text-text">{new Date(data.timestamp).toLocaleString()}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Uptime</dt>
            <dd className="text-text">{data.uptimeSeconds}s</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
