import { tool } from "ai";
import { z } from "zod";
import { PORT_DATA } from "./port-data";

// Tool contract (also documented in README.md):
//   name: lookupPort
//   input:  { port: number }        — a port number, 1-65535
//   output: { port, service, riskLevel, description, recommendation, known }
//   throws: when `port` is outside the valid 1-65535 range — this is the
//           designed error case the assignment asks for (a genuine failure,
//           not a "not found" result, which is handled as a normal output).
export const lookupPortTool = tool({
  description:
    "Look up what a given network port is commonly used for, and its typical security risk level. Use this whenever the user asks about a specific port number.",
  inputSchema: z.object({
    port: z
      .number()
      .describe("The port number to look up, e.g. 445 or 22."),
  }),
  execute: async ({ port }) => {
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      // Genuine failure — invalid input, not just "no data for this port".
      // This is what triggers the tool's output-error state on the client.
      throw new Error(`${port} isn't a valid port number — ports range from 1 to 65535.`);
    }

    const entry = PORT_DATA[port];

    if (!entry) {
      // A valid port we simply don't have curated data for. This is still
      // a successful tool call (output-available), just with less detail —
      // not every unknown case should be an error.
      return {
        port,
        known: false,
        service: null,
        riskLevel: "unknown",
        description: "This port isn't in our common-services reference data.",
        recommendation: "Research this port specifically, or check what's actually listening on it.",
      };
    }

    return {
      port,
      known: true,
      service: entry.service,
      riskLevel: entry.riskLevel,
      description: entry.description,
      recommendation: entry.recommendation,
    };
  },
});