import Link from "next/link";

export function Brand({ footer = false }: { footer?: boolean }) {
  return <Link className={`brand${footer ? " brand-footer" : ""}`} href="/" aria-label="GoodNeighbor home">
    <svg className="brand-icon" viewBox="0 0 64 64" role="img" aria-hidden="true" focusable="false">
      <circle cx="32" cy="32" r="31" fill="#DFE9DD" />
      <path d="M10 28 32 10l22 18M17 26v25m30-25v25" fill="none" stroke="#244B3C" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M32 44c-5.2-4.3-12-8.5-12-14.2a7 7 0 0 1 12-4.7 7 7 0 0 1 12 4.7C44 35.5 37.2 39.7 32 44Z" fill="#C87555" />
    </svg>
    <span className="brand-name">goodneighbor</span>
  </Link>;
}
