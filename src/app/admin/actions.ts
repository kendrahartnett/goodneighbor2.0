"use server";

import { signIn, signOut } from "@/auth";

export async function signInAsAdmin() {
  await signIn("github", { redirectTo: "/admin" }, { prompt: "select_account" });
}

export async function signOutAdmin() {
  await signOut({ redirectTo: "/admin/sign-in?signedOut=1" });
}
