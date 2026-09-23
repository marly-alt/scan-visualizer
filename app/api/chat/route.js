import { streamText, convertToModelMessages, stepCountIs } from "ai";
import { CHAT_MODEL, SYSTEM_PROMPT, MAX_OUTPUT_TOKENS } from "../../lib/ai-config";
import { lookupPortTool } from "../../lib/tools";

// This runs server-side only — the API key is read by the provider and
// never sent to the browser. The client only ever talks to THIS route.
export async function POST(req) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: CHAT_MODEL,
      system: SYSTEM_PROMPT,
      messages: await convertToModelMessages(messages),
      maxOutputTokens: MAX_OUTPUT_TOKENS,
      tools: {
        lookupPort: lookupPortTool,
      },
      // Allows the model to call a tool AND then respond with text about
      // the result, instead of stopping right after the tool call.
      stopWhen: stepCountIs(5),
      onError: (error) => {
        console.error("streamText error:", error);
      },
    });

        return result.toUIMessageStreamResponse({
      onError: (error) => (error instanceof Error ? error.message : "An unknown error occurred."),
    });
  } catch (err) {
    console.error("Chat route error:", err);
    return Response.json(
      { error: err?.message || "Unknown server error" },
      { status: 500 }
    );
  }
}