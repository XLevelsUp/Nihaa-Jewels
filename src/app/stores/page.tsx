import type { Metadata } from 'next';
import Navigation from '@/components/sections/Navigation';
import Footer from '@/components/sections/Footer';
import { MapPin, Phone, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: "Nihaa Jewels Store Locator | Coimbatore Showrooms",
  description: "Find a Nihaa Jewels showroom near you. Visit our flagship stores in RS Puram and Saibaba Colony, Coimbatore for a personalized luxury experience.",
};

const stores = [
  {
    name: "RS Puram Flagship",
    address: "42, Jewellers Street, RS Puram, Coimbatore, TN 641002",
    phone: "+91 422 280 0000",
    hours: "10:00 AM – 8:00 PM"
  },
  {
    name: "Saibaba Colony Boutique",
    address: "18, Avinashi Road, Saibaba Colony, Coimbatore, TN 641011",
    phone: "+91 422 280 0001",
    hours: "10:00 AM – 9:00 PM"
  }
];

export default function StoreLocatorPage() {
  return (
    <div className="bg-[#121212] min-h-screen">
      <Navigation />
      <main className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
        <header className="mb-16 text-center">
          <p className="section-label mb-2 text-[#D4AF37]/60">Visit Us</p>
          <h1 className="text-4xl md:text-5xl text-[#FAF9F6] font-playfair">Store <em className="text-gradient-gold not-italic">Locator</em></h1>
          <div className="divider-gold" />
        </header>

        <section className="grid md:grid-cols-2 gap-8">
          {stores.map((store) => (
            <div key={store.name} className="bg-[#1a1a1a] border border-[#D4AF37]/10 p-8 space-y-6">
              <h2 className="text-2xl text-[#FAF9F6] font-playfair">{store.name}</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3 text-[#d6d3ce] text-sm">
                  <MapPin size={16} className="text-[#D4AF37] shrink-0 mt-1" />
                  <p>{store.address}</p>
                </div>
                <div className="flex items-center gap-3 text-[#d6d3ce] text-sm">
                  <Phone size={16} className="text-[#D4AF37] shrink-0" />
                  <p>{store.phone}</p>
                </div>
                <div className="flex items-center gap-3 text-[#d6d3ce] text-sm">
                  <Clock size={16} className="text-[#D4AF37] shrink-0" />
                  <p>{store.hours}</p>
                </div>
              </div>
              <button className="w-full py-3 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 text-[0.65rem] uppercase tracking-widest hover:bg-[#D4AF37] hover:text-[#121212] transition-all">
                Get Directions
              </button>
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
