import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, type UIMessage } from "ai";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env['LOVABLE_API_KEY'];
        if (!apiKey) {
          return Response.json({ error: "AI is not configured." }, { status: 503 });
        }
        let messages: UIMessage[];
        try {
          const body = (await request.json()) as { messages?: UIMessage[] };
          if (!Array.isArray(body.messages) || body.messages.length === 0) throw new Error();
          messages = body.messages.slice(-30);
        } catch {
          return Response.json({ error: "Invalid request." }, { status: 400 });
        }
        const { streamSaferStepChat } = await import("@/lib/ai/chat.server");
        return streamSaferStepChat(request, apiKey, await convertToModelMessages(messages));
      },
    },
  },
});
