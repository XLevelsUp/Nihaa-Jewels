import type { Metadata } from 'next';
import Navigation from '@/components/sections/Navigation';
import Footer from '@/components/sections/Footer';

export const metadata: Metadata = {
  title: "Temple Jewellery — Sacred Heritage Collection",
  description: "Experience the timeless beauty of South Indian temple jewellery. Handcrafted masterpieces by heritage goldsmiths in Coimbatore.",
};

export default function TemplePage() {
  return (
    <div className="bg-[#121212] min-h-screen">
      <Navigation />
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <header className="mb-12">
          <p className="section-label mb-2 text-[#D4AF37]/60">Ancestral</p>
          <h1 className="text-4xl md:text-5xl text-[#FAF9F6] font-playfair">Temple <em className="text-gradient-gold not-italic">Jewellery</em></h1>
          <div className="w-14 h-px bg-[#D4AF37] mt-6" />
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-40 py-20 border border-[#D4AF37]/10 flex items-center justify-center text-center">
            <p className="text-[#d6d3ce] font-playfair italic text-lg col-span-full">The sacred collection is being curated and will be unveiled shortly.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
