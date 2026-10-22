import "next-auth";
declare module "next-auth" { interface User { githubId?: string; githubLogin?: string } interface Session { user: User } }
