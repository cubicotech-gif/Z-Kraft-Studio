import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "zk_admin";
const MAX_AGE = 60 * 60 * 24 * 7;

function secret() {
  const s = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD;
  return s ? s : null;
}
function sign(payload: string, key: string) {
  return createHmac("sha256", key).update(payload).digest("hex");
}
function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function adminConfigured() {
  return !!process.env.ADMIN_PASSWORD && !!secret();
}

export function passwordMatches(input: string) {
  const pw = process.env.ADMIN_PASSWORD;
  return !!pw && safeEqual(sign(input, "pw"), sign(pw, "pw"));
}

export async function startSession() {
  const key = secret();
  if (!key) return;
  const exp = String(Date.now() + MAX_AGE * 1000);
  (await cookies()).set(COOKIE, `${exp}.${sign(exp, key)}`, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: MAX_AGE });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin() {
  const key = secret();
  if (!key || !process.env.ADMIN_PASSWORD) return false;
  const v = (await cookies()).get(COOKIE)?.value;
  if (!v) return false;
  const [exp, mac] = v.split(".");
  return !!exp && !!mac && Number(exp) > Date.now() && safeEqual(mac, sign(exp, key));
}
