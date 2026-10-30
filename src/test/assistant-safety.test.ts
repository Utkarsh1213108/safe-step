import { describe, expect, it } from "vitest";
import { looksSensitive } from "@/lib/guidance";

describe("Assistant sensitive input protection", () => {
  it("blocks an OTP value before a message is sent", () => {
    expect(looksSensitive("My OTP is 123456")).toBe(true);
  });
  it("allows asking for help without exposing an OTP", () => {
    expect(looksSensitive("I shared my OTP by mistake")).toBe(false);
  });
});