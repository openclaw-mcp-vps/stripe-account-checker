import { cookies } from "next/headers";

export const PAID_COOKIE_NAME = "sac_paid";
export const PAID_COOKIE_VALUE = "1";

export async function hasPaidAccess() {
  const store = await cookies();
  return store.get(PAID_COOKIE_NAME)?.value === PAID_COOKIE_VALUE;
}

export async function grantPaidAccess(maxAgeDays = 30) {
  const store = await cookies();
  store.set(PAID_COOKIE_NAME, PAID_COOKIE_VALUE, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * maxAgeDays
  });
}

export async function revokePaidAccess() {
  const store = await cookies();
  store.delete(PAID_COOKIE_NAME);
}
