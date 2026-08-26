import { getHealthData } from "../../lib/health";

export async function GET() {
  const data = await getHealthData();
  return Response.json(data);
}
