import type { Metadata } from 'next';
import Navigation from '@/components/sections/Navigation';
import Footer from '@/components/sections/Footer';

export const metadata: Metadata = {
  title: "Bespoke Jewellery Design | Digital Atelier",
  description: "Start your custom jewellery journey with Coimbatore's master goldsmiths. From CAD previews to hand-forged reality.",
};

export default function CustomDesignPage() {
  return (
    <div className="bg-[#121212] min-h-screen">
      <Navigation />
      <main className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
        <header className="mb-12 text-center flex flex-col items-center">
          <p className="section-label mb-2 text-[#D4AF37]/60">Bespoke Atelier</p>
          <h1 className="text-4xl md:text-5xl text-[#FAF9F6] font-playfair">Your Vision, <em className="text-gradient-gold not-italic">Our Craft</em></h1>
          <div className="divider-gold" />
          <p className="text-[#d6d3ce] max-w-xl font-light mt-8 leading-relaxed">
            Every great piece of jewellery begins with a story. Our bespoke service allows you to work directly with our master artisans to bring your unique vision to life.
          </p>
        </header>

        <section className="mt-20 py-20 border border-[#D4AF37]/10 flex flex-col items-center justify-center text-center px-8">
            <h2 className="text-2xl text-[#FAF9F6] mb-4 font-playfair">Digital Consultations Coming Soon</h2>
            <p className="text-[#d6d3ce]/60 text-sm max-w-md">We are currently integrating our CAD preview system. Please visit our physical atelier in RS Puram for design consultations.</p>
            <a href="/contact" className="btn-gold-shimmer px-8 py-3 text-[0.6rem] tracking-widest uppercase mt-8">Book a Visit</a>
        </section>
      </main>
      <Footer />
    </div>
  );
}
