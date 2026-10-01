"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "samyo_admin";

export async function login(_prev: { error?: string } | undefined, form: FormData) {
  const code = String(form.get("code") ?? "").trim();
  const expected = process.env.ADMIN_DEMO_CODE ?? "samyo-demo";
  if (code !== expected) return { error: "Code incorrect." };
  (await cookies()).set(COOKIE, "1", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 12 });
  const next = String(form.get("next") ?? "");
  redirect(next.startsWith("/admin-demo") ? next : "/admin-demo");
}

export async function logout() {
  (await cookies()).delete(COOKIE);
  redirect("/admin-demo/login");
}
