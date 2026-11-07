import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, type UIMessage } from "ai";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { resolveAiConfig, streamSaferStepChat } = await import("@/lib/ai/chat.server");
        const config = resolveAiConfig(process.env);
        if (config.kind === "none") {
          // Friendly message only — the widget switches to Saved Guidance mode.
          return Response.json(
            { error: "The AI assistant is not available right now. Saved safety guidance is shown instead." },
            { status: 503 },
          );
        }
        let messages: UIMessage[];
        try {
          const body = (await request.json()) as { messages?: UIMessage[] };
          if (!Array.isArray(body.messages) || body.messages.length === 0) throw new Error();
          messages = body.messages.slice(-30);
        } catch {
          return Response.json({ error: "Invalid request." }, { status: 400 });
        }
        return streamSaferStepChat(request, config, await convertToModelMessages(messages));
      },
    },
  },
});
