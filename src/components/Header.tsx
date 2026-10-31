import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Calendar,
  Info,
  Phone,
  MessageCircle,
  Camera,
  Image as ImageIcon,
  GraduationCap,
  Star,
  Users,
  Compass,
  MapPin,
  Printer,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/hooks/useBooking";
import { STUDIO_PHONE, STUDIO_PHONE_DISPLAY, STUDIO_ADDRESS } from "@/lib/whatsapp";

const NAV_LINKS = [
  { name: "Home", href: "/", icon: Camera },
  { name: "Portfolio", href: "/portfolio", icon: ImageIcon },
  { name: "Experience", href: "/experience", icon: Compass, special: true },
  { name: "Prints & 3D", href: "/prints", icon: Printer },
  { name: "Reviews", href: "/reviews", icon: Star },
  { name: "Education", href: "/education", icon: GraduationCap },
  { name: "Collaborations", href: "/collaborations", icon: Users },
  { name: "About", href: "/about", icon: Info },
  { name: "Contact", href: "/contact", icon: MapPin },
];

export const Header = () => {
  const { openBooking } = useBooking();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close drawer on page route changes
  useEffect(() => {
    setIsDrawerOpen(false);
  }, [location.pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isDrawerOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#07080c]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl py-3"
            : "bg-transparent py-4 md:py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between gap-6 md:gap-10 xl:gap-14">
            {/* Brand Logo & Name */}
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              <div className="relative">
                <img
                  src="/logo.png"
                  alt="Trixietales Photography & Films"
                  className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  fetchPriority="high"
                />
                <span className="absolute -inset-1 rounded-full bg-[#e6b76c]/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex flex-col justify-center gap-1.5 md:gap-2">
                <span className="font-bevorden text-xl md:text-2xl lg:text-3xl font-normal tracking-wide text-white group-hover:text-[#e6b76c] transition-colors leading-tight">
                  Trixietales
                </span>
                <span className="text-[9px] md:text-[10px] tracking-[0.28em] text-[#e6b76c] uppercase font-bold leading-normal">
                  Photography & Films
                </span>
              </div>
            </Link>

            {/* Desktop Navigation for screens >= 1200px */}
            <nav className="hidden min-[1200px]:flex items-center gap-5 xl:gap-7 ml-auto">
              {NAV_LINKS.map((link) => {
                const isActive =
                  location.pathname === link.href ||
                  (link.href === "/education" && location.pathname === "/courses");
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`relative text-sm xl:text-base font-semibold tracking-wide whitespace-nowrap transition-colors duration-200 py-1.5 ${
                      isActive
                        ? "text-[#e6b76c]"
                        : "text-zinc-300 hover:text-white"
                    } ${link.special ? "font-bold" : ""}`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#e6b76c] to-transparent" />
                    )}
                  </Link>
                );
              })}

              {/* Book a Session CTA */}
              <Button
                onClick={openBooking}
                className="bg-[#dca85b] hover:bg-[#c99547] text-white font-extrabold text-xs uppercase tracking-wider rounded-full px-5 h-10 shadow-lg shadow-[#dca85b]/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 whitespace-nowrap shrink-0 border-0 cursor-pointer ml-1"
              >
                <Calendar className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                <span className="text-white">Book a Session</span>
              </Button>
            </nav>

            {/* Mobile / Tablet Controls (< 1200px) */}
            <div className="flex min-[1200px]:hidden items-center gap-2 ml-auto">
              <Button
                onClick={openBooking}
                size="sm"
                className="bg-[#dca85b] hover:bg-[#c99547] text-white font-extrabold text-[11px] uppercase tracking-wider rounded-full px-3.5 h-8 shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Calendar className="w-3 h-3 text-white stroke-[2.5]" />
                <span className="text-white">Book</span>
              </Button>

              {/* Drawer Toggle Button */}
              <button
                onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                aria-label="Open navigation menu"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors cursor-pointer"
              >
                {isDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Slide-out Mobile Navigation Drawer (< 1200px) */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[999] min-[1200px]:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />

          {/* Drawer Content */}
          <div className="absolute top-0 right-0 bottom-0 w-[85%] max-w-[360px] bg-[#07080c] border-l border-white/10 shadow-2xl flex flex-col z-10 animate-slide-in-right">
            {/* Drawer Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
                <div className="flex flex-col gap-1">
                  <h3 className="font-bevorden text-lg text-white leading-tight">Trixietales</h3>
                  <p className="text-[9px] uppercase tracking-widest text-[#e6b76c] leading-normal">Bengaluru, Whitefield</p>
                </div>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Navigation Links */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {NAV_LINKS.map((link) => {
                const Icon = link.icon;
                const isActive =
                  location.pathname === link.href ||
                  (link.href === "/education" && location.pathname === "/courses");
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsDrawerOpen(false)}
                    className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                      isActive
                        ? "bg-[#e6b76c]/15 text-[#e6b76c] font-bold border border-[#e6b76c]/30"
                        : "text-zinc-300 hover:text-white hover:bg-white/5 font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? "text-[#e6b76c]" : "text-zinc-400"}`} />
                      <span className="text-sm">{link.name}</span>
                    </div>
                    {link.special && (
                      <span className="text-[10px] bg-[#e6b76c]/20 text-[#e6b76c] px-2 py-0.5 rounded-full font-bold">
                        Special
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-zinc-600" />
                  </Link>
                );
              })}
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-5 border-t border-white/10 bg-[#0d0f17] space-y-3">
              <Button
                onClick={() => {
                  setIsDrawerOpen(false);
                  openBooking();
                }}
                className="w-full h-12 bg-gradient-to-r from-[#e6b76c] to-[#d4a04e] text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4 text-white stroke-[2.5]" />
                <span className="text-white">Book Session Now</span>
              </Button>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={`https://wa.me/${STUDIO_PHONE}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={`tel:+${STUDIO_PHONE}`}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Studio</span>
                </a>
              </div>

              <div className="pt-2 text-[10px] text-zinc-500 text-center leading-relaxed">
                {STUDIO_ADDRESS}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;