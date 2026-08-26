import { streamText, convertToModelMessages } from "ai";
import { CHAT_MODEL, SYSTEM_PROMPT, MAX_OUTPUT_TOKENS } from "../../lib/ai-config";

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
      onError: (error) => {
        console.error("streamText error:", error);
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (err) {
    console.error("Chat route error:", err);
    return Response.json(
      { error: err?.message || "Unknown server error" },
      { status: 500 }
    );
  }
}