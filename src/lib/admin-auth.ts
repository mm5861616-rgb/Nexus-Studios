import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "nexus-admin-session";
const SESSION_DURATION_SECONDS = 8 * 60 * 60;

function getSecret() {
  const secret = process.env.NEXUS_ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("NEXUS_ADMIN_SESSION_SECRET must contain at least 32 characters.");
  }
  return secret;
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("base64url");
}

function safeEqual(left: string, right: string) {
  const leftDigest = createHmac("sha256", "nexus-admin-comparison").update(left).digest();
  const rightDigest = createHmac("sha256", "nexus-admin-comparison").update(right).digest();
  return timingSafeEqual(leftDigest, rightDigest);
}

export function verifyAdminPassword(password: string) {
  const configuredPassword = process.env.NEXUS_ADMIN_PASSWORD;
  if (!configuredPassword || configuredPassword.length < 16) {
    throw new Error("Set NEXUS_ADMIN_PASSWORD to a password with at least 16 characters.");
  }
  return safeEqual(password, configuredPassword);
}

export async function createAdminSession() {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS;
  const payload = `${expiresAt}.${randomBytes(16).toString("base64url")}`;
  const session = `${payload}.${sign(payload)}`;
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
}

export async function hasAdminSession() {
  try {
    const session = (await cookies()).get(COOKIE_NAME)?.value;
    if (!session) return false;
    const [expiresAt, nonce, signature, extra] = session.split(".");
    if (!expiresAt || !nonce || !signature || extra || Number(expiresAt) <= Math.floor(Date.now() / 1000)) {
      return false;
    }
    const payload = `${expiresAt}.${nonce}`;
    return safeEqual(signature, sign(payload));
  } catch {
    return false;
  }
}

export function isSameOriginRequest(request: Request) {
  const origin = request.headers.get("origin");
  return origin !== null && origin === new URL(request.url).origin;
}

export function hashClientAddress(address: string) {
  return createHmac("sha256", getSecret()).update(address).digest("hex");
}
