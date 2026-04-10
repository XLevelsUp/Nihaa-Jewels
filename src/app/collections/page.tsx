import type { Metadata } from 'next';
import Navigation from '@/components/sections/Navigation';
import Footer from '@/components/sections/Footer';
import NewLaunch from '@/components/sections/NewLaunch';

export const metadata: Metadata = {
  title: "Fine Jewellery Collections — Nihaa Jewels",
  description: "Browse our curated collections of gold, diamond, and heritage temple jewellery. Craftsmanship that lasts for generations.",
};

export default function CollectionsPage() {
  return (
    <div className="bg-[#121212] min-h-screen">
      <Navigation />
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <header className="mb-12 text-center flex flex-col items-center">
          <p className="section-label mb-2 text-[#D4AF37]/60">Artistry & Grace</p>
          <h1 className="text-4xl md:text-6xl text-[#FAF9F6] font-playfair">Our <em className="text-gradient-gold not-italic">Collections</em></h1>
          <div className="divider-gold" />
          <p className="text-[#d6d3ce] max-w-2xl font-light mt-8 leading-relaxed">
            Discover the pinnacle of jewellery craftsmanship. Each of our collections is a tribute to heritage, designed for the modern connoisseur of fine gold and precious stones.
          </p>
        </header>

        {/* Reusing Showcase component for the main view */}
        <section className="mt-16">
            <NewLaunch />
        </section>

        <section className="mt-32 grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-[#D4AF37]/10 pt-20">
            <div className="space-y-6">
                <h3 className="text-3xl text-[#FAF9F6] font-playfair">Ethical Sourcing</h3>
                <p className="text-[#d6d3ce] font-light leading-relaxed">Every piece in our collection is backed by ethical sourcing and BIS hallmarking, ensuring your investment is as pure as our craft.</p>
            </div>
            <div className="space-y-6">
                <h3 className="text-3xl text-[#FAF9F6] font-playfair">Bespoke Requests</h3>
                <p className="text-[#d6d3ce] font-light leading-relaxed">Need something truly unique? Our master artisans can modify any existing design or create a completely new piece just for you.</p>
                <a href="/custom-design" className="inline-block text-[#D4AF37] border-b border-[#D4AF37]/40 pb-1 text-xs tracking-widest uppercase hover:text-[#FAF9F6] hover:border-[#FAF9F6] transition-all">Explore Bespoke</a>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
