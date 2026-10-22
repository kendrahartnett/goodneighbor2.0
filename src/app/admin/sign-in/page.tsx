import Link from "next/link";
import { auth } from "@/auth";
import { signInAsAdmin, signOutAdmin } from "../actions";

export const metadata = { title: "Admin sign-in" };
export const dynamic = "force-dynamic";

export default async function AdminSignIn({ searchParams }: { searchParams: Promise<{ signedOut?: string }> }) {
  const session = await auth();
  const signedOut = (await searchParams).signedOut === "1";

  return <section className="shell admin-signin-shell"><div className="admin-notice">
    <p className="eyebrow">MANAGEMENT</p>
    <h1>Admin sign-in</h1>
    {session ? <>
      <p role="status">A GoodNeighbor session is still active. Sign out before choosing another GitHub account.</p>
      <form action={signOutAdmin}><button className="button" type="submit">Sign out of GoodNeighbor</button></form>
      <p><Link href="/admin">Return to dashboard</Link></p>
    </> : <>
      {signedOut && <p role="status">You are signed out of GoodNeighbor.</p>}
      <p>Management access is limited to the configured GitHub administrator. You can choose a GitHub account when you sign in.</p>
      <form action={signInAsAdmin}><button className="button" type="submit">Choose GitHub account</button></form>
    </>}
  </div></section>;
}
