import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Star,
  Quote,
  CheckCircle2,
  MapPin,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Calendar,
} from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useBooking } from "@/hooks/useBooking";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import {
  ScrollRevealHeading,
  ScrollRevealSubtitle,
  ScrollRevealBadge,
} from "@/components/ui/ScrollTextReveal";

interface Review {
  id: number;
  title: string;
  couple: string;
  event: string;
  location: string;
  avatar: string;
  rating: number;
  content: string[];
}

const REVIEWS: Review[] = [
  {
    id: 1,
    title: "Awesome Work!",
    couple: "Pooja & Karthik",
    event: "Wedding & Pre-Wedding Shoot",
    location: "Bengaluru, Karnataka",
    avatar: "/images/testinomial/avatars/avatar2.jpg",
    rating: 5,
    content: [
      "Hi mark ....",
      "Your team has done a wonderful job with not just our wedding photos, also with our pre wedding photoshoot. Your team made us feel so comfortable and made the shoot easy.",
      "The photo and the video edits were just like we wanted. You made sure to we get the output we wanted. It was the best decision to choose you guys and in future also we will choose you 😊.",
    ],
  },
  {
    id: 2,
    title: "Beyond Expectations",
    couple: "Shreya & Anand",
    event: "Pre-Wedding Cinematic Film",
    location: "Exotic Outdoor Sanctuaries",
    avatar: "/images/testinomial/avatars/avatar3.jpg",
    rating: 5,
    content: [
      "Every pose, candid moment, & location was beautifully planned & executed with so much creativity & attention to detail.",
      "The photographer had an incredible eye for natural light & captured our chemistry perfectly. The ideas were fresh, the guidance was smooth, & the entire process felt fun & effortless. We especially loved how our personalities were brought to life through every shot—romantic, playful, & genuinely “us.”",
      "The final pictures & videos exceeded all our expectations. The editing was elegant & timeless, giving each frame a cinematic feel without overdoing it. These memories will always remain close to our hearts, & we’re so happy we chose this team for such an important moment in our journey.",
      "Highly recommended to any couple looking for a professional, heartfelt, & truly memorable pre-wedding shoot experience!",
    ],
  },
  {
    id: 3,
    title: "Exceptionally Professional",
    couple: "Anusha & Family",
    event: "Grand Heritage Wedding",
    location: "Whitefield, Bengaluru",
    avatar: "/images/testinomial/avatars/avatar1.jpg",
    rating: 5,
    content: [
      "Your team was very professional & you gave us high quality photographs and exceptionally good video films.",
      "Your drone shots were great, Your editing & album placement was also very good. Overall great team work. Keep rocking.",
    ],
  },
  {
    id: 4,
    title: "Simply Stunning!",
    couple: "Divya & Rajesh",
    event: "Traditional Ceremony & Reception",
    location: "Bengaluru",
    avatar: "/images/testinomial/avatars/avatar4.jpg",
    rating: 5,
    content: [
      "Thank you sooo much for such a beautiful output, we are completely satisfied with the video and photography edit, we would surely Prefer & Recommend Trixie Tales for every event we celebrate!",
    ],
  },
  {
    id: 5,
    title: "Cherished Memories",
    couple: "Meghana & Varun",
    event: "Wedding & Royal Keepsake Prints",
    location: "Palatial Heritage Venue",
    avatar: "/images/testinomial/avatars/avatar5.jpg",
    rating: 5,
    content: [
      "First of all, thank you so much, Trixie Tales, for delivering my photos with such beautiful quality. The print, the arrangements, the support, & the entire team's effort during my wedding were truly commendable.",
      "These photos will always be cherished, & every time I look at them, they bring back the best memories of my life, especially the moments with my father. You have an amazing team of photographers who captured everything so perfectly.",
      "Wishing the entire Trixie Tales team all the very best! & of course, many more events are waiting from my side for you to capture and make even more memorable. ❤️",
    ],
  },
];

export const Testimonials = () => {
  const { ref, isVisible } = useScrollReveal();
  const { openBooking } = useBooking();

  return (
    <section
      ref={ref}
      id="reviews"
      className="py-24 md:py-32 relative overflow-hidden bg-gradient-to-b from-[#07080c] via-[#0b0d14] to-[#07080c] text-white"
    >
      {/* Subtle luxury ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#e6b76c]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <ScrollRevealBadge className="mb-4">
            <Star className="w-3.5 h-3.5 fill-[#e6b76c]" />
            <span>Real Words From Our Couples</span>
          </ScrollRevealBadge>

          <ScrollRevealHeading
            text="Immortalized In Our Hearts, Celebrated By Couples"
            highlightWords={["Celebrated", "By", "Couples"]}
            as="h2"
            className="text-3xl sm:text-4xl md:text-5xl font-black font-serif tracking-tight text-white mb-5 leading-tight"
          />

          <ScrollRevealSubtitle className="text-zinc-300 text-base md:text-lg font-light leading-relaxed mb-6">
            Every smile, teardrop of joy, and eternal vow captured with timeless cinematic elegance. Read what couples have shared about their journey with Markhandeya &amp; Trixietales.
          </ScrollRevealSubtitle>

          {/* Google Verified Review Badge */}
          <div className="inline-flex flex-wrap items-center justify-center gap-3 px-5 py-2.5 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/10 shadow-lg text-xs md:text-sm">
            <div className="flex items-center gap-1 text-[#e6b76c]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#e6b76c]" />
              ))}
            </div>
            <span className="font-bold text-white">4.9 / 5.0 Rating</span>
            <span className="text-zinc-500">•</span>
            <span className="text-zinc-400">150+ Verified Google Reviews</span>
            <a
              href="https://share.google/fz4Pz3hsFivsuZIva"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#e6b76c] hover:text-[#ffd599] underline underline-offset-4 font-semibold inline-flex items-center gap-1 ml-1"
            >
              <span>View On Google</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Modern Testimonials Carousel */}
        <div
          className={`max-w-7xl mx-auto transition-all duration-1000 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Carousel
            opts={{ align: "start", loop: true }}
            plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]}
            className="w-full relative"
          >
            <CarouselContent className="-ml-4 md:-ml-6 py-4">
              {REVIEWS.map((review) => (
                <CarouselItem
                  key={review.id}
                  className="pl-4 md:pl-6 basis-full md:basis-1/2 lg:basis-1/3"
                >
                  <div className="group relative h-full flex flex-col justify-between rounded-3xl p-7 md:p-8 bg-gradient-to-b from-[#141724]/90 via-[#0e1019]/95 to-[#08090f]/98 backdrop-blur-2xl border border-white/10 hover:border-[#e6b76c]/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#e6b76c]/10">
                    {/* Watermark Quote Decoration */}
                    <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                      <Quote className="w-16 h-16 text-[#e6b76c]" />
                    </div>

                    <div>
                      {/* Couple Avatar & Details */}
                      <div className="flex items-center gap-4 mb-6 relative z-10">
                        <div className="relative">
                          <img
                            src={review.avatar}
                            alt={review.couple}
                            className="w-16 h-16 rounded-full object-cover ring-2 ring-[#e6b76c]/70 ring-offset-2 ring-offset-black/80 shadow-lg group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#e6b76c] rounded-full flex items-center justify-center text-black shadow-md">
                            <CheckCircle2 className="w-3.5 h-3.5 fill-black text-[#e6b76c]" />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-serif font-bold text-lg text-white group-hover:text-[#ffd599] transition-colors">
                              {review.couple}
                            </h3>
                          </div>
                          <span className="text-[11px] font-bold text-[#e6b76c] uppercase tracking-wider block">
                            {review.event}
                          </span>
                          <span className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-zinc-500 shrink-0" />
                            {review.location}
                          </span>
                        </div>
                      </div>

                      {/* Star Rating Badge */}
                      <div className="flex items-center gap-1.5 mb-4 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/5 w-fit">
                        <div className="flex gap-1 text-[#e6b76c]">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-[#e6b76c]" />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-zinc-200">5.0</span>
                        <span className="text-[10px] text-zinc-500 uppercase font-semibold tracking-wider">
                          Verified Client
                        </span>
                      </div>

                      {/* Review Title */}
                      <h4 className="font-serif text-xl font-bold text-white mb-3 tracking-tight">
                        "{review.title}"
                      </h4>

                      {/* Authentic Review Content */}
                      <div className="space-y-2.5 text-zinc-300 text-sm md:text-[14.5px] leading-relaxed font-light">
                        {review.content.map((paragraph, pIdx) => (
                          <p key={pIdx} className="italic text-zinc-200/90">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>

                    {/* Card Footer Tag */}
                    <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
                      <span className="font-medium text-zinc-400">Trixietales Studio</span>
                      <span className="text-[#e6b76c] font-semibold text-[11px] uppercase tracking-widest">
                        Directed by Markhandeya
                      </span>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Custom Carousel Controls */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <CarouselPrevious className="static translate-y-0 w-11 h-11 bg-white/5 hover:bg-[#e6b76c] hover:text-black border-white/15 text-white transition-all shadow-lg" />
              <div className="text-xs tracking-widest text-zinc-400 uppercase font-semibold">
                Swipe To Explore Stories
              </div>
              <CarouselNext className="static translate-y-0 w-11 h-11 bg-white/5 hover:bg-[#e6b76c] hover:text-black border-white/15 text-white transition-all shadow-lg" />
            </div>
          </Carousel>
        </div>

        {/* Bottom Callout Banner */}
        <div
          className={`text-center mt-16 max-w-2xl mx-auto p-8 rounded-3xl bg-gradient-to-r from-white/[0.03] via-white/[0.06] to-white/[0.03] border border-white/10 backdrop-blur-xl transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h3 className="text-2xl font-serif font-bold text-white mb-2">
            Ready To Create Your Masterpiece?
          </h3>
          <p className="text-sm md:text-base text-zinc-300 mb-6 font-light">
            Book your consultation with Markhandeya. Dates fill up months in advance for peak wedding seasons.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={openBooking}
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-gradient-to-r from-[#e6b76c] to-[#d4a04e] hover:from-[#d4a04e] hover:to-[#c28e3b] text-black font-black text-xs uppercase tracking-widest shadow-xl shadow-[#e6b76c]/25 transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Your Session</span>
            </button>

            <a
              href="https://wa.me/918618223659?text=Hi%20Markhandeya,%20I%20would%20love%20to%20discuss%20wedding%20photography%20with%20Trixietales!"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-bold text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Chat On WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
