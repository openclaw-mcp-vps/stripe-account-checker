import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const ACCESS_COOKIE = "sca_access";
const PURCHASE_FILE = resolve(process.cwd(), "data", "purchases.json");

type PurchaseRecord = {
  orderId: string;
  email: string | null;
  status: string;
  createdAt: string;
};

async function readPurchases(): Promise<PurchaseRecord[]> {
  try {
    const raw = await readFile(PURCHASE_FILE, "utf8");
    return JSON.parse(raw) as PurchaseRecord[];
  } catch {
    return [];
  }
}

async function writePurchases(records: PurchaseRecord[]) {
  await writeFile(PURCHASE_FILE, JSON.stringify(records, null, 2), "utf8");
}

export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;

  const digest = createHmac("sha256", secret).update(rawBody).digest("hex");
  const expected = Buffer.from(digest, "utf8");
  const provided = Buffer.from(signature, "utf8");
  return expected.length === provided.length && timingSafeEqual(expected, provided);
}

export async function storeSuccessfulPurchase(orderId: string, email: string | null, status: string) {
  const existing = await readPurchases();
  const withoutCurrent = existing.filter((p) => p.orderId !== orderId);
  withoutCurrent.push({
    orderId,
    email,
    status,
    createdAt: new Date().toISOString()
  });
  await writePurchases(withoutCurrent);
}

export async function hasSuccessfulPurchase(orderId: string): Promise<boolean> {
  const existing = await readPurchases();
  return existing.some((p) => p.orderId === orderId && ["paid", "active", "completed"].includes(p.status));
}

function signAccessPayload(payload: string) {
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET ?? "development-secret";
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export async function grantAccessCookie(orderId: string) {
  const token = `${orderId}.${signAccessPayload(orderId)}`;
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 31
  });
}

export async function hasAccessCookie() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(ACCESS_COOKIE)?.value;
  if (!raw) return false;

  const [orderId, signature] = raw.split(".");
  if (!orderId || !signature) return false;
  return signAccessPayload(orderId) === signature;
}

export async function clearAccessCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_COOKIE);
}
