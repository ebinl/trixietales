import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import Testimonials from "@/components/Testimonials";
import { Star, CheckCircle2, MessageCircle, Quote, ThumbsUp, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/hooks/useBooking";
import { STUDIO_MAPS_LINK } from "@/lib/whatsapp";

interface Review {
  id: string;
  name: string;
  city: string;
  category: "Weddings" | "Pre-Weddings" | "Destination";
  date: string;
  rating: number;
  headline: string;
  content: string;
  venue: string;
}

const REVIEWS: Review[] = [
  {
    id: "r1",
    name: "Dr. Rohan & Sneha Nair",
    city: "Whitefield, Bengaluru",
    category: "Weddings",
    date: "2 weeks ago",
    rating: 5,
    headline: "Pure cinematic poetry. Markhandeya captured moments we missed!",
    content:
      "Booking Trixietales was hands down the single best decision for our wedding at The Leela Palace. Markhandeya and his team operate with such effortless calm and pure artistic genius. When we watched the cinematic wedding reel, both our families wept tears of joy. The colors, music sync, and candid laughter felt straight out of a festival film.",
    venue: "The Leela Palace, Bengaluru",
  },
  {
    id: "r2",
    name: "Vikram & Ananya Reddy",
    city: "Indiranagar, Bengaluru",
    category: "Destination",
    date: "1 month ago",
    rating: 5,
    headline: "Heirloom grade photography & world-class direction",
    content:
      "Markhandeya flew with us to Udaipur for our 3-day royal palace wedding. The sheer dedication of the Trixietales crew was unbelievable—waking up at 4:30 AM to catch the golden lake mist, and working past midnight. Their custom 3D album and museum frames now hang in our living room like priceless art.",
    venue: "Fateh Garh Palace, Udaipur",
  },
  {
    id: "r3",
    name: "Karan & Tanya Mehra",
    city: "ITPL, Bengaluru",
    category: "Pre-Weddings",
    date: "2 months ago",
    rating: 5,
    headline: "Unmatched pre-wedding film reel that broke our Instagram!",
    content:
      "Neither my fiancé nor I are models, and we were terrified of awkward poses. Within 10 minutes, Markhandeya made us feel like old friends. The pre-wedding reel he delivered looks like an international cinema teaser. Everyone asked us who directed it!",
    venue: "Chikmagalur Coffee Estate",
  },
  {
    id: "r4",
    name: "Pooja & Siddharth Hegde",
    city: "Koramangala, Bengaluru",
    category: "Weddings",
    date: "3 months ago",
    rating: 5,
    headline: "Authentic, discreet, and breathtaking candid captures",
    content:
      "What stood out most was how respectful and non-intrusive the Trixietales team was during the sacred temple rituals. Yet when the gallery arrived, every fleeting glance and emotion was immortalized in 4K clarity. Highly recommended for couples looking for genuine emotion without artificial flash.",
    venue: "Temple Tree Leisure, Bengaluru",
  },
  {
    id: "r5",
    name: "Arjun & Divya Menon",
    city: "Kadugodi, Bengaluru",
    category: "Pre-Weddings",
    date: "4 months ago",
    rating: 5,
    headline: "The Belathur studio experience was so warm and welcoming",
    content:
      "We visited their studio in Belathur, Whitefield to review frame samples and finalize our packages. The consultation with Markhandeya was deeply personalized. They delivered our color-graded album and video teasers ahead of schedule. Truly 5-star service!",
    venue: "Studio & Hesaraghatta Grasslands",
  },
  {
    id: "r6",
    name: "Manish & Shreya Kothari",
    city: "Electronic City, Bengaluru",
    category: "Weddings",
    date: "5 months ago",
    rating: 5,
    headline: "Master of natural lighting and heartfelt candid photography",
    content:
      "The cinematic drone shots, high-definition audio recording of our vows, and the highlight film exceeded all our expectations. Trixietales doesn't just shoot photos; they immortalize feelings.",
    venue: "Miraya Greens, Bengaluru",
  },
];

export const ReviewsPage = () => {
  const { openBooking } = useBooking();
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filteredReviews =
    activeCategory === "All"
      ? REVIEWS
      : REVIEWS.filter((r) => r.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#07080c] text-white relative">
      <Header />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="py-16 md:py-20 relative overflow-hidden">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#e6b76c]/5 rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#e6b76c]/10 border border-[#e6b76c]/30 text-[#e6b76c] text-xs font-bold uppercase tracking-widest mb-4">
              <Star className="w-3.5 h-3.5 fill-[#e6b76c]" />
              Verified Google Reviews
            </div>

            <h1 className="text-4xl md:text-6xl font-black font-serif tracking-tight text-white max-w-4xl mx-auto leading-tight">
              Cherished by Over <span className="text-[#e6b76c]">500+ Couples</span>
            </h1>

            <p className="text-zinc-400 text-base md:text-lg max-w-2xl mx-auto mt-4 leading-relaxed">
              Read authentic 5-star testimonials from couples and families who entrusted Markhandeya and the Trixietales team with their most sacred memories.
            </p>

            {/* Google Rating Summary Card */}
            <div className="mt-10 inline-flex flex-col sm:flex-row items-center gap-6 p-6 rounded-3xl bg-[#0d0f17] border border-white/10 shadow-2xl">
              <div className="flex items-center gap-3">
                <span className="text-5xl font-black font-serif text-[#e6b76c]">
                  4.9
                </span>
                <div className="text-left">
                  <div className="flex items-center gap-1 text-[#e6b76c]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#e6b76c]" />
                    ))}
                  </div>
                  <span className="text-xs text-zinc-400 font-semibold block mt-0.5">
                    Google Rating (380+ Reviews)
                  </span>
                </div>
              </div>

              <div className="h-8 w-px bg-white/10 hidden sm:block" />

              <div className="flex items-center gap-3">
                <a
                  href={STUDIO_MAPS_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-zinc-200 hover:text-white transition-all flex items-center gap-2"
                >
                  <span>Verify on Google Maps</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </a>

                <Button
                  onClick={openBooking}
                  className="h-10 bg-[#e6b76c] hover:bg-[#d4a04e] text-black font-black text-xs uppercase tracking-wider rounded-xl px-5"
                >
                  Book Session
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Category Filters */}
        <section className="py-6 border-y border-white/10 bg-[#0d0f17]/40">
          <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-center gap-2 flex-wrap">
            {["All", "Weddings", "Pre-Weddings", "Destination"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`py-2 px-5 rounded-full text-xs font-bold transition-all ${
                  activeCategory === cat
                    ? "bg-[#e6b76c] text-black shadow-lg shadow-[#e6b76c]/20"
                    : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Reviews Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReviews.map((review) => (
                <div
                  key={review.id}
                  className="p-6 md:p-8 rounded-3xl bg-[#0d0f17] border border-white/10 flex flex-col justify-between hover:border-[#e6b76c]/40 transition-all shadow-xl group"
                >
                  <div>
                    {/* Stars & Category */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1 text-[#e6b76c]">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-[#e6b76c]" />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-400">
                        {review.category}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white font-serif mb-3 leading-snug group-hover:text-[#e6b76c] transition-colors">
                      "{review.headline}"
                    </h3>

                    <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                      {review.content}
                    </p>
                  </div>

                  {/* Reviewer Details */}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        {review.name}
                      </h4>
                      <p className="text-[11px] text-[#e6b76c] font-medium">
                        {review.venue}
                      </p>
                    </div>
                    <span className="text-[10px] text-zinc-500">
                      {review.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Existing Carousel Showcase */}
        <Testimonials />
      </main>

      <MobileBottomNav />
      <Footer />
    </div>
  );
};

export default ReviewsPage;
