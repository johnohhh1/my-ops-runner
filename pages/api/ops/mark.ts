import type { NextApiRequest, NextApiResponse } from "next";
import { checkAuth } from "./_lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const auth = checkAuth(req.headers.authorization as string | undefined);
  if (!auth.ok) return res.status(401).json({ error: auth.error });

  const { id } = (req.body ?? {}) as { id?: string };
  if (!id) return res.status(400).json({ error: "Missing id" });

  // TODO: mark in your store/Notion/DB
  return res.status(200).json({ ok: true, marked: id });
}
