import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, RotateCcw, Trophy, XCircle } from "lucide-react";
import { useState } from "react";

import { openAssistant } from "@/components/assistant/AssistantWidget";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "Practice scam scenarios — SaferStep" },
      { name: "description", content: "Interactive scenarios that teach you to spot fake investment offers, KYC calls and trading-group scams." },
      { property: "og:title", content: "Practice scam scenarios — SaferStep" },
      { property: "og:description", content: "Interactive scenarios to spot fake investment offers and impersonation scams." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Learn,
});

type Scenario = {
  who: string;
  channel: string;
  message: string;
  options: { text: string; correct: boolean; why: string }[];
};

const SCENARIOS: Scenario[] = [
  {
    who: "Student",
    channel: "WhatsApp",
    message: "Hi! I'm Priya from Alpha Wealth 🚀 Our members earn 4% daily on crypto. Guaranteed! Join with just ₹2,000 today.",
    options: [
      { text: "Invest a small amount to test it", correct: false, why: "Scammers often let small amounts \"grow\" to win trust before taking larger sums." },
      { text: "Ignore, block and report the number", correct: true, why: "Guaranteed daily returns are a classic scam sign. Block and report at cybercrime.gov.in." },
      { text: "Ask them for their registration proof", correct: false, why: "Fake certificates are easy to make. Verify yourself on sebi.gov.in instead." },
    ],
  },
  {
    who: "Senior citizen",
    channel: "Phone call",
    message: "Sir, this is your bank. Your pension account will be blocked today. Please tell me the OTP we just sent to update KYC.",
    options: [
      { text: "Share the OTP so the account isn't blocked", correct: false, why: "No bank ever asks for your OTP. Sharing it lets fraudsters move your money." },
      { text: "Hang up and call the number on your bank card", correct: true, why: "Always contact the bank yourself using official numbers." },
      { text: "Give only half of the OTP", correct: false, why: "Never share any part of an OTP or PIN." },
    ],
  },
  {
    who: "First-time investor",
    channel: "Telegram",
    message: "Welcome to VIP Stock Tips 📊 Download our app (link below, not on Play Store) to get 300% returns from IPO allotments.",
    options: [
      { text: "Install the app from the link", correct: false, why: "Apps outside official stores can steal data and show fake profits." },
      { text: "Check the advisor on SEBI's registered list", correct: true, why: "Only SEBI-registered advisors can give investment advice. Verify before anything else." },
      { text: "Trust it because the group has 50,000 members", correct: false, why: "Most members of these groups are often fake accounts or bots." },
    ],
  },
  {
    who: "Anyone",
    channel: "SMS",
    message: "Your SEBI investor account is suspended. Verify now: sebi-verify-kyc.in/login",
    options: [
      { text: "Open the link and log in quickly", correct: false, why: "SEBI's official site is sebi.gov.in. Lookalike domains are phishing." },
      { text: "Delete it and go to sebi.gov.in directly", correct: true, why: "Type official addresses yourself instead of clicking links in messages." },
    ],
  },
];

function Learn() {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const done = idx >= SCENARIOS.length;
  const s = SCENARIOS[idx];

  const choose = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (s.options[i].correct) setScore((n) => n + 1);
  };
  const next = () => {
    setPicked(null);
    setIdx((n) => n + 1);
  };

  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold">Practice scenarios</h1>
      <p className="mt-3 text-muted-foreground">Read each message and choose what you'd do. You'll see why straight away.</p>

      <div className="mt-8 h-2 overflow-hidden rounded-full bg-secondary" aria-label="Progress">
        <motion.div className="h-full bg-brand" animate={{ width: `${(Math.min(idx, SCENARIOS.length) / SCENARIOS.length) * 100}%` }} />
      </div>

      <AnimatePresence mode="wait">
        {done ? (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-10 rounded-3xl bg-hero p-10 text-center text-navy-foreground">
            <motion.div animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.8 }}>
              <Trophy className="mx-auto h-14 w-14 text-teal" />
            </motion.div>
            <p className="mt-4 font-display text-3xl font-bold">{score} / {SCENARIOS.length} safe choices</p>
            <p className="mt-2 opacity-85">{score === SCENARIOS.length ? "Excellent — you'd spot these scams." : "Good effort! Every practice run makes you safer."}</p>
            <button onClick={() => { setIdx(0); setScore(0); }} className="glass mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold">
              <RotateCcw className="h-4 w-4" /> Try again
            </button>
          </motion.div>
        ) : (
          <motion.div key={idx} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="mt-10">
            <p className="text-sm font-semibold text-blue">Scenario {idx + 1} · {s.who} · {s.channel}</p>
            <div className="mt-3 rounded-3xl rounded-tl-md border bg-card p-6 text-lg shadow-soft">{s.message}</div>
            <div className="mt-6 grid gap-3">
              {s.options.map((o, i) => {
                const state = picked === null ? "idle" : o.correct ? "right" : picked === i ? "wrong" : "dim";
                return (
                  <motion.button
                    key={i}
                    whileHover={picked === null ? { x: 6 } : undefined}
                    onClick={() => choose(i)}
                    disabled={picked !== null}
                    className={`flex items-start gap-3 rounded-2xl border-2 p-4 text-left transition ${
                      state === "right" ? "border-success bg-success/10" : state === "wrong" ? "border-destructive bg-destructive/10" : state === "dim" ? "opacity-50" : "hover:border-blue"
                    }`}
                  >
                    {state === "right" && <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />}
                    {state === "wrong" && <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />}
                    <span>
                      <span className="font-medium">{o.text}</span>
                      {picked !== null && (state === "right" || state === "wrong") && (
                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-1 block text-sm text-muted-foreground">{o.why}</motion.span>
                      )}
                    </span>
                  </motion.button>
                );
              })}
            </div>
            {picked !== null && (
              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={next} className="rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">Next scenario</button>
                <button onClick={() => openAssistant(`Explain this scam scenario: "${s.message}"`)} className="rounded-full border px-6 py-3 font-semibold hover:bg-secondary">Ask the assistant why</button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
