'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    name: "Priya",
    location: "Coimbatore",
    text: "I found Nihaa Jewels when searching for the best bridal jewellery Coimbatore has to offer. Their BIS Hallmarked gold collection is absolutely stunning! It is truly the best jewellery shop near me, with gorgeous designs and incredible craftsmanship. My wedding gold set was perfect!",
    rating: 5,
    tag: "Bridal Collection"
  },
  {
    id: 2,
    name: "Rajesh",
    location: "RS Puram Showroom",
    text: "Visited the RS Puram showroom in Coimbatore for some gold gifting. The experience was wonderful, and I found the perfect gift. The craftsmanship and collection of luxury jewels are exceptional. Full satisfaction!",
    rating: 5,
    tag: "Gold Gifting"
  },
  {
    id: 3,
    name: "Ananya",
    location: "Coimbatore",
    text: "I was looking for lightweight gold jewellery daily wear and was amazed by their collection. I also appreciated their traditional impon jewellery Coimbatore sets. The BIS Hallmarked gold gives total peace of mind regarding quality and purity.",
    rating: 5,
    tag: "Daily Wear & Impon"
  },
  {
    id: 4,
    name: "Vikram",
    location: "Coimbatore",
    text: "Wanted a bespoke jewellery design for my mother and Nihaa Jewels delivered beautifully. They crafted a custom gold ring with IGI certified diamonds. Real luxury jewels made with extreme care. The best bespoke goldsmiths in Coimbatore!",
    rating: 5,
    tag: "Bespoke Ring"
  },
  {
    id: 5,
    name: "Divya",
    location: "Coimbatore",
    text: "Bought IGI certified diamond jewellery and gold rings in Coimbatore from Nihaa Jewels. The staff was incredibly warm and knowledgeable, guiding me through the certified diamonds and hallmarking process. High-quality diamond jewellery Coimbatore loves!",
    rating: 5,
    tag: "Diamond Jewellery"
  }
];

const AUTO_PLAY_INTERVAL = 6000;

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 = left, 1 = right
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -100 : 100,
      opacity: 0
    })
  };

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === REVIEWS.length - 1 ? 0 : prev + 1));
  }, []);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? REVIEWS.length - 1 : prev - 1));
  }, []);

  const goToSlide = useCallback((index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  }, [currentIndex]);

  // Auto-play timer
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (!isHovered) {
      timerRef.current = setInterval(handleNext, AUTO_PLAY_INTERVAL);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, handleNext]);

  const activeReview = REVIEWS[currentIndex];

  return (
    <section 
      className="bg-[#0f0f0f] py-24 px-6 border-t border-[#D4AF37]/10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-[1000px] mx-auto">
        {/* Header */}
        <div className="text-center mb-16 flex flex-col items-center">
          <span className="font-montserrat uppercase tracking-[0.3em] text-[#D4AF37] text-xs font-semibold mb-4 block">
            Voice of Trust
          </span>
          <h2 className="text-[#FAF9F6] text-4xl md:text-5xl font-playfair tracking-wide">
            Client <em className="text-gradient-gold not-italic">Testimonials</em>
          </h2>
          <div className="divider-gold" />
          <p className="text-[#d6d3ce]/70 max-w-xl font-light mt-4 leading-relaxed font-inter text-sm md:text-base">
            Discover the experiences of our valued patrons who have trusted four generations of Nihaa Jewels craftsmanship for their milestones.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative min-h-[380px] md:min-h-[340px] flex items-center justify-center">
          
          {/* Left Arrow Button */}
          <button
            onClick={handlePrev}
            className="absolute left-0 md:-left-16 z-20 w-12 h-12 rounded-full border border-[#D4AF37]/20 bg-[#161616]/80 text-[#D4AF37] flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#121212] hover:border-[#D4AF37] hover:scale-105 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)] cursor-pointer"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Center Card */}
          <div className="w-full max-w-[760px] overflow-hidden px-4">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="bg-[#161616] border border-[#D4AF37]/15 p-8 md:p-12 rounded-2xl flex flex-col justify-between relative shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
              >
                {/* Decorative Top Line */}
                <div className="absolute top-0 inset-x-0 h-[2px] bg-linear-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
                
                {/* Quote Icon Background */}
                <div className="absolute top-6 right-8 text-[#D4AF37]/5 pointer-events-none">
                  <Quote size={80} strokeWidth={1} />
                </div>

                <div>
                  {/* Rating Stars and Tag */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex gap-1">
                      {[...Array(activeReview.rating)].map((_, starIdx) => (
                        <Star
                          key={starIdx}
                          size={18}
                          fill="#D4AF37"
                          stroke="#D4AF37"
                          className="drop-shadow-[0_0_5px_rgba(212,175,55,0.4)]"
                        />
                      ))}
                    </div>
                    <span className="font-montserrat text-[0.7rem] uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-4 py-1.5 rounded-full border border-[#D4AF37]/20 font-medium">
                      {activeReview.tag}
                    </span>
                  </div>

                  {/* Review Text */}
                  <p className="font-inter text-[#FAF9F6]/90 text-sm md:text-base leading-relaxed font-light mb-10 italic">
                    &ldquo;{activeReview.text}&rdquo;
                  </p>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-4 pt-6 border-t border-[#D4AF37]/10">
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#D4AF37]/20 to-[#FAF9F6]/5 flex items-center justify-center border border-[#D4AF37]/20">
                    <span className="font-playfair text-[#D4AF37] font-semibold text-base uppercase">
                      {activeReview.name[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-montserrat text-[#FAF9F6] text-sm md:text-base font-semibold tracking-wider">
                      {activeReview.name}
                    </h3>
                    <p className="font-inter text-[#FAF9F6]/75 text-[0.8rem] font-light mt-0.5">
                      Verified Client · {activeReview.location}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={handleNext}
            className="absolute right-0 md:-right-16 z-20 w-12 h-12 rounded-full border border-[#D4AF37]/20 bg-[#161616]/80 text-[#D4AF37] flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#121212] hover:border-[#D4AF37] hover:scale-105 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)] cursor-pointer"
            aria-label="Next testimonial"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Carousel Dots Navigation */}
        <div className="flex justify-center gap-2 mt-10">
          {REVIEWS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className="w-11 h-11 flex items-center justify-center cursor-pointer transition-all focus:outline-none rounded-full"
              aria-label={`Go to slide ${idx + 1}`}
            >
              <span
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  currentIndex === idx 
                    ? 'w-8 bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.6)]' 
                    : 'w-2.5 bg-white/20 hover:bg-white/40'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
