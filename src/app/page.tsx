import Navigation from '@/components/sections/Navigation';
import Hero from '@/components/sections/Hero';
import ShowcaseGrid from '@/components/sections/ShowcaseGrid';
import Heritage from '@/components/sections/Heritage';
import Newsletter from '@/components/sections/Newsletter';
import Footer from '@/components/sections/Footer';

export default function Home() {
  return (
    <main className="bg-[#121212] min-h-screen">
      <Navigation />
      <Hero />
      <ShowcaseGrid />
      <Heritage />
      <Newsletter />
      <Footer />
    </main>
  );
}
