import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, profile }) {
      if (profile && "id" in profile) token.githubId = String(profile.id);
      if (profile && "login" in profile) token.githubLogin = String(profile.login).toLowerCase();
      return token;
    },
    async session({ session, token }) {
      session.user.githubId = token.githubId as string | undefined;
      session.user.githubLogin = token.githubLogin as string | undefined;
      return session;
    },
  },
});
