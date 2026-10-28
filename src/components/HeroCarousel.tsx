import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Aperture,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Star,
  Award,
  Film,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/hooks/useBooking";
import { motion } from "framer-motion";

export const bannerImages = [
  {
    url: "/banner/1.jpeg",
    title: "Grand Wedding Studio & Films",
    subtitle: "Enduring Romance & Royal Heritage",
    location: "Bengaluru & Worldwide",
  },
  {
    url: "/banner/2.jpeg",
    title: "Cinematic Pre-Wedding Reels",
    subtitle: "Storytelling Directed by Markhandeya",
    location: "Exotic Destination Landscapes",
  },
  {
    url: "/banner/3.jpeg",
    title: "Fine Art Candid Portraiture",
    subtitle: "Fleeting Whispers Immortalized Forever",
    location: "Belathur Studio & Outdoor Sanctuaries",
  },
];

export const STATS = [
  { icon: Award, label: "Award Winner", value: "Markhandeya" },
  { icon: Film, label: "Weddings Captured", value: "500+" },
  { icon: Star, label: "Google Rating", value: "4.9 ★" },
  { icon: MapPin, label: "Bengaluru Studio", value: "Whitefield" },
];

export const StudioStatsBar = () => {
  return (
    <section className="relative z-20 -mt-8 max-w-5xl mx-auto px-4 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-3xl bg-black/60 backdrop-blur-2xl border border-white/15 shadow-2xl"
      >
        {STATS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="p-3 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/10 text-center hover:border-[#e6b76c]/40 transition-colors"
            >
              <div className="flex items-center justify-center gap-1.5 text-[#e6b76c] font-black text-sm sm:text-base md:text-lg">
                <Icon className="w-4 h-4 shrink-0 text-[#e6b76c]" />
                <span>{stat.value}</span>
              </div>
              <span className="text-[10px] sm:text-xs text-zinc-300 font-medium tracking-wider uppercase block mt-0.5">
                {stat.label}
              </span>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};

export const HeroCarousel = () => {
  const { openBooking } = useBooking();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
    setIsAutoPlaying(false);
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-end items-center pb-12 sm:pb-16 overflow-hidden text-white">
      {/* Background Slides */}
      <div className="absolute inset-0 z-0">
        {bannerImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
            } transition-transform duration-1000 ease-out`}
          >
            <img
              src={image.url}
              alt={image.title}
              className="w-full h-full object-cover object-center"
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "auto"}
            />
            {/* Ultra-clean cinematic overlay: gentle gradient at top for header readability and smooth dark fade at the bottom */}
            <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-black/70 via-black/25 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#07080c] via-[#07080c]/60 to-transparent pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Left Circular Liquid Transparent Arrow */}
      <button
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-white/25 active:scale-95 backdrop-blur-2xl border border-white/20 text-white flex items-center justify-center transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.37)] hover:border-white/40 cursor-pointer"
      >
        <ChevronLeft className="w-6 h-6 md:w-7 md:h-7" />
      </button>

      {/* Right Circular Liquid Transparent Arrow */}
      <button
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-white/25 active:scale-95 backdrop-blur-2xl border border-white/20 text-white flex items-center justify-center transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.37)] hover:border-white/40 cursor-pointer"
      >
        <ChevronRight className="w-6 h-6 md:w-7 md:h-7" />
      </button>

      {/* Bottom Action Buttons & Dots (Matching Image 2 Reference) */}
      <div className="relative z-20 flex flex-col items-center gap-6 px-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto">
          {/* Gold / Amber Action Pill */}
          <Button
            onClick={openBooking}
            className="w-full sm:w-auto h-12 md:h-14 px-8 md:px-10 rounded-full bg-gradient-to-r from-[#f59e0b] via-[#e6b76c] to-[#d4a04e] hover:brightness-110 text-white font-bold text-xs md:text-sm tracking-wider shadow-[0_10px_30px_rgba(230,183,108,0.35)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Calendar className="w-4 h-4 md:w-5 md:h-5 text-white" />
            <span>Book Your Session</span>
          </Button>

          {/* Liquid Transparent Glass Pill */}
          <Link
            to="/portfolio"
            className="w-full sm:w-auto h-12 md:h-14 px-8 md:px-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-2xl border border-white/30 text-white font-bold text-xs md:text-sm tracking-wider shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Aperture className="w-4 h-4 md:w-5 md:h-5 text-white" />
            <span>Explore Portfolio</span>
          </Link>
        </div>

        {/* Slide Indicator Dots matching Image 2 */}
        <div className="flex items-center gap-2.5 pt-1">
          {bannerImages.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentSlide(i);
                setIsAutoPlaying(false);
              }}
              aria-label={`Slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                i === currentSlide
                  ? "w-8 bg-white/95 shadow-lg shadow-white/20"
                  : "w-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;