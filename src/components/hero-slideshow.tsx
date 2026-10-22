"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const slides = [
  { src: "/images/hero-neighbors-garden-v2.webp", alt: "Illustrative photo of neighbors planting seedlings together in a community garden." },
  { src: "/images/hero-neighbors-pantry-v2.webp", alt: "Illustrative photo of neighbors sorting fresh produce together at a food pantry." },
  { src: "/images/hero-neighbors-cleanup-v2.webp", alt: "Illustrative photo of neighbors cleaning up a tree-lined city park together." },
];

export function HeroSlideshow() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [failedImages, setFailedImages] = useState<number[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update(); media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (paused || reducedMotion) return;
    const timer = window.setInterval(() => setActive((index) => (index + 1) % slides.length), 6000);
    return () => window.clearInterval(timer);
  }, [paused, reducedMotion]);
  const move = (direction: number) => { setPaused(true); setActive((index) => (index + direction + slides.length) % slides.length); };

  return <section className="shell hero" aria-label="GoodNeighbor introduction">
    <div className="hero-fallback" aria-hidden="true" />
    {slides.map((slide, index) => <Image key={slide.src} className={`hero-media ${index === active && !failedImages.includes(index) ? "is-active" : ""}`} src={slide.src} alt={index === active ? slide.alt : ""} aria-hidden={index !== active} fill sizes="(max-width: 1200px) 100vw, 1200px" preload={index === 0} onError={() => setFailedImages((failed) => failed.includes(index) ? failed : [...failed, index])} />)}
    <div className="hero-scrim" aria-hidden="true" />
    <div className="hero-inner"><div className="hero-copy">
      <p className="eyebrow">CHICAGO, ILLINOIS</p>
      <h1>A little good goes a long way.</h1>
      <p>Find a way to pitch in, right where you live. Discover verified volunteer opportunities across Chicago.</p>
      <div className="hero-actions"><Link className="button" href="/opportunities">Explore opportunities <span className="button-arrow" aria-hidden="true">↗</span></Link><Link className="button-secondary" href="/about">How it works</Link></div>
    </div></div>
    <span className="image-disclosure">Illustrative imagery</span>
    <div className="slideshow-controls" role="group" aria-label="Hero image controls">
      <button type="button" onClick={() => move(-1)} aria-label="Previous photo">←</button>
      <span className="slide-count" role="status" aria-live="polite">{active + 1} / {slides.length}</span>
      <button type="button" onClick={() => move(1)} aria-label="Next photo">→</button>
      <button type="button" onClick={() => setPaused((value) => !value)} aria-label={paused ? "Play slideshow" : "Pause slideshow"}>{paused ? "▶" : "Ⅱ"}</button>
    </div>
  </section>;
}
