import { auth } from "@/auth";

export async function requireAdmin() {
  const session = await auth();

  if (!session?.user) return { ok: false as const, status: 401, session: null };

  const id = process.env.ADMIN_GITHUB_ID;
  const login = process.env.ADMIN_GITHUB_LOGIN?.trim().toLowerCase();
  const allowed = (id && session.user.githubId === id) || (login && session.user.githubLogin === login);

  return allowed
    ? { ok: true as const, session }
    : { ok: false as const, status: 403, session };
}
