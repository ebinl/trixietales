import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import Founder from "@/components/Founder";
import OurTeam from "@/components/OurTeam";
import { Award, Camera, Heart, Film, MapPin, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/hooks/useBooking";
import { STUDIO_ADDRESS, FOUNDER_NAME } from "@/lib/whatsapp";

const AWARDS = [
  {
    year: "2024",
    title: "International Wedding Filmmaker of the Year",
    organization: "Global Visual Arts & Cine Guild",
    desc: "Awarded for groundbreaking emotional storytelling and cinematic mastery in luxury destination weddings.",
  },
  {
    year: "2023",
    title: "Best Luxury Wedding Photography Studio - Bengaluru",
    organization: "India Wedding Industry Honors",
    desc: "Recognized for unmatched candid intimacy, color grading, and client dedication across South India.",
  },
  {
    year: "2022",
    title: "Golden Shutter Excellence in Storytelling",
    organization: "Asia Cine Guild",
    desc: "Honoring evocative documentary-style wedding portraits with natural light mastery.",
  },
  {
    year: "2020",
    title: "Master Visual Storyteller Fellowship",
    organization: "Sony Cine Artisans Society",
    desc: "Special commendation for optical excellence and color science innovation on Sony Cine gear.",
  },
];

const MILESTONES = [
  {
    year: "2016",
    title: "Studio Genesis in Bengaluru",
    desc: "Markhandeya begins with a singular artistic vision: elevating wedding photography from traditional posing into poetic cinema.",
  },
  {
    year: "2019",
    title: "Flagship Belathur Studio Established",
    desc: "Opened our flagship creative hub near Hanuman Temple, Maruthi Layout, Belathur, Whitefield with custom viewing suites and darkroom printing.",
  },
  {
    year: "2022",
    title: "Over 500+ Destination Weddings",
    desc: "Capturing grand royal palace weddings in Rajasthan, coastal celebrations in Goa & Kerala, and international celebrations.",
  },
  {
    year: "Today",
    title: "Pioneering Interactive 3D & Cine Storytelling",
    desc: "Blending master cinema glass with cutting-edge 3D interactive heirloom albums and custom frame visualizers.",
  },
];

export const AboutPage = () => {
  const { openBooking } = useBooking();

  return (
    <div className="min-h-screen bg-[#07080c] text-white relative">
      <Header />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#e6b76c]/5 rounded-full blur-[150px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#e6b76c]/10 border border-[#e6b76c]/30 text-[#e6b76c] text-xs font-bold uppercase tracking-widest mb-4">
              <Award className="w-3.5 h-3.5" />
              Our Legacy & Creative Vision
            </div>

            <h1 className="text-4xl md:text-6xl font-black font-serif tracking-tight text-white max-w-4xl mx-auto leading-tight">
              Crafting Enduring Legacies of <span className="text-[#e6b76c]">Love & Soul</span>
            </h1>

            <p className="text-zinc-400 text-base md:text-xl max-w-3xl mx-auto mt-6 leading-relaxed">
              Based in Whitefield, Bengaluru, Trixietales is an ultra-luxury wedding photography and cinematography studio founded by international award-winning visionary{" "}
              <strong className="text-white">{FOUNDER_NAME}</strong>.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button
                onClick={openBooking}
                className="h-12 bg-gradient-to-r from-[#e6b76c] to-[#d4a04e] text-black font-black text-xs uppercase tracking-widest rounded-full px-8 shadow-lg shadow-[#e6b76c]/20 hover:scale-105 active:scale-95 transition-all"
              >
                Reserve Your Date
              </Button>
            </div>
          </div>
        </section>

        {/* Founder Story Component */}
        <Founder />

        {/* Studio Timeline / History */}
        <section className="py-20 bg-[#0d0f17]/60 border-y border-white/10">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-16">
              <span className="text-xs uppercase tracking-[0.25em] text-[#e6b76c] font-black block mb-2">
                Our Journey
              </span>
              <h2 className="text-3xl md:text-4xl font-black font-serif text-white">
                The History of Trixietales
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {MILESTONES.map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-[#07080c] border border-white/10 relative hover:border-[#e6b76c]/40 transition-all group"
                >
                  <span className="text-3xl font-black font-serif text-[#e6b76c] block mb-3">
                    {item.year}
                  </span>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#e6b76c] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Awards & Honors Showcase */}
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-16">
              <span className="text-xs uppercase tracking-[0.25em] text-[#e6b76c] font-black block mb-2">
                Excellence Recognized
              </span>
              <h2 className="text-3xl md:text-4xl font-black font-serif text-white">
                International Awards & Honors
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {AWARDS.map((award, i) => (
                <div
                  key={i}
                  className="p-6 md:p-8 rounded-3xl bg-[#0d0f17] border border-white/10 flex items-start gap-5 hover:border-[#e6b76c]/40 transition-all shadow-xl"
                >
                  <div className="p-3.5 rounded-2xl bg-[#e6b76c]/10 text-[#e6b76c] shrink-0">
                    <Award className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-black text-[#e6b76c] uppercase tracking-wider">
                        {award.year}
                      </span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-xs text-zinc-400 font-medium">
                        {award.organization}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 font-serif">
                      {award.title}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {award.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Creative Team */}
        <OurTeam />
      </main>

      <MobileBottomNav />
      <Footer />
    </div>
  );
};

export default AboutPage;
