import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, MicOff, RotateCcw, ShieldCheck, Volume2, VolumeX, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputButton,
  PromptInputFooter,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputController,
} from "@/components/ai-elements/prompt-input";
import { findGuidance, looksSensitive } from "@/lib/guidance";
import { useSpeechInput, useSpeechOutput } from "@/hooks/use-speech";
import { Button } from "@/components/ui/button";

const STARTERS = [
  "I got a message promising guaranteed returns",
  "I lost money to a scam — what now?",
  "How do I check if an advisor is SEBI registered?",
  "I shared my OTP by mistake",
];

export const OPEN_ASSISTANT_EVENT = "saferstep:open-assistant";

function textOf(m: UIMessage) {
  return m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
}

export function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [seed, setSeed] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      setOpen(true);
      const q = (e as CustomEvent<string | undefined>).detail;
      if (q) setSeed(q);
    };
    window.addEventListener(OPEN_ASSISTANT_EVENT, handler);
    return () => window.removeEventListener(OPEN_ASSISTANT_EVENT, handler);
  }, []);

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.section
            role="dialog"
            aria-label="SaferStep Assistant"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed inset-x-3 bottom-24 z-50 flex h-[min(640px,calc(100dvh-8rem))] flex-col overflow-hidden rounded-3xl border bg-card shadow-glow sm:inset-x-auto sm:right-6 sm:w-[420px]"
          >
            <PromptInputProvider>
              <ChatPanel onClose={() => setOpen(false)} seed={seed} clearSeed={() => setSeed(null)} />
            </PromptInputProvider>
          </motion.section>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close assistant" : "Open SaferStep Assistant"}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-brand text-navy-foreground shadow-glow animate-pulse-ring"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "x" : "s"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
          >
            {open ? <X className="h-7 w-7" /> : <ShieldCheck className="h-8 w-8" />}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </>
  );
}

function ChatPanel({ onClose, seed, clearSeed }: { onClose: () => void; seed: string | null; clearSeed: () => void }) {
  const [mode, setMode] = useState<"ai" | "guided">("ai");
  const [speakOn, setSpeakOn] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);
  const [serviceError, setServiceError] = useState<string | null>(null);
  const lastUser = useRef("");
  const controller = usePromptInputController();
  const tts = useSpeechOutput();
  const mic = useSpeechInput((t) => controller.textInput.setInput(t));

  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const { messages, sendMessage, status, stop, setMessages } = useChat({
    transport,
    onError: (error) => {
      setServiceError(error.message || "AI is unavailable. Saved safety guidance is shown below.");
      setMode("guided");
      setMessages((prev) => [
        ...prev,
        {
          id: `guide-${Date.now()}`,
          role: "assistant",
          parts: [{ type: "text", text: findGuidance(lastUser.current) }],
        },
      ]);
    },
  });

  const busy = status === "submitted" || status === "streaming";
  const submitStatus = mode === "guided" ? "ready" : status;

  // Speak the last finished assistant reply.
  const spokenId = useRef<string | null>(null);
  useEffect(() => {
    if (!speakOn || busy) return;
    const last = messages[messages.length - 1];
    if (last?.role === "assistant" && last.id !== spokenId.current) {
      spokenId.current = last.id;
      tts.speak(textOf(last));
    }
  }, [messages, busy, speakOn, tts]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t || busy) return;
    if (looksSensitive(t)) {
      setWarning("That looks like an OTP, PIN or password. Please never share these — not even with us.");
      return;
    }
    setWarning(null);
    lastUser.current = t;
    if (mode === "guided") {
      setMessages((prev) => [
        ...prev,
        { id: `u-${Date.now()}`, role: "user", parts: [{ type: "text", text: t }] },
        { id: `g-${Date.now()}`, role: "assistant", parts: [{ type: "text", text: findGuidance(t) }] },
      ]);
    } else {
      sendMessage({ text: t });
    }
    controller.textInput.clear();
  };

  useEffect(() => {
    if (seed) {
      send(seed);
      clearSeed();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed]);

  return (
    <>
      <header className="flex items-center gap-3 bg-hero px-4 py-3 text-navy-foreground">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display font-semibold leading-tight">SaferStep Assistant</p>
          <p className="text-xs opacity-80">
            {mode === "ai" ? "AI guidance · never asks for OTPs or passwords" : "Guided mode · trusted saved answers"}
          </p>
        </div>
        {tts.supported && (
          <button
            type="button"
            onClick={() => {
              if (speakOn) tts.cancel();
              setSpeakOn(!speakOn);
            }}
            aria-label={speakOn ? "Turn off spoken replies" : "Read replies aloud"}
            aria-pressed={speakOn}
            className="rounded-full p-2 transition hover:bg-navy-foreground/10"
          >
            {speakOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            stop();
            tts.cancel();
            setMessages([]);
            setMode("ai");
          }}
          aria-label="Start over"
          className="rounded-full p-2 transition hover:bg-navy-foreground/10"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
        <button type="button" onClick={onClose} aria-label="Close" className="rounded-full p-2 transition hover:bg-navy-foreground/10">
          <X className="h-5 w-5" />
        </button>
      </header>

      <div className="flex items-center gap-2 border-b px-4 py-2">
        <Button size="sm" variant={mode === "ai" ? "default" : "outline"} disabled={busy} aria-pressed={mode === "ai"} onClick={() => { setMode("ai"); setServiceError(null); }}>AI</Button>
        <Button size="sm" variant={mode === "guided" ? "default" : "outline"} disabled={busy} aria-pressed={mode === "guided"} onClick={() => { setMode("guided"); setServiceError(null); }}>Saved guidance</Button>
      </div>

      <Conversation className="flex-1">
        <ConversationContent className="gap-5 p-4">
          {messages.length === 0 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Hi! Tell me what happened, or pick a common question. Please don't share passwords, OTPs or bank details.
              </p>
              <div className="grid gap-2">
                {STARTERS.map((s, i) => (
                  <motion.button
                    key={s}
                    type="button"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                    onClick={() => send(s)}
                    className="rounded-2xl border bg-secondary px-3 py-2 text-left text-sm transition hover:border-blue hover:bg-card"
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m) => (
            <Message key={m.id} from={m.role}>
              <MessageContent className={m.role === "user" ? "group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground" : ""}>
                {m.parts.map((p, i) => (p.type === "text" ? <MessageResponse key={i}>{p.text}</MessageResponse> : null))}
              </MessageContent>
            </Message>
          ))}
          {status === "submitted" && (
            <div className="flex gap-1.5 px-1" aria-label="Assistant is typing">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="h-2 w-2 rounded-full bg-teal"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                />
              ))}
            </div>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-t p-3">
        {serviceError && <p role="alert" className="mb-2 text-sm text-destructive">{serviceError}</p>}
        {warning && <p className="mb-2 rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{warning}</p>}
        <PromptInput onSubmit={(msg) => send(msg.text)}>
          <PromptInputTextarea autoFocus placeholder={mic.listening ? "Listening…" : "Describe what happened…"} />
          <PromptInputFooter>
            <PromptInputTools>
              {mic.supported && (
                <PromptInputButton
                  onClick={mic.toggle}
                  aria-label={mic.listening ? "Stop voice input" : "Speak your question"}
                  className={mic.listening ? "text-destructive" : ""}
                >
                  {mic.listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </PromptInputButton>
              )}
              <span className="text-xs text-muted-foreground">Emergency? Call 1930</span>
            </PromptInputTools>
            <PromptInputSubmit status={submitStatus} onStop={stop} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </>
  );
}

export function openAssistant(question?: string) {
  window.dispatchEvent(new CustomEvent(OPEN_ASSISTANT_EVENT, { detail: question }));
}
