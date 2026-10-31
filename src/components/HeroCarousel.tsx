import { useState, useEffect } from "react";
import {
  Aperture,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Star,
  Award,
  Film,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

export interface BannerImage {
  id?: string;
  url: string;
  title?: string;
  subtitle?: string;
  location?: string;
  order?: number;
  isActive?: boolean;
}

export const defaultBannerImages: BannerImage[] = [
  {
    url: "/banner/DSC00885.jpeg",
    title: "Sunset Architectural Silhouette",
    subtitle: "Golden Hour Whispers Amidst Ancient Heritage",
    location: "Heritage Sanctuaries",
    order: 1,
    isActive: true,
  },
  {
    url: "/banner/DSC09612.jpeg",
    title: "Palace Arch Romance",
    subtitle: "A Celebration of Love, Poise & Pure Joy",
    location: "Heritage Estate",
    order: 2,
    isActive: true,
  },
  {
    url: "/banner/DSC09578.jpeg",
    title: "Grand Colonnade Elegance",
    subtitle: "Where Architecture Meets Timeless Romance",
    location: "Bengaluru Palace",
    order: 3,
    isActive: true,
  },
  {
    url: "/banner/Banner_004.jpeg",
    title: "Sacred Mangalsutra Heirloom",
    subtitle: "Intimate Rituals & Heritage Traditions",
    location: "Vedic Sanctuaries",
    order: 4,
    isActive: true,
  },
  {
    url: "/banner/Wedding_Ritual.jpeg",
    title: "Joyous Sacred Vows",
    subtitle: "Shower of Blessings, Forever Treasured",
    location: "Royal Pavilion",
    order: 5,
    isActive: true,
  },
];

export const bannerImages: BannerImage[] = defaultBannerImages;

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
  const [images, setImages] = useState<BannerImage[]>(defaultBannerImages);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Sync with Firestore banner_images in real-time
  useEffect(() => {
    try {
      const q = query(collection(db, "banner_images"), orderBy("order", "asc"));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const loaded: BannerImage[] = [];
            snapshot.forEach((doc) => {
              const data = doc.data();
              if (data.isActive !== false) {
                loaded.push({
                  id: doc.id,
                  url: data.url,
                  title: data.title,
                  subtitle: data.subtitle,
                  location: data.location,
                  order: data.order,
                  isActive: data.isActive,
                });
              }
            });
            if (loaded.length > 0) {
              setImages(loaded);
              return;
            }
          }
          setImages(defaultBannerImages);
        },
        (error) => {
          console.warn("Firestore banner_images fallback to defaults:", error);
          setImages(defaultBannerImages);
        }
      );
      return () => unsubscribe();
    } catch (e) {
      console.warn("Could not subscribe to banner_images:", e);
    }
  }, []);

  // Safe slide index
  useEffect(() => {
    if (currentSlide >= images.length && images.length > 0) {
      setCurrentSlide(0);
    }
  }, [images.length, currentSlide]);

  useEffect(() => {
    if (!isAutoPlaying || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, images.length]);

  const nextSlide = () => {
    if (images.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % images.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    if (images.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
    setIsAutoPlaying(false);
  };

  const handleScrollToPortfolio = () => {
    const el = document.getElementById("portfolio");
    if (el) {
      const headerOffset = 70;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    } else {
      window.location.href = "/#portfolio";
    }
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-end items-center pb-12 sm:pb-16 overflow-hidden text-white">
      {/* Background Slides */}
      <div className="absolute inset-0 z-0 bg-[#07080c]">
        {images.length > 0 ? (
          images.map((image, index) => (
            <div
              key={image.id || index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
              } transition-transform duration-1000 ease-out`}
            >
              <img
                src={image.url}
                alt={image.title || "Trixietales Banner"}
                className="w-full h-full object-cover object-center select-none"
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
                decoding="async"
                style={{ imageRendering: "auto" }}
              />
              {/* Ultra-clean cinematic overlay: gentle gradient at top for header readability and smooth dark fade at the bottom */}
              <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-black/70 via-black/25 to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#07080c] via-[#07080c]/60 to-transparent pointer-events-none" />
            </div>
          ))
        ) : (
          /* Elegant dark gradient placeholder */
          <div className="absolute inset-0 bg-gradient-to-b from-[#07080c] via-[#0c0e17] to-[#07080c]">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#e6b76c]/10 via-transparent to-transparent pointer-events-none" />
          </div>
        )}
      </div>

      {/* Navigation Arrows (visible when banner has images) */}
      {images.length > 1 && (
        <>
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
        </>
      )}

      {/* Bottom Action Buttons & Scroll Down Indicator */}
      <div className="relative z-20 flex flex-col items-center gap-5 px-4">
        {/* Transparent Liquid Glass Explore Portfolio Button */}
        <div className="flex items-center justify-center w-full max-w-md mx-auto">
          <button
            onClick={handleScrollToPortfolio}
            className="w-full sm:w-auto h-12 md:h-14 px-8 md:px-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-2xl border border-white/30 text-white font-bold text-xs md:text-sm tracking-wider shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Aperture className="w-4 h-4 md:w-5 md:h-5 text-[#e6b76c]" />
            <span>Explore Portfolio</span>
          </button>
        </div>

        {/* Slide Indicator Dots (visible when banner has images) */}
        {images.length > 1 && (
          <div className="flex items-center gap-2.5 pt-0.5">
            {images.map((_, i) => (
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
        )}

        {/* Scroll Down to Portfolio with Animated Down Arrow */}
        <button
          onClick={handleScrollToPortfolio}
          aria-label="Scroll down to portfolio"
          className="group flex flex-col items-center gap-1 text-zinc-300 hover:text-[#e6b76c] transition-colors cursor-pointer mt-1"
        >
          <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] font-semibold text-zinc-400 group-hover:text-white transition-colors">
            Scroll to Portfolio
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-white/15 border border-white/10 group-hover:border-[#e6b76c]/40 flex items-center justify-center transition-all backdrop-blur-md"
          >
            <ChevronDown className="w-4 h-4 text-[#e6b76c]" />
          </motion.div>
        </button>
      </div>
    </section>
  );
};

export default HeroCarousel;