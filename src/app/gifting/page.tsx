import type { Metadata } from 'next';
import Navigation from '@/components/sections/Navigation';
import Footer from '@/components/sections/Footer';

export const metadata: Metadata = {
  title: "Luxury Jewellery Gifting — Nihaa Jewels",
  description: "Give a gift that lasts beyond a lifetime. Explore our curated range of fine jewellery gifts for your most precious moments.",
};

export default function GiftingPage() {
  return (
    <div className="bg-[#121212] min-h-screen">
      <Navigation />
      <main className="pt-32 pb-20 px-6 max-w-5xl mx-auto text-center flex flex-col items-center">
        <header className="mb-12">
          <p className="section-label mb-2 text-[#D4AF37]/60">Art of Giving</p>
          <h1 className="text-4xl md:text-5xl text-[#FAF9F6] font-playfair">Curated <em className="text-gradient-gold not-italic">Gifting</em></h1>
          <div className="divider-gold" />
          <p className="text-[#d6d3ce] max-w-xl font-light mt-8 leading-relaxed">
            From anniversaries to life’s milestones, discover the perfect gift from our signature gold and diamond collections.
          </p>
        </header>

        <section className="mt-20 py-20 border border-[#D4AF37]/10 flex flex-col items-center justify-center text-center px-8 w-full max-w-2xl mx-auto">
            <h2 className="text-2xl text-[#FAF9F6] mb-4 font-playfair">Gift Catalog Coming Soon</h2>
            <p className="text-[#d6d3ce]/60 text-sm max-w-md">Our digital gifting suite is currently being refined to provide the most seamless experience.</p>
            <a href="/collections/rings" className="btn-gold-shimmer px-8 py-3 text-[0.6rem] tracking-widest uppercase mt-8">Explore Collections</a>
        </section>
      </main>
      <Footer />
    </div>
  );
}
