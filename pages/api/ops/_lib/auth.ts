// Minimal bearer check with timing-safe compare
import crypto from "crypto";

const enc = (s: string) => Buffer.from(s);
export function checkAuth(authorization?: string) {
  const expected = process.env.AI_SECRET_TOKEN || "";
  if (!expected) return { ok: false, error: "Server missing AI_SECRET_TOKEN" };

  const token = (authorization || "").split(" ")[1] || "";
  // constant-time compare
  const a = enc(token);
  const b = enc(expected);
  const ok = a.length === b.length && crypto.timingSafeEqual(a, b);
  return ok ? { ok: true } : { ok: false, error: "Unauthorized" };
}
