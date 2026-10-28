import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Suspense, lazy } from "react";
import ScrollToTop from "@/components/ScrollToTop";
import { BookingProvider } from "@/hooks/useBooking";
import { SmoothScroll } from "@/components/SmoothScroll";
import ThreeCanvasBackground from "@/components/ThreeCanvasBackground";

const FAQChatbot = lazy(() => import("@/components/FAQChatbot"));
const RatingWidget = lazy(() => import("@/components/RatingWidget"));

// Lazy load dedicated pages
const Index = lazy(() => import("./pages/Index"));
const PortfolioPage = lazy(() => import("./pages/PortfolioPage"));
const PrintsPage = lazy(() => import("./pages/PrintsPage"));
const ReviewsPage = lazy(() => import("./pages/ReviewsPage"));
const ExperiencePage = lazy(() => import("./pages/ExperiencePage"));
const CoursesPage = lazy(() => import("./pages/CoursesPage"));
const CollaborationsPage = lazy(() => import("./pages/CollaborationsPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#07080c]">
    <div className="relative">
      <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-[#e6b76c]"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="w-2 h-2 rounded-full bg-[#e6b76c] animate-ping" />
      </div>
    </div>
  </div>
);

const GlobalWidgets = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  if (isAdmin) return null;

  return (
    <Suspense fallback={null}>
      <SmoothScroll />
      <FAQChatbot />
      <RatingWidget />
    </Suspense>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner position="top-center" richColors theme="dark" />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <BookingProvider>
          {/* 3D Watermark Canvas Background */}
          <ThreeCanvasBackground />

          <GlobalWidgets />
          <ScrollToTop />
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Core Dedicated Routes without scroll jumps */}
              <Route path="/" element={<Index />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/prints" element={<PrintsPage />} />
              <Route path="/reviews" element={<ReviewsPage />} />
              <Route path="/experience" element={<ExperiencePage />} />
              <Route path="/education" element={<CoursesPage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/collaborations" element={<CollaborationsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />

              {/* 404 Catch-All */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BookingProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;