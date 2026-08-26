// Shared health-check logic, used by both the API route and the page directly.
// Avoids a fragile self-fetch (page calling its own API over HTTP), which is
// unreliable on serverless platforms like Vercel.
export async function getHealthData() {
  return {
    status: "ok",
    service: "scan-visualizer",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
  };
}
