import Image from "next/image";
import Link from "next/link";

export const metadata = { title: "About GoodNeighbor", description: "Building a stronger Chicago, one neighbor at a time." };

export default function About() {
  return <article className="shell about-page">
    <header className="about-lead"><p className="eyebrow">OUR STORY</p><h1>About GoodNeighbor</h1><h2>Building a Stronger Chicago, One Neighbor at a Time</h2><p>At <strong>GoodNeighbor</strong>, we believe that strong communities start with people who care about one another. We&apos;re a volunteer-run initiative dedicated to bringing people together, lending a helping hand, and making a positive difference throughout Chicago.</p></header>
    <figure className="about-image"><Image src="/images/hero-neighbors-garden-v2.webp" alt="Illustrative photo of neighbors planting seedlings together in a community garden" fill sizes="(max-width: 1200px) 100vw, 1200px" /><figcaption>Illustrative imagery; this does not depict a specific organizer or event.</figcaption></figure>
    <div className="about-story">
      <div className="about-story-main"><p>Our mission is simple: <strong>neighbors helping neighbors, volunteers supporting volunteers, and people coming together to make our community a better place.</strong></p><p>GoodNeighbor is built on the belief that everyone has something valuable to offer. Whether it&apos;s sharing your time, lending your skills, connecting someone with resources, or simply showing kindness, even the smallest act can make a meaningful difference.</p><p>We&apos;re not just here to connect people with volunteer opportunities. We&apos;re here to build relationships, encourage compassion, and create a community where people feel supported, valued, and empowered to give back.</p><p><strong>Run by volunteers, for volunteers, and inspired by the city we call home.</strong></p><p>Together, we can make Chicago a little kinder, a little stronger, and a better place for everyone.</p></div>
      <aside className="about-aside"><p className="eyebrow">HOW THE GUIDE WORKS</p><h2>Checked with care.</h2><p>Each opportunity links to an official organizer source and shows when it was verified. Confirm current openings and logistics directly with the organizer.</p><Link className="button-secondary" href="/opportunities">Explore opportunities ↗</Link></aside>
    </div>
    <section className="about-impact" aria-labelledby="impact-title"><div><p className="eyebrow">THE HEART OF IT</p><h2 id="impact-title">Small Acts. Big Impact</h2><p>Every neighbor has a way to contribute.</p></div><figure><Image src="/images/hero-neighbors-pantry-v2.webp" alt="Illustrative photo of neighbors packing fresh produce together" fill sizes="(max-width: 850px) 100vw, 50vw" /><figcaption>Illustrative imagery; not a specific organization or event.</figcaption></figure></section>
  </article>;
}
