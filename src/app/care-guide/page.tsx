import type { Metadata } from 'next';
import Navigation from '@/components/sections/Navigation';
import Footer from '@/components/sections/Footer';

export const metadata: Metadata = {
  title: "Jewellery Care & Maintenance | Nihaa Jewels",
  description: "Keep your fine jewellery lustrous for a lifetime. Learn how to clean and maintain your gold, diamonds, and precious gemstones.",
};

export default function CareGuidePage() {
  return (
    <div className="bg-[#121212] min-h-screen">
      <Navigation />
      <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
        <header className="mb-16 text-center">
          <p className="section-label mb-2 text-[#D4AF37]/60">Preserving Beauty</p>
          <h1 className="text-4xl md:text-5xl text-[#FAF9F6] font-playfair">Care <em className="text-gradient-gold not-italic">Guide</em></h1>
          <div className="divider-gold" />
          <p className="text-[#d6d3ce] font-light mt-8 leading-relaxed max-w-2xl mx-auto">
            Fine jewellery is an investment in beauty. Proper care and regular maintenance will ensure your Nihaa Jewels pieces remain as radiant as the day they were crafted.
          </p>
        </header>

        <article className="space-y-16 mt-20">
          <section className="space-y-6">
            <h2 className="text-2xl text-[#FAF9F6] font-semibold">Gold Jewellery Care</h2>
            <div className="w-10 h-px bg-[#D4AF37]/40" />
            <p className="text-[#d6d3ce] leading-relaxed">Avoid contact with household chemicals like bleach or ammonia. For light cleaning, use lukewarm water and a mild dish soap with a soft-bristled brush. Store your pieces individually in the provided Nihaa Jewels pouch to prevent scratching.</p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl text-[#FAF9F6] font-semibold">Diamond Maintenance</h2>
            <div className="w-10 h-px bg-[#D4AF37]/40" />
            <p className="text-[#d6d3ce] leading-relaxed">Diamonds are incredibly durable but can lose their brilliance if coated in oils or dirt. Clean regularly using an ammonia-free solution specifically designed for fine jewellery. We offer complimentary professional cleaning for all Nihaa Jewels pieces at our showrooms.</p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl text-[#FAF9F6] font-semibold">Regular Inspections</h2>
            <div className="w-10 h-px bg-[#D4AF37]/40" />
            <p className="text-[#d6d3ce] leading-relaxed">We recommend bringing your bridal and heavy sets for a professional inspection every 12 months to check stone settings and clasps.</p>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}
