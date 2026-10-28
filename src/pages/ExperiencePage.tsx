import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Camera,
  Trophy,
  Calendar,
  Users,
  Star,
  Award,
  MapPin,
  Clock,
  Eye,
  Aperture
} from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const workshops = [
  {
    id: 1,
    title: "Portrait Photography Masterclass",
    date: "March 15, 2027",
    time: "10:00 AM - 4:00 PM",
    location: "Studio Center, Mumbai",
    image: "/images/wed/Pre-Wedding/1.jpeg",
    category: "Workshop",
    spots: 12
  },
  {
    id: 2,
    title: "Wedding Photography Basics",
    date: "March 22, 2027",
    time: "9:00 AM - 5:00 PM",
    location: "Convention Hall, Bangalore",
    image: "/images/wed/Pre-Wedding/2.jpeg",
    category: "Workshop",
    spots: 20
  },
  {
    id: 3,
    title: "Street Photography Walk",
    date: "March 28, 2027",
    time: "6:00 AM - 10:00 AM",
    location: "Old City, Delhi",
    image: "/images/wed/Pre-Wedding/3.jpeg",
    category: "Workshop",
    spots: 15
  },
  {
    id: 4,
    title: "Lighting Techniques for Beginners",
    date: "April 5, 2027",
    time: "11:00 AM - 3:00 PM",
    location: "Photography Hub, Pune",
    image: "/images/wed/Pre-Wedding/4.jpeg",
    category: "Workshop",
    spots: 10
  },
];

const competitions = [
  {
    id: 1,
    title: "Best Portrait 2027",
    deadline: "April 30, 2027",
    prize: "₹50,000",
    image: "/images/wed/Pre-Wedding/5.jpeg",
    category: "Competition"
  },
  {
    id: 2,
    title: "Wedding Moments Challenge",
    deadline: "May 15, 2027",
    prize: "₹75,000",
    image: "/images/wed/Pre-Wedding/6.jpeg",
    category: "Competition"
  },
  {
    id: 3,
    title: "Nature Photography Contest",
    deadline: "June 1, 2027",
    prize: "₹40,000",
    image: "/images/wed/Pre-Wedding/7.jpeg",
    category: "Competition"
  },
  {
    id: 4,
    title: "Street Life Photo Challenge",
    deadline: "June 20, 2027",
    prize: "₹30,000",
    image: "/images/wed/Pre-Wedding/8.jpeg",
    category: "Competition"
  },
];

const ExperiencePage = () => {
  const { ref, isVisible } = useScrollReveal();
  // Replace view more with horizontal carousels

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Photography Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-accent/5" />

        {/* Floating camera elements */}
        <div className="absolute top-20 left-10 w-20 h-20 opacity-20 animate-float">
          <Camera className="w-full h-full text-primary" />
        </div>
        <div className="absolute top-40 right-20 w-16 h-16 opacity-15 animate-float" style={{ animationDelay: '1s' }}>
          <Aperture className="w-full h-full text-accent" />
        </div>
        <div className="absolute bottom-40 left-1/4 w-24 h-24 opacity-10 animate-float" style={{ animationDelay: '2s' }}>
          <Trophy className="w-full h-full text-primary" />
        </div>
        <div className="absolute bottom-20 right-1/3 w-20 h-20 opacity-20 animate-float" style={{ animationDelay: '1.5s' }}>
          <Award className="w-full h-full text-accent" />
        </div>

        {/* Light effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-tl from-accent/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
      </div>

      <Header />

      <main className="pt-20">
        {/* Hero Banner */}
        <section className="relative py-32 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-accent/90 z-10" />
            <img
              src="/images/hero1.jpeg"
              alt="Hero Background"
              className="absolute inset-0 w-full h-full object-cover opacity-30"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </div>

          <div className="container mx-auto px-4 relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
                <Star className="w-5 h-5 text-white animate-pulse" />
                <span className="text-white font-semibold">Upcoming Event Alert!</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
                Photography Competition 2027
              </h1>

              <p className="text-xl md:text-2xl text-white/90 mb-8 drop-shadow-lg">
                Join India's biggest photography competition with prizes worth ₹2 Lakhs!
                Registration closes on March 31st, 2027
              </p>

              <div className="flex flex-wrap gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => window.open('https://wa.me/918618223659?text=Hello%20Trixietales%2C%20I%20would%20like%20to%20register%20for%20the%20Photography%20Competition%202027!', '_blank')}
                  className="!bg-white !text-slate-950 hover:!bg-white/90 !font-bold text-lg px-8 py-6 shadow-2xl rounded-full flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
                >
                  <Trophy className="w-5 h-5 text-amber-600 shrink-0" />
                  <span className="font-bold text-slate-950">Register Now</span>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    document.getElementById('competitions-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="border-2 border-white !text-white hover:!bg-white/20 !font-semibold text-lg px-8 py-6 backdrop-blur-sm rounded-full flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
                >
                  <Eye className="w-5 h-5 shrink-0" />
                  <span className="font-semibold text-white">Learn More</span>
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Floating elements - optimized with will-change */}
          <div className="absolute top-10 left-10 w-32 h-32 opacity-30 animate-float will-change-transform">
            <Camera className="w-full h-full text-white" />
          </div>
          <div className="absolute bottom-10 right-10 w-24 h-24 opacity-30 animate-float will-change-transform" style={{ animationDelay: '1.5s' }}>
            <Trophy className="w-full h-full text-white" />
          </div>
        </section>

        {/* Workshops Section */}
        <section id="workshops-section" ref={ref} className="py-20 relative">
          <div className="container mx-auto px-4">
            <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Photography Workshops
                </span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Learn from industry experts and enhance your photography skills
              </p>
            </div>

            <div className="relative mb-8">
              <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
                <CarouselContent className="-ml-2 md:-ml-4">
                  {workshops.map((workshop, index) => (
                    <CarouselItem key={workshop.id} className="pl-2 md:pl-4 basis-3/4 md:basis-1/2 lg:basis-1/4">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isVisible ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="group overflow-hidden hover-lift border-0 shadow-lg h-full">
                          <div className="relative overflow-hidden h-48">
                            <img
                              src={workshop.image}
                              alt={workshop.title}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 will-change-transform"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                            {/* Modern Coming Soon Overlay */}
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-20 transition-all duration-500 group-hover:bg-black/70 group-hover:backdrop-blur-[4px]">
                              <div className="bg-white/5 border border-white/10 px-6 py-5 rounded-2xl backdrop-blur-xl shadow-2xl transform transition-all duration-500 group-hover:scale-105 group-hover:border-primary/30 group-hover:shadow-primary/20">
                                <div className="flex flex-col items-center gap-3">
                                  <div className="p-2.5 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full ring-1 ring-primary/30 shadow-[0_0_15px_rgba(237,148,85,0.3)]">
                                    <Clock className="w-5 h-5 text-primary animate-pulse" />
                                  </div>
                                  <div className="space-y-1 text-center">
                                    <span className="block text-white font-bold text-lg tracking-[0.2em] uppercase drop-shadow-lg">
                                      Coming Soon
                                    </span>
                                    <span className="block text-white/50 text-[10px] font-medium tracking-widest uppercase">
                                      Stay Tuned
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="absolute bottom-3 left-3 right-3">
                              <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs rounded-full mb-2">
                                {workshop.category}
                              </span>
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-sm mb-3 group-hover:text-primary transition-colors">
                              {workshop.title}
                            </h3>
                            <div className="space-y-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary" />
                                {workshop.date}
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary" />
                                {workshop.time}
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary" />
                                {workshop.location}
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-primary" />
                                {workshop.spots} spots left
                              </div>
                            </div>
                            <Button className="w-full mt-4" size="sm" disabled>
                              Coming Soon
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="-left-6 md:-left-10" />
                <CarouselNext className="-right-6 md:-right-10" />
              </Carousel>
            </div>
          </div>
        </section>

        {/* Competitions Section */}
        <section id="competitions-section" className="py-20 bg-muted/30 relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                  Photography Competitions
                </span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Showcase your talent and win exciting prizes
              </p>
            </div>

            <div className="relative mb-8">
              <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
                <CarouselContent className="-ml-2 md:-ml-4">
                  {competitions.map((competition, index) => (
                    <CarouselItem key={competition.id} className="pl-2 md:pl-4 basis-3/4 md:basis-1/2 lg:basis-1/4">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <Card className="group overflow-hidden hover-lift border-0 shadow-lg h-full">
                          <div className="relative overflow-hidden h-48">
                            <img
                              src={competition.image}
                              alt={competition.title}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 will-change-transform"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                            {/* Modern Coming Soon Overlay */}
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-20 transition-all duration-500 group-hover:bg-black/70 group-hover:backdrop-blur-[4px]">
                              <div className="bg-white/5 border border-white/10 px-6 py-5 rounded-2xl backdrop-blur-xl shadow-2xl transform transition-all duration-500 group-hover:scale-105 group-hover:border-primary/30 group-hover:shadow-primary/20">
                                <div className="flex flex-col items-center gap-3">
                                  <div className="p-2.5 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full ring-1 ring-primary/30 shadow-[0_0_15px_rgba(237,148,85,0.3)]">
                                    <Clock className="w-5 h-5 text-primary animate-pulse" />
                                  </div>
                                  <div className="space-y-1 text-center">
                                    <span className="block text-white font-bold text-lg tracking-[0.2em] uppercase drop-shadow-lg">
                                      Coming Soon
                                    </span>
                                    <span className="block text-white/50 text-[10px] font-medium tracking-widest uppercase">
                                      Stay Tuned
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="absolute top-3 right-3">
                              <div className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-bold">
                                {competition.prize}
                              </div>
                            </div>
                            <div className="absolute bottom-3 left-3">
                              <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                                {competition.category}
                              </span>
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-lg mb-3 group-hover:text-primary transition-colors">
                              {competition.title}
                            </h3>
                            <div className="space-y-2 text-sm text-muted-foreground mb-4">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-accent" />
                                Deadline: {competition.deadline}
                              </div>
                              <div className="flex items-center gap-2">
                                <Trophy className="w-4 h-4 text-accent" />
                                Prize: {competition.prize}
                              </div>
                            </div>
                            <Button className="w-full" variant="outline" size="sm" disabled>
                              Coming Soon
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="-left-6 md:-left-10" />
                <CarouselNext className="-right-6 md:-right-10" />
              </Carousel>
            </div>
          </div>
        </section>
      </main>

      <MobileBottomNav />
      <Footer />
    </div>
  );
};

export default ExperiencePage;
