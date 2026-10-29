import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { useState } from "react";

import { openAssistant } from "@/components/assistant/AssistantWidget";

export const Route = createFileRoute("/verify")({
  head: () => ({
    meta: [
      { title: "Check an investment offer — SaferStep" },
      { name: "description", content: "Answer a few quick questions to see the risk level of an investment offer and how to verify it with SEBI." },
      { property: "og:title", content: "Check an investment offer — SaferStep" },
      { property: "og:description", content: "A quick risk checklist for suspicious investment offers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Verify,
});

const QUESTIONS = [
  { q: "Does it promise guaranteed or very high returns?", w: 3 },
  { q: "Did it come from a stranger on WhatsApp, Telegram, SMS or social media?", w: 2 },
  { q: "Are they rushing you or asking you to keep it secret?", w: 2 },
  { q: "Do they want payment to a personal UPI ID or bank account?", w: 3 },
  { q: "Is the app or website outside official app stores or a lookalike domain?", w: 3 },
  { q: "Have they asked for OTPs, passwords or remote-access apps?", w: 4 },
];
const MAX = QUESTIONS.reduce((n, q) => n + q.w, 0);

function Verify() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const score = QUESTIONS.reduce((n, q, i) => n + (answers[i] ? q.w : 0), 0);
  const pct = Math.round((score / MAX) * 100);
  const level = score === 0 ? "Answer the questions" : pct >= 40 ? "High risk — likely a scam" : pct >= 15 ? "Caution — verify first" : "Lower risk — still verify";
  const tone = pct >= 40 ? "bg-destructive" : pct >= 15 ? "bg-warning" : "bg-success";

  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-[1.3fr_1fr]">
      <div>
        <h1 className="text-4xl font-bold">Check an offer</h1>
        <p className="mt-3 text-muted-foreground">Tap Yes or No. Nothing you enter leaves your device.</p>
        <ol className="mt-8 space-y-3">
          {QUESTIONS.map((item, i) => (
            <li key={i} className="flex flex-col gap-3 rounded-2xl border bg-card p-4 sm:flex-row sm:items-center">
              <span className="flex-1 font-medium">{item.q}</span>
              <div className="flex gap-2">
                {[true, false].map((v) => (
                  <button
                    key={String(v)}
                    onClick={() => setAnswers((a) => ({ ...a, [i]: v }))}
                    aria-pressed={answers[i] === v}
                    className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${answers[i] === v ? "border-primary bg-primary text-primary-foreground" : "hover:bg-secondary"}`}
                  >
                    {v ? "Yes" : "No"}
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </div>

      <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-3xl bg-hero p-6 text-navy-foreground">
          <p className="text-sm opacity-80">Risk meter</p>
          <p className="mt-1 font-display text-2xl font-bold">{level}</p>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-navy-foreground/15">
            <motion.div className={`h-full ${tone}`} animate={{ width: `${pct}%` }} transition={{ type: "spring", stiffness: 90 }} />
          </div>
          <button onClick={() => openAssistant("I answered the offer checklist and want help deciding what to do next.")} className="mt-5 w-full rounded-full bg-brand py-2.5 font-semibold">
            Talk it through with the assistant
          </button>
        </div>
        <div className="rounded-3xl border bg-card p-6">
          <p className="font-display font-semibold">Verify with official sources</p>
          <ul className="mt-3 space-y-2 text-sm">
            {[
              ["SEBI registered intermediaries", "https://www.sebi.gov.in/intermediaries.html"],
              ["SEBI Investor website", "https://investor.sebi.gov.in"],
              ["RBI Sachet (unauthorised deposits)", "https://sachet.rbi.org.in"],
              ["Report cyber fraud", "https://cybercrime.gov.in"],
            ].map(([l, h]) => (
              <li key={h}>
                <a href={h} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue hover:underline">
                  {l} <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </section>
  );
}
