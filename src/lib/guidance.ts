// Curated, offline guidance used when the AI service is unavailable.
export type Guidance = { id: string; keywords: string[]; answer: string };

export const GUIDANCE: Guidance[] = [
  {
    id: "lost-money",
    keywords: ["lost", "money", "debited", "transferred", "paid", "fraud", "stolen", "upi", "refund"],
    answer: `**Act now — every minute counts.**

1. **Call your bank** on the number printed on your card or in the official app. Ask them to block the card/account and flag the transaction.
2. **Call 1930**, the National Cyber Crime Helpline, as soon as possible.
3. **Report online** at [cybercrime.gov.in](https://cybercrime.gov.in).
4. **Save evidence:** screenshots, transaction IDs, phone numbers, links.

Recovery can't be guaranteed, but reporting quickly gives you the best chance.`,
  },
  {
    id: "compromised",
    keywords: ["hacked", "compromised", "otp", "password", "shared", "login", "account", "access"],
    answer: `**If you shared details or think your account is compromised:**

1. From a trusted device, **change your passwords** (email first, then banking).
2. **Call your bank** to block cards and reset net-banking access.
3. Turn on **two-factor authentication**.
4. Check recent transactions; if money moved, call **1930** right away.

Never share OTPs or PINs — no genuine bank or SEBI official will ask for them.`,
  },
  {
    id: "verify",
    keywords: ["verify", "registered", "sebi", "genuine", "real", "legit", "advisor", "broker", "app", "platform"],
    answer: `**How to verify an investment offer:**

1. Search the name on SEBI's registered intermediaries list at [sebi.gov.in](https://www.sebi.gov.in).
2. Check [investor.sebi.gov.in](https://investor.sebi.gov.in) for investor alerts.
3. Download apps only from official stores and the company's official website.
4. Call the company using contact details from the official site, not the message.

If they're not registered, don't invest.`,
  },
  {
    id: "suspicious",
    keywords: ["guaranteed", "returns", "message", "whatsapp", "telegram", "link", "offer", "scam", "suspicious", "tip", "group"],
    answer: `**Common warning signs:**

- "Guaranteed" or very high returns, like 5% a day
- Pressure to act fast or keep it secret
- Requests to pay into personal UPI IDs
- WhatsApp/Telegram "trading groups" with fake screenshots of profits
- Links with misspelled domains

Don't click, don't pay, and verify via official sources. Want to tell me what the message says (without personal details)?`,
  },
];

const FALLBACK = `I'm in **guided mode** right now, so I'll share trusted steps.

- **Lost money?** Call your bank, then **1930**, and report at [cybercrime.gov.in](https://cybercrime.gov.in).
- **Suspicious offer?** Verify on [sebi.gov.in](https://www.sebi.gov.in) before paying anything.
- **Shared details?** Change passwords and call your bank.

Tell me which one fits you best.`;

export function findGuidance(text: string): string {
  const q = text.toLowerCase();
  let best: Guidance | null = null;
  let score = 0;
  for (const g of GUIDANCE) {
    const s = g.keywords.reduce((n, k) => n + (q.includes(k) ? 1 : 0), 0);
    if (s > score) {
      score = s;
      best = g;
    }
  }
  return best ? best.answer : FALLBACK;
}

const SENSITIVE = /\b(\d{6}|\d{4}\s?\d{4}\s?\d{4}(\s?\d{4})?|\d{3})\b.*\b(otp|pin|cvv|password)\b|\b(otp|pin|cvv|password)\b\D{0,15}\d{3,}/i;
export function looksSensitive(text: string): boolean {
  return SENSITIVE.test(text);
}
