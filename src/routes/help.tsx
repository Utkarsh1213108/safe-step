import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check, Phone } from "lucide-react";
import { useState } from "react";

import { openAssistant } from "@/components/assistant/AssistantWidget";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Lost money to a scam? Get help now — SaferStep" },
      { name: "description", content: "Step-by-step actions after cyber or investment fraud: contact your bank, call 1930 and report on cybercrime.gov.in." },
      { property: "og:title", content: "Lost money to a scam? Get help now — SaferStep" },
      { property: "og:description", content: "What to do right now after cyber or investment fraud in India." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Help,
});

const PATHS = {
  money: {
    label: "I lost money",
    steps: [
      "Call your bank on the number on your card or official app. Ask them to block the card/account and dispute the transaction.",
      "Call 1930, the National Cyber Crime Helpline, as soon as possible.",
      "File a complaint at cybercrime.gov.in and note your acknowledgement number.",
      "Save evidence: screenshots, transaction IDs, UPI IDs, phone numbers, links.",
      "Stop all contact with the scammer. Beware of \"recovery agents\" — they're often scammers too.",
    ],
  },
  details: {
    label: "I shared my details",
    steps: [
      "From a trusted device, change passwords — email first, then banking and UPI apps.",
      "Call your bank to block cards and reset net-banking.",
      "Uninstall any remote-access app (AnyDesk, TeamViewer) you were asked to install.",
      "Turn on two-factor authentication everywhere.",
      "Watch your statements for the next few weeks.",
    ],
  },
  account: {
    label: "My account was hacked",
    steps: [
      "Use 'Forgot password' to regain access, then log out of all devices.",
      "Inform your bank and freeze cards if any payment info was saved.",
      "Warn your contacts not to send money to requests from your account.",
      "Report at cybercrime.gov.in; call 1930 if money was taken.",
    ],
  },
} as const;
type Key = keyof typeof PATHS;

function Help() {
  const [path, setPath] = useState<Key>("money");
  const [done, setDone] = useState<Record<string, boolean>>({});
  const steps = PATHS[path].steps;
  const completed = steps.filter((_, i) => done[`${path}-${i}`]).length;

  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <div className="rounded-3xl bg-destructive p-6 text-destructive-foreground md:flex md:items-center md:justify-between">
        <div>
          <p className="font-display text-2xl font-bold">Lost money? Call 1930 now.</p>
          <p className="opacity-90">National Cyber Crime Helpline. Faster reporting improves the chances of stopping the transfer.</p>
        </div>
        <a href="tel:1930" className="mt-4 inline-flex items-center gap-2 rounded-full bg-destructive-foreground px-6 py-3 font-bold text-destructive md:mt-0">
          <Phone className="h-4 w-4" /> Call 1930
        </a>
      </div>

      <h1 className="mt-12 text-4xl font-bold">What happened?</h1>
      <div className="mt-6 flex flex-wrap gap-2" role="tablist">
        {(Object.keys(PATHS) as Key[]).map((k) => (
          <button key={k} role="tab" aria-selected={path === k} onClick={() => setPath(k)} className="relative rounded-full px-5 py-2.5 font-semibold">
            {path === k && <motion.span layoutId="tab" className="absolute inset-0 rounded-full bg-primary" />}
            <span className={`relative ${path === k ? "text-primary-foreground" : ""}`}>{PATHS[k].label}</span>
          </button>
        ))}
      </div>

      <p className="mt-6 text-sm text-muted-foreground">{completed} of {steps.length} steps done — tick them off as you go.</p>
      <ol className="mt-4 space-y-3">
        {steps.map((s, i) => {
          const id = `${path}-${i}`;
          return (
            <motion.li key={id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <button onClick={() => setDone((d) => ({ ...d, [id]: !d[id] }))} aria-pressed={!!done[id]} className={`flex w-full items-start gap-4 rounded-2xl border bg-card p-5 text-left transition ${done[id] ? "border-success" : "hover:border-blue"}`}>
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold ${done[id] ? "bg-success text-primary-foreground" : "bg-secondary"}`}>
                  {done[id] ? <Check className="h-4 w-4" /> : i + 1}
                </span>
                <span className={done[id] ? "text-muted-foreground line-through" : ""}>{s}</span>
              </button>
            </motion.li>
          );
        })}
      </ol>
      <button onClick={() => openAssistant(`${PATHS[path].label}. What should I do first?`)} className="mt-8 rounded-full bg-brand px-6 py-3 font-semibold text-navy-foreground">
        Get personalised steps from the assistant
      </button>
      <p className="mt-6 text-sm text-muted-foreground">SaferStep can't recover money for you and never asks for OTPs, passwords or bank details.</p>
    </section>
  );
}
