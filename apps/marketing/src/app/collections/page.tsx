import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

import Navigation from '@/components/sections/Navigation';
import Footer from '@/components/sections/Footer';
import { getCategories } from '@/lib/catalogue';

export const metadata: Metadata = {
  title: "Fine Jewellery Collections — Nihaa Jewels",
  description: "Browse our curated collections of gold, diamond, and heritage temple jewellery. Craftsmanship that lasts for generations.",
};

export const revalidate = 3600;

export default async function CollectionsPage() {
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  try {
    categories = await getCategories();
  } catch (error) {
    console.error('[collections] Failed to load categories:', error);
  }

  return (
    <div className="bg-[#FFFFF0] min-h-screen">
      <Navigation />
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <header className="mb-12 text-center flex flex-col items-center">
          <p className="section-label mb-2 text-[#5F6440]">Artistry &amp; Grace</p>
          <h1 className="text-4xl md:text-6xl text-[#2A2520] font-playfair">Our <em className="text-gradient-gold not-italic">Collections</em></h1>
          <div className="divider-gold" />
          <p className="text-[#55524A] max-w-2xl font-light mt-8 leading-relaxed">
            Discover the pinnacle of jewellery craftsmanship. Each of our collections is a tribute to heritage, designed for the modern connoisseur of fine gold and precious stones.
          </p>
        </header>

        {categories.length > 0 && (
          <section className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/collections/${category.slug}`}
                className="group block bg-[#FFFFFF] border border-[#5F6440]/10 hover:border-[#5F6440]/40 transition-colors overflow-hidden"
              >
                <div className="relative aspect-[4/3] bg-[#F4DFCC] overflow-hidden">
                  {category.hero_image_path ? (
                    <Image
                      src={category.hero_image_path}
                      alt={`${category.name} collection at Nihaa Jewels Coimbatore`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-[#5F6440] text-[0.65rem] tracking-[0.15em] uppercase">
                      {category.name}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <p className="text-[0.6rem] tracking-[0.2em] uppercase text-[#5F6440] mb-2">
                    {category.hero_eyebrow || 'Collection'}
                  </p>
                  <h2 className="text-xl text-[#2A2520] font-playfair mb-2">{category.name}</h2>
                  {category.description && (
                    <p className="text-[#55524A] text-sm font-light leading-relaxed">
                      {category.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </section>
        )}

        <section className="mt-32 grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-[#5F6440]/10 pt-20">
            <div className="space-y-6">
                <h3 className="text-3xl text-[#2A2520] font-playfair">Ethical Sourcing</h3>
                <p className="text-[#55524A] font-light leading-relaxed">Every piece in our collection is backed by ethical sourcing and BIS hallmarking, ensuring your investment is as pure as our craft.</p>
            </div>
            <div className="space-y-6">
                <h3 className="text-3xl text-[#2A2520] font-playfair">Bespoke Requests</h3>
                <p className="text-[#55524A] font-light leading-relaxed">Need something truly unique? Our master artisans can modify any existing design or create a completely new piece just for you.</p>
                <a href="/custom-design" className="inline-block text-[#5F6440] border-b border-[#5F6440]/40 pb-1 text-xs tracking-widest uppercase hover:text-[#2A2520] hover:border-[#2A2520] transition-all">Explore Bespoke</a>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
