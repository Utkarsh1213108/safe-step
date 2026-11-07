import { describe, expect, it } from "vitest";
import { looksSensitive } from "@/lib/guidance";
import { resolveAiConfig } from "@/lib/ai/chat.server";

describe("Assistant sensitive input protection", () => {
  it("blocks an OTP value before a message is sent", () => {
    expect(looksSensitive("My OTP is 123456")).toBe(true);
  });
  it("allows asking for help without exposing an OTP", () => {
    expect(looksSensitive("I shared my OTP by mistake")).toBe(false);
  });
});

describe("AI key resolution across deployments", () => {
  it("prefers the managed Lovable key when present", () => {
    expect(resolveAiConfig({ LOVABLE_API_KEY: "lk", OPENAI_API_KEY: "ok" })).toEqual({ kind: "lovable", apiKey: "lk" });
  });
  it("falls back to an own OpenAI key on external hosting", () => {
    expect(resolveAiConfig({ OPENAI_API_KEY: "ok" })).toEqual({ kind: "openai", apiKey: "ok" });
  });
  it("reports no configuration when neither key exists", () => {
    expect(resolveAiConfig({})).toEqual({ kind: "none" });
  });
});