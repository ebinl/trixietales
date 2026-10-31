import { useState, lazy, Suspense } from "react";
import Header from "@/components/Header";
import HeroCarousel, { StudioStatsBar } from "@/components/HeroCarousel";
import Founder from "@/components/Founder";
import MobileBottomNav from "@/components/MobileBottomNav";

const Courses = lazy(() => import("@/components/Courses"));
const Portfolio = lazy(() => import("@/components/Portfolio"));
const Collaborations = lazy(() => import("@/components/Collaborations"));
const Prints = lazy(() => import("@/components/Prints"));
const Prints3DSection = lazy(() => import("@/components/Prints3DSection"));
const Testimonials = lazy(() => import("@/components/Testimonials"));
const Contact = lazy(() => import("@/components/Contact"));
const Footer = lazy(() => import("@/components/Footer"));
const Faq = lazy(() => import("@/components/faq"));
const OurTeam = lazy(() => import("@/components/OurTeam"));

const Index = () => {
  return (
    <div className="min-h-screen relative">
      {/* Enhanced Photography-inspired background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none origin-center will-change-transform transform-gpu">

        {/* Large gradient orbs with more movement */}
        <div className="absolute top-1/4 left-1/4 w-[550px] h-[550px] bg-gradient-to-br from-primary/15 to-accent/15 dark:from-primary/20 dark:to-accent/20 rounded-full blur-3xl animate-floatLarge transform-gpu will-change-transform" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-tl from-accent/12 to-primary/12 dark:from-accent/18 dark:to-primary/18 rounded-full blur-3xl animate-floatLarge transform-gpu will-change-transform" style={{ animationDelay: '2s', animationDuration: '15s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-primary/10 to-accent/10 dark:from-primary/15 dark:to-accent/15 rounded-full blur-3xl animate-breathe transform-gpu will-change-transform" />

        {/* Medium orbs with rotation - reduced on mobile/tablet */}
        <div className="absolute top-20 right-20 w-48 h-48 bg-primary/10 dark:bg-primary/15 rounded-full blur-2xl animate-orbit transform-gpu will-change-transform" style={{ animationDuration: '20s' }} />
        <div className="hidden md:block absolute bottom-40 left-40 w-40 h-40 bg-accent/10 dark:bg-accent/15 rounded-full blur-xl animate-orbit transform-gpu will-change-transform" style={{ animationDelay: '2s', animationDuration: '18s' }} />

        {/* Pulsing rings with scale animation */}
        <div className="absolute top-1/3 right-1/3 w-72 h-72 border-2 border-primary/15 dark:border-primary/25 rounded-full animate-pulseRing transform-gpu will-change-transform" style={{ animationDuration: '4s' }} />

        {/* Floating particles - Optimized for performance */}
        {[...Array(12)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className={`absolute rounded-full transform-gpu will-change-transform ${i < 6 ? '' : 'hidden md:block'} ${i % 3 === 0 ? 'animate-floatSlow' : i % 3 === 1 ? 'animate-floatMedium' : 'animate-floatFast'}`}
            style={{
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              background: i % 2 === 0 ? 'rgba(237, 148, 85, 0.25)' : 'rgba(217, 70, 239, 0.25)',
              left: `${(i * 15) % 100}%`,
              top: `${(i * 23) % 100}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}

        {/* Corner lens flares */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-gradient-radial from-primary/10 via-transparent to-transparent transform-gpu" />

        <div className="hidden md:block absolute bottom-0 right-0 w-80 h-80 bg-gradient-radial from-accent/10 via-transparent to-transparent dark:from-accent/15 blur-2xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }} />
        <div className="hidden md:block absolute top-1/2 left-0 w-72 h-72 bg-gradient-radial from-primary/8 via-transparent to-transparent dark:from-primary/12 blur-2xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />

        {/* Vignette effect for dark theme */}
        <div className="absolute inset-0 pointer-events-none dark:block hidden"
          style={{
            background: 'radial-gradient(circle at center, transparent 0%, transparent 40%, rgba(0, 0, 0, 0.3) 70%, rgba(0, 0, 0, 0.6) 100%)'
          }}
        />

        {/* Radial light beams - hidden on mobile/tablet */}
        {[...Array(12)].map((_, i) => (
          <div
            key={`beam-${i}`}
            className="hidden md:block absolute top-1/2 left-1/2 origin-left opacity-5 dark:opacity-10 animate-rotate"
            style={{
              width: '50%',
              height: '2px',
              background: `linear-gradient(90deg, ${i % 2 === 0 ? 'var(--primary)' : 'var(--accent)'}, transparent)`,
              transform: `rotate(${i * 30}deg)`,
              transformOrigin: '0 50%',
              animationDelay: `${i * 0.5}s`,
              animationDuration: '20s'
            }}
          />
        ))}

        {/* Floating rectangles - reduced on mobile/tablet */}
        {[...Array(6)].map((_, i) => (
          <div
            key={`rect-${i}`}
            className={`${i < 2 ? '' : 'hidden md:block'} absolute border border-accent/20 dark:border-accent/30 animate-floatRotate`}
            style={{
              width: `${80 + i * 15}px`,
              height: `${50 + i * 10}px`,
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 1.5}s`,
              animationDuration: `${12 + i * 2}s`,
            }}
          />
        ))}

        {/* Crosshair elements - hidden on mobile/tablet */}
        {[...Array(4)].map((_, i) => (
          <div
            key={`cross-${i}`}
            className="hidden md:block absolute animate-crosshair"
            style={{
              width: '40px',
              height: '40px',
              left: `${25 + i * 20}%`,
              top: `${30 + (i % 2) * 40}%`,
              animationDelay: `${i * 2}s`,
            }}
          >
            <div className="absolute top-0 left-1/2 w-0.5 h-full bg-primary/30 dark:bg-primary/40" />
            <div className="absolute left-0 top-1/2 h-0.5 w-full bg-primary/30 dark:bg-primary/40" />
          </div>
        ))}
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(120px, 120px); }
        }
        @keyframes gridMoveDiagonal {
          0% { transform: translate(0, 0); }
          100% { transform: translate(140px, -140px); }
        }
        @keyframes scanlines {
          0% { transform: translateY(0); }
          100% { transform: translateY(15px); }
        }
        @keyframes floatLarge {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30px, -30px) scale(1.05); }
          50% { transform: translate(-20px, -50px) scale(0.95); }
          75% { transform: translate(-30px, 20px) scale(1.02); }
        }
        @keyframes floatSlow {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(-15px, -25px); }
          66% { transform: translate(15px, -15px); }
        }
        @keyframes floatMedium {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-20px, -30px); }
        }
        @keyframes floatFast {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(10px, -20px); }
          50% { transform: translate(-15px, -35px); }
          75% { transform: translate(15px, -15px); }
        }
        @keyframes breathe {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.15; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.25; }
        }
        @keyframes orbit {
          0% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(40px, -30px) rotate(90deg); }
          50% { transform: translate(0, -60px) rotate(180deg); }
          75% { transform: translate(-40px, -30px) rotate(270deg); }
          100% { transform: translate(0, 0) rotate(360deg); }
        }
        @keyframes pulseRing {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.2); opacity: 0.1; }
        }
        @keyframes rotateFloat {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(-20px, -30px) rotate(120deg); }
          66% { transform: translate(20px, -20px) rotate(240deg); }
        }
        @keyframes floatRotate {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-30px, -40px) rotate(180deg); }
        }
        @keyframes expand {
          0%, 100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.4; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.1; }
        }
        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes crosshair {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.5; }
          50% { transform: scale(1.3) rotate(90deg); opacity: 0.2; }
        }
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -5%); }
          20% { transform: translate(-10%, 5%); }
          30% { transform: translate(5%, -10%); }
          40% { transform: translate(-5%, 15%); }
          50% { transform: translate(-10%, 5%); }
          60% { transform: translate(15%, 0); }
          70% { transform: translate(0, 10%); }
          80% { transform: translate(-15%, 0); }
          90% { transform: translate(10%, 5%); }
        }
        .animate-floatLarge {
          animation: floatLarge 12s ease-in-out infinite;
        }
        .animate-floatSlow {
          animation: floatSlow 15s ease-in-out infinite;
        }
        .animate-floatMedium {
          animation: floatMedium 10s ease-in-out infinite;
        }
        .animate-floatFast {
          animation: floatFast 8s ease-in-out infinite;
        }
        .animate-breathe {
          animation: breathe 8s ease-in-out infinite;
        }
        .animate-orbit {
          animation: orbit 20s ease-in-out infinite;
        }
        .animate-pulseRing {
          animation: pulseRing 4s ease-in-out infinite;
        }
        .animate-rotateFloat {
          animation: rotateFloat 15s ease-in-out infinite;
        }
        .animate-floatRotate {
          animation: floatRotate 14s ease-in-out infinite;
        }
        .animate-expand {
          animation: expand 6s ease-in-out infinite;
        }
        .animate-rotate {
          animation: rotate 20s linear infinite;
        }
        .animate-crosshair {
          animation: crosshair 8s ease-in-out infinite;
        }
        .animate-grain {
          animation: grain 8s steps(10) infinite;
        }
      `}</style>

      {/* Sections */}
      <Header />
      <HeroCarousel />
      <StudioStatsBar />
      <Suspense fallback={<div className="min-h-screen animate-pulse bg-muted/20" />}>
        {/* 1. Portfolio */}
        <div style={{ contentVisibility: 'auto', containIntrinsicSize: '1200px' }}>
          <Portfolio />
        </div>

        {/* 2. Creative Director (Founder) */}
        <Founder />

        {/* 3. Our Team */}
        <div style={{ contentVisibility: 'auto', containIntrinsicSize: '800px' }}>
          <OurTeam />
        </div>

        {/* 4. Client Reviews (Testimonials) */}
        <div style={{ contentVisibility: 'auto', containIntrinsicSize: '600px' }}>
          <Testimonials />
        </div>

        {/* 5. Mastery & Mentorship (Courses) */}
        <div style={{ contentVisibility: 'auto', containIntrinsicSize: '1000px' }}>
          <Courses />
        </div>

        {/* 6. Collaborations */}
        <div style={{ contentVisibility: 'auto', containIntrinsicSize: '800px' }}>
          <Collaborations />
        </div>

        {/* 7. 3D Art Studio */}
        <div style={{ contentVisibility: 'auto', containIntrinsicSize: '800px' }}>
          <Prints3DSection />
        </div>

        {/* 8. Heritage Print Service */}
        <div style={{ contentVisibility: 'auto', containIntrinsicSize: '800px' }}>
          <Prints />
        </div>

        {/* 9. FAQ */}
        <div style={{ contentVisibility: 'auto', containIntrinsicSize: '400px' }}>
          <Faq />
        </div>

        {/* 10. Connect With Us (Contact) */}
        <div style={{ contentVisibility: 'auto', containIntrinsicSize: '600px' }}>
          <Contact />
        </div>

        <Footer />
      </Suspense>
      <MobileBottomNav />
    </div>
  );
};

export default Index;