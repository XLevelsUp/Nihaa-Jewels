import type { Metadata } from "next";
import Navigation from "@/components/sections/Navigation";
import Footer from "@/components/sections/Footer";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Visit Our Jewellery Showroom in Coimbatore",
  description:
    "Visit Nihaa Jewels in RS Puram or Saibaba Colony, Coimbatore. Book a bespoke consultation or explore our fine jewellery collections in person.",
  openGraph: {
    title: "Visit Nihaa Jewels — Gold Store in Coimbatore",
    description: "Find directions to our Coimbatore showrooms and book your visit.",
  },
};

const branches = [
  {
    name: "Nihaa Jewels — Flagship Store",
    address: "42, Jewellers Street, RS Puram, Coimbatore, Tamil Nadu 641002",
    phone: "+91 422 280 0000",
    email: "hello@nihaajewels.com",
    hours: "Mon–Sat: 10:00 AM – 8:00 PM",
  },
  {
    name: "Nihaa Jewels — Saibaba Colony",
    address: "18, Avinashi Road, Saibaba Colony, Coimbatore, Tamil Nadu 641011",
    phone: "+91 422 280 0001",
    email: "saibaba@nihaajewels.com",
    hours: "Mon–Sun: 10:00 AM – 9:00 PM",
  },
];

export default function ContactPage() {
  return (
    <div className="bg-[#121212] min-h-screen">
      <Navigation />

      {/* ── Page Header ── */}
      <section className="pt-40 pb-20 px-6 text-center">
        <p className="section-label mb-4">We&rsquo;re Here For You</p>
        <h1
          className="text-5xl md:text-6xl text-[#FAF9F6]"
          style={{ fontFamily: "var(--font-playfair-display), serif" }}
        >
          Get in{" "}
          <em className="text-gradient-gold not-italic">Touch</em>
        </h1>
        <div className="divider-gold" />
        <p
          className="text-[#d6d3ce] font-light max-w-xl mx-auto mt-4"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        >
          Whether you have a question about a piece, want to begin a bespoke
          journey, or simply wish to visit us — we&rsquo;d love to hear from you.
        </p>
      </section>

      {/* ── Contact Grid ── */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">

          {/* Contact Form */}
          <div className="bg-[#1a1a1a] border border-[#D4AF37]/10 p-10 space-y-6">
            <h2
              className="text-2xl text-[#FAF9F6]"
              style={{ fontFamily: "var(--font-playfair-display), serif" }}
            >
              Send Us a Message
            </h2>
            <div className="w-10 h-px bg-[#D4AF37]" />
            <form className="space-y-6" aria-label="Contact form">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-[#D4AF37] text-[0.65rem] uppercase tracking-widest mb-2"
                    style={{ fontFamily: "var(--font-inter), sans-serif" }}
                  >
                    Full Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    placeholder="Priya Sharma"
                    required
                    className="w-full bg-transparent border-b border-[#D4AF37]/20 py-2 text-[#FAF9F6] placeholder-[#d6d3ce]/30 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
                    style={{ fontFamily: "var(--font-inter), sans-serif" }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-phone"
                    className="block text-[#D4AF37] text-[0.65rem] uppercase tracking-widest mb-2"
                    style={{ fontFamily: "var(--font-inter), sans-serif" }}
                  >
                    Phone Number
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    placeholder="+91 98000 00000"
                    className="w-full bg-transparent border-b border-[#D4AF37]/20 py-2 text-[#FAF9F6] placeholder-[#d6d3ce]/30 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
                    style={{ fontFamily: "var(--font-inter), sans-serif" }}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-[#D4AF37] text-[0.65rem] uppercase tracking-widest mb-2"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                >
                  Email Address
                </label>
                <input
                  id="contact-email"
                  type="email"
                  placeholder="priya@example.com"
                  required
                  className="w-full bg-transparent border-b border-[#D4AF37]/20 py-2 text-[#FAF9F6] placeholder-[#d6d3ce]/30 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                />
              </div>

              <div>
                <label
                  htmlFor="contact-interest"
                  className="block text-[#D4AF37] text-[0.65rem] uppercase tracking-widest mb-2"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                >
                  I&rsquo;m Interested In
                </label>
                <select
                  id="contact-interest"
                  className="w-full bg-[#1a1a1a] border-b border-[#D4AF37]/20 py-2 text-[#d6d3ce]/70 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                >
                  <option value="">Select an option</option>
                  <option value="bridal">Bridal Jewellery</option>
                  <option value="custom">Bespoke / Custom Design</option>
                  <option value="gifting">Gifting</option>
                  <option value="general">General Inquiry</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-[#D4AF37] text-[0.65rem] uppercase tracking-widest mb-2"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  placeholder="Tell us more about what you're looking for..."
                  className="w-full bg-transparent border-b border-[#D4AF37]/20 py-2 text-[#FAF9F6] placeholder-[#d6d3ce]/30 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors resize-none"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                />
              </div>

              <button
                type="submit"
                id="contact-submit"
                className="btn-gold-shimmer w-full py-4 text-xs tracking-widest"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Branch Details */}
          <div className="space-y-8">
            <div>
              <h2
                className="text-2xl text-[#FAF9F6] mb-2"
                style={{ fontFamily: "var(--font-playfair-display), serif" }}
              >
                Our Stores
              </h2>
              <div className="w-10 h-px bg-[#D4AF37]" />
            </div>

            {branches.map((branch) => (
              <div
                key={branch.name}
                className="bg-[#1a1a1a] border border-[#D4AF37]/10 p-8 space-y-4"
              >
                <h3
                  className="text-lg text-[#D4AF37]"
                  style={{ fontFamily: "var(--font-playfair-display), serif" }}
                >
                  {branch.name}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin size={14} strokeWidth={1.5} className="text-[#D4AF37]/60 mt-0.5 shrink-0" />
                    <p
                      className="text-[#d6d3ce] text-sm font-light"
                      style={{ fontFamily: "var(--font-inter), sans-serif" }}
                    >
                      {branch.address}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={14} strokeWidth={1.5} className="text-[#D4AF37]/60 shrink-0" />
                    <a
                      href={`tel:${branch.phone}`}
                      className="text-[#d6d3ce] text-sm font-light hover:text-[#D4AF37] transition-colors"
                      style={{ fontFamily: "var(--font-inter), sans-serif" }}
                    >
                      {branch.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail size={14} strokeWidth={1.5} className="text-[#D4AF37]/60 shrink-0" />
                    <a
                      href={`mailto:${branch.email}`}
                      className="text-[#d6d3ce] text-sm font-light hover:text-[#D4AF37] transition-colors"
                      style={{ fontFamily: "var(--font-inter), sans-serif" }}
                    >
                      {branch.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock size={14} strokeWidth={1.5} className="text-[#D4AF37]/60 shrink-0" />
                    <p
                      className="text-[#d6d3ce] text-sm font-light"
                      style={{ fontFamily: "var(--font-inter), sans-serif" }}
                    >
                      {branch.hours}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/914422800000"
              target="_blank"
              rel="noopener noreferrer"
              id="contact-whatsapp"
              className="flex items-center justify-center gap-3 border border-[#25D366] text-[#25D366] w-full py-4 text-xs uppercase tracking-widest hover:bg-[#25D366] hover:text-[#121212] transition-all duration-300"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
