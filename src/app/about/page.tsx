import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/sections/Navigation";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Our Heritage & Master Goldsmiths",
  description:
    "Discover the 38-year legacy of Nihaa Jewels. Four generations of master craftsmanship in Coimbatore, specializing in traditional and contemporary fine jewellery.",
  openGraph: {
    title: "The Heritage of Nihaa Jewels — Master Goldsmiths since 1986",
    description:
      "A family legacy of fine jewellery craftsmanship in South India. Learn about our story.",
  },
};

const milestones = [
  {
    year: "1986",
    title: "The Beginning",
    desc: "Founded in a small workshop in Coimbatore by master goldsmith A. Krishnamurthy with a singular vision — to create jewellery that lasts beyond a lifetime.",
  },
  {
    year: "1997",
    title: "The Second Generation",
    desc: "Expanded into diamond jewellery and introduced BIS hallmarking across all gold pieces at a time when certification was rare in the region.",
  },
  {
    year: "2008",
    title: "Bridal Collections",
    desc: "Launched the iconic Bridal Edit — a curated range of wedding jewellery blending traditional South Indian motifs with contemporary design.",
  },
  {
    year: "2018",
    title: "Bespoke Atelier",
    desc: "Opened a dedicated bespoke studio offering fully custom design consultations, CAD previews, and handcrafted one-of-a-kind pieces.",
  },
  {
    year: "2024",
    title: "The Digital Chapter",
    desc: "Bringing the Nihaa Jewels experience online — connecting our heritage craftsmanship with a new generation of discerning customers.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-[#121212] min-h-screen">
      <Navigation />

      {/* ── Hero ── */}
      <section className="relative h-[60vh] min-h-[420px] flex items-end justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1599643478524-fb506461a4fb?w=1600&q=85&auto=format&fit=crop"
          alt="Artisan goldsmith at work — Nihaa Jewels"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/50 to-transparent" />
        <div className="relative z-10 text-center pb-16 px-4">
          <p className="section-label mb-4">Est. 1986 · Coimbatore, India</p>
          <h1
            className="text-5xl md:text-7xl text-[#FAF9F6] leading-tight"
            style={{ fontFamily: "var(--font-playfair-display), serif" }}
          >
            A Legacy Written{" "}
            <em className="text-gradient-gold not-italic">in Gold</em>
          </h1>
        </div>
      </section>

      {/* ── Brand Story ── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <p className="section-label">Our Story</p>
            <h2
              className="text-4xl text-[#FAF9F6]"
              style={{ fontFamily: "var(--font-playfair-display), serif" }}
            >
              Mastery Passed <br /> Through Generations
            </h2>
            <div className="w-14 h-px bg-[#D4AF37]" />
            <p
              className="text-[#d6d3ce] font-light leading-relaxed"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              Every ring, necklace, and bracelet that leaves our atelier is a
              testament to the skill of our master artisans. Rooted in
              tradition but looking towards the future, our designs balance
              intricate temple-inspired detailing with sleek, modern
              minimalism.
            </p>
            <p
              className="text-[#d6d3ce] font-light leading-relaxed"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              We draw inspiration from royal courts, ancient temples, and
              modern architecture — ensuring each piece is as unique as the
              person wearing it. Our jewellery isn't just meant to be worn;
              it is meant to be passed down.
            </p>
          </div>
          <div className="relative h-[500px] w-full overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=900&q=85&auto=format&fit=crop"
              alt="Nihaa Jewels artisan handcrafting a gold ring"
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 border border-[#D4AF37]/20" />
          </div>
        </div>
      </section>

      {/* ── Ethical Sourcing ── */}
      <section className="py-24 px-6 bg-[#0d0d0d]">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <p className="section-label">Responsibility</p>
          <h2
            className="text-4xl text-[#D4AF37]"
            style={{ fontFamily: "var(--font-playfair-display), serif" }}
          >
            Ethical Sourcing & Sustainability
          </h2>
          <div className="divider-gold" />
          <p
            className="text-[#d6d3ce] font-light text-lg leading-relaxed"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            At Nihaa Jewels, luxury does not come at the expense of the earth.
            Every diamond we use is Kimberley Process certified — guaranteed
            conflict-free. We continuously increase our use of recycled
            precious metals and run fair-wage artisan workshops.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-[#D4AF37]/10">
            {[
              { stat: "100%", label: "Conflict-Free Diamonds" },
              { stat: "Fair Wage", label: "Certified Workshops" },
              { stat: "BIS", label: "Hallmarked Gold" },
            ].map((item) => (
              <div key={item.stat} className="text-center">
                <h4
                  className="text-3xl text-[#D4AF37] mb-2"
                  style={{ fontFamily: "var(--font-playfair-display), serif" }}
                >
                  {item.stat}
                </h4>
                <p
                  className="text-[#d6d3ce]/60 text-xs uppercase tracking-widest"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                >
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Craftsmanship Timeline ── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="section-label">Our Journey</p>
            <h2
              className="text-4xl text-[#FAF9F6] mt-4"
              style={{ fontFamily: "var(--font-playfair-display), serif" }}
            >
              Four Decades of Excellence
            </h2>
            <div className="divider-gold" />
          </div>
          <div className="relative border-l border-[#D4AF37]/20 ml-6 space-y-12">
            {milestones.map((m) => (
              <div key={m.year} className="pl-8 relative">
                <span className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-[#D4AF37] flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-[#121212]" />
                </span>
                <p
                  className="text-[#D4AF37] text-xs uppercase tracking-widest mb-1"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                >
                  {m.year}
                </p>
                <h3
                  className="text-xl text-[#FAF9F6] mb-2"
                  style={{ fontFamily: "var(--font-playfair-display), serif" }}
                >
                  {m.title}
                </h3>
                <p
                  className="text-[#d6d3ce] font-light leading-relaxed text-sm"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                >
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6 text-center bg-[#0d0d0d]">
        <h3
          className="text-3xl text-[#FAF9F6] mb-6"
          style={{ fontFamily: "var(--font-playfair-display), serif" }}
        >
          Begin Your Jewellery Journey
        </h3>
        <Link
          href="/collections"
          className="btn-gold-shimmer inline-block px-10 py-4 text-xs tracking-widest"
        >
          Explore Collections
        </Link>
      </section>

      <Footer />
    </div>
  );
}
