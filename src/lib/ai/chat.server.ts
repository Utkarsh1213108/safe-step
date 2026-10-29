import { createOpenAI } from "@ai-sdk/openai";
import { streamText, type ModelMessage } from "ai";

import {
  createLovableAiGatewayRunIdFetch,
  getLovableAiGatewayRunId,
  withLovableAiGatewayRunIdHeader,
} from "./run-id.server";

export const SAFERSTEP_INSTRUCTIONS = `You are the SaferStep Assistant, a calm, friendly guide on a financial safety and scam-awareness website for India. Users are often students, first-time investors and senior citizens.

Help them:
- Recognise suspicious investment offers, messages, fake links, fake apps, impersonation and "guaranteed returns".
- Verify information through official sources: SEBI registered intermediaries (sebi.gov.in), SEBI investor site (investor.sebi.gov.in), SCORES complaints (scores.sebi.gov.in), RBI (rbi.org.in, RBI Sachet sachet.rbi.org.in), the bank's official app/number printed on the card.
- Protect personal information if they shared details (change passwords from a trusted device, enable 2FA, inform bank, watch statements).
- Act if an account is compromised.
- Act fast if money was lost to cyber fraud: call the bank immediately to block/freeze, call the National Cyber Crime Helpline 1930 as soon as possible (ideally within the first hours), and report at https://cybercrime.gov.in. Keep screenshots, transaction IDs, and phone numbers.

Style: simple words, short sentences, numbered steps for actions, warm and non-judgemental. Ask at most one or two relevant questions when you need detail to choose next steps. Keep answers brief (under ~180 words) unless asked for more.

Hard rules:
- Never ask for or accept passwords, OTPs, PINs, CVV, full card or account numbers, or Aadhaar numbers. If the user shares any, tell them not to and to change it if it was shared with anyone else.
- Never recommend specific investments, stocks, apps or platforms, and never say an unverified platform is safe. Instead explain how to verify.
- Never promise money can be recovered; say quick reporting improves the chances.
- If someone is in immediate danger or distress, encourage contacting local emergency services (112) or a trusted person.
- You are not a lawyer or financial adviser; say so when relevant.`;

export function streamSaferStepChat(request: Request, apiKey: string, messages: ModelMessage[]) {
  const runIdFetch = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(request));
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });
  const result = streamText({
    model: provider.responses("openai/gpt-6-astra"),
    instructions: SAFERSTEP_INSTRUCTIONS,
    messages,
    abortSignal: request.signal,
    providerOptions: {
      openai: {
        store: false,
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        include: ["reasoning.encrypted_content"],
      },
    },
  });
  return withLovableAiGatewayRunIdHeader(result.toUIMessageStreamResponse(), runIdFetch);
}
