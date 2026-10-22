import "./site.css";
import Link from "next/link";
import type { Metadata } from "next";
import { Brand } from "@/components/brand";
export const metadata: Metadata = { title: { default: "GoodNeighbor | Chicago volunteering", template: "%s | GoodNeighbor" }, description: "Verified Chicago volunteer opportunities." };
export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>
    <a className="skip" href="#main">Skip to content</a>
    <header className="shell site-header">
      <Brand />
      <nav className="primary-nav" aria-label="Primary">
        <Link href="/opportunities">Opportunities</Link>
        <Link href="/about">About</Link>
        <Link href="/admin">Admin</Link>
      </nav>
    </header>
    <main id="main">{children}</main>
    <footer className="site-footer"><div className="shell footer-inner">
      <div><Brand footer /><p>Small ways to show up for Chicago. Browse verified opportunities, then connect directly with the organizers doing the work.</p></div>
      <nav className="footer-links" aria-label="Footer"><Link href="/opportunities">Explore opportunities</Link><Link href="/about">About</Link></nav>
    </div></footer>
  </body></html>;
}
