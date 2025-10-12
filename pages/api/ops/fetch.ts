import type { NextApiRequest, NextApiResponse } from "next";
import { checkAuth } from "./_lib/auth";

// For now returns a mock payload so you can finish Agent Builder.
// Replace the TODO with your real Gmail logic later.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const auth = checkAuth(req.headers.authorization as string | undefined);
  if (!auth.ok) return res.status(401).json({ error: auth.error });

  console.log("[/api/ops/fetch] OK"); // check Vercel logs

  // TODO: plug in Gmail queries + parsing here.
  const report =
    "🚨 911 — None in last 12h.\n" +
    "📅 Deadlines: \n" +
    " - Manager Schedule P5 due Fri Oct 17 2025.\n" +
    " - Confirm schedule ready by 4 PM today.\n" +
    "🧾 Checklist: submit P5, send confirmation.";

  return res.status(200).json({
    ok: true,
    report,
    counts: { hs: 0, brinker: 2, hs911: 0, deliverables: 2 },
    dashboard: "inline",
  });
}
