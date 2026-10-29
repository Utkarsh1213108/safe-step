import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { AlertTriangle, ArrowRight, BadgeCheck, GraduationCap, HeartHandshake, Link2, MessageCircle, Phone, TrendingUp, UserRound } from "lucide-react";
import { useState } from "react";

import { openAssistant } from "@/components/assistant/AssistantWidget";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SaferStep — Spot investment scams, act fast" },
      { name: "description", content: "Recognise investment scams, verify offers with official sources, and get step-by-step help if you've been targeted." },
      { property: "og:title", content: "SaferStep — Spot investment scams, act fast" },
      { property: "og:description", content: "Recognise investment scams, verify offers with official sources, and get step-by-step help." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const SIGNS = [
  { icon: TrendingUp, title: "Guaranteed returns", text: "\"Double your money in 30 days\" — real investments never guarantee profit." },
  { icon: MessageCircle, title: "Trading groups", text: "WhatsApp or Telegram \"tips\" groups with fake profit screenshots." },
  { icon: Link2, title: "Lookalike links", text: "Domains like sebi-gov.co or apps outside official stores." },
  { icon: AlertTriangle, title: "Pressure & secrecy", text: "\"Only 2 slots left\" or \"don't tell your family\" are big red flags." },
];

const AUDIENCES = [
  { icon: GraduationCap, title: "Students", text: "Fake internships, crypto pumps and finfluencer schemes." },
  { icon: BadgeCheck, title: "First-time investors", text: "Unregistered advisors and fake trading apps." },
  { icon: UserRound, title: "Senior citizens", text: "Impersonation calls, KYC updates and pension frauds." },
];

function Index() {
  return (
    <>
      <Hero />
      <section className="mx-auto max-w-6xl px-4 py-20">
        <Reveal>
          <p className="font-display text-sm font-semibold uppercase tracking-widest text-blue">Warning signs</p>
          <h2 className="mt-2 max-w-2xl text-3xl font-bold md:text-4xl">Four signs a "great opportunity" is really a scam</h2>
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SIGNS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08}>
              <TiltCard>
                <s.icon className="h-8 w-8 text-teal" />
                <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-secondary py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-2">
          <Reveal>
            <h2 className="text-3xl font-bold md:text-4xl">Practise before it happens for real</h2>
            <p className="mt-4 text-muted-foreground">Walk through realistic messages and calls. Decide what you'd do, and learn why — no judgement, just practice.</p>
            <Link to="/learn" className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-soft transition hover:translate-x-1">
              Try a scenario <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
          <div className="grid gap-4">
            {AUDIENCES.map((a, i) => (
              <Reveal key={a.title} delay={i * 0.1}>
                <div className="flex items-start gap-4 rounded-2xl bg-card p-5 shadow-soft">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand text-navy-foreground"><a.icon className="h-6 w-6" /></span>
                  <div>
                    <h3 className="font-semibold">{a.title}</h3>
                    <p className="text-sm text-muted-foreground">{a.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-hero p-8 text-navy-foreground md:p-12">
            <div className="absolute inset-0 grid-dots opacity-40" />
            <div className="relative grid items-center gap-8 md:grid-cols-[1fr_auto]">
              <div>
                <h2 className="text-3xl font-bold">Lost money? Act in the first hour.</h2>
                <p className="mt-3 max-w-xl opacity-85">Call your bank to block the transaction, then call 1930 and report at cybercrime.gov.in. Quick reporting gives the best chance.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a href="tel:1930" className="inline-flex items-center gap-2 rounded-full bg-destructive px-6 py-3 font-bold text-destructive-foreground"><Phone className="h-4 w-4" /> Call 1930</a>
                <Link to="/help" className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold">Step-by-step help</Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

function Hero() {
  const [q, setQ] = useState("");
  return (
    <section className="relative overflow-hidden bg-hero text-navy-foreground">
      <div className="absolute inset-0 grid-dots opacity-30" />
      <motion.div className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-teal/30 blur-3xl" animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 8 }} />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 md:py-28 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm">
            <HeartHandshake className="h-4 w-4 text-teal" /> Free, private, no sign-up
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-6 text-4xl font-extrabold md:text-6xl">
            If it sounds too good, <span className="text-brand">take a SaferStep.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-5 max-w-xl text-lg opacity-85">
            Spot investment scams, verify offers with official sources, and know exactly what to do if something has gone wrong.
          </motion.p>
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={(e) => {
              e.preventDefault();
              openAssistant(q.trim() || undefined);
              setQ("");
            }}
            className="glass mt-8 flex max-w-xl items-center gap-2 rounded-full p-1.5"
          >
            <label htmlFor="hero-q" className="sr-only">Ask the assistant</label>
            <input id="hero-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Paste or describe a suspicious offer…" className="min-w-0 flex-1 bg-transparent px-4 py-2 placeholder:text-navy-foreground/60 focus:outline-none" />
            <button className="rounded-full bg-brand px-5 py-2.5 font-semibold">Ask</button>
          </motion.form>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <Link to="/verify" className="underline-offset-4 hover:underline">Check an offer →</Link>
            <Link to="/learn" className="underline-offset-4 hover:underline">Practise scenarios →</Link>
          </div>
        </div>
        <HeroVisual />
      </div>
    </section>
  );
}

function HeroVisual() {
  const cards = [
    { t: "📈 Earn 5% DAILY. Guaranteed!", flag: "Guaranteed returns", r: -6 },
    { t: "Your KYC expires today. Click bit.ly/kyc-upd8", flag: "Fake link", r: 4 },
    { t: "Join VIP group, pay ₹9,999 to unlock tips", flag: "Upfront fee", r: -2 },
  ];
  return (
    <div className="relative mx-auto h-80 w-full max-w-sm animate-float">
      {cards.map((c, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 40, rotate: 0 }}
          animate={{ opacity: 1, y: i * 88, rotate: c.r }}
          transition={{ delay: 0.4 + i * 0.2, type: "spring", stiffness: 120 }}
          whileHover={{ scale: 1.04, rotate: 0, zIndex: 10 }}
          className="absolute inset-x-0 rounded-2xl bg-card p-4 text-card-foreground shadow-glow"
        >
          <p className="text-sm font-medium">{c.t}</p>
          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-bold text-destructive">
            <AlertTriangle className="h-3 w-3" /> {c.flag}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

function TiltCard({ children }: { children: React.ReactNode }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]));
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]));
  return (
    <motion.div
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 800 }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left) / r.width - 0.5);
        y.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className="h-full rounded-2xl border bg-card p-6 shadow-soft transition-shadow hover:shadow-glow"
    >
      {children}
    </motion.div>
  );
}
