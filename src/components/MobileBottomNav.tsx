import { useLocation, Link } from "react-router-dom";
import {
  Phone,
  MessageCircle,
  Calendar,
  Camera,
  Image as ImageIcon,
} from "lucide-react";
import { useBooking } from "@/hooks/useBooking";
import { STUDIO_PHONE } from "@/lib/whatsapp";

export const MobileBottomNav = () => {
  const { openBooking } = useBooking();
  const location = useLocation();

  // Hide on admin routes
  if (location.pathname.startsWith("/admin")) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 min-[1100px]:hidden pb-safe pointer-events-auto">
      {/* Liquid Transparent Glass Bar Container */}
      <div className="mx-3 mb-3 bg-black/40 backdrop-blur-3xl border border-white/20 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] p-2 px-3 flex items-center justify-between gap-1.5">
        {/* 1. Quick Home */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center py-1.5 px-2.5 rounded-xl transition-all duration-300 ${
            location.pathname === "/"
              ? "bg-white/15 text-[#e6b76c] border border-white/20 shadow-sm"
              : "text-zinc-300 hover:text-white hover:bg-white/10"
          }`}
        >
          <Camera className="w-4 h-4" />
          <span className="text-[10px] font-semibold mt-0.5">Home</span>
        </Link>

        {/* 2. Quick Portfolio */}
        <Link
          to="/portfolio"
          className={`flex flex-col items-center justify-center py-1.5 px-2.5 rounded-xl transition-all duration-300 ${
            location.pathname === "/portfolio"
              ? "bg-white/15 text-[#e6b76c] border border-white/20 shadow-sm"
              : "text-zinc-300 hover:text-white hover:bg-white/10"
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span className="text-[10px] font-semibold mt-0.5">Gallery</span>
        </Link>

        {/* 3. Primary Center Trigger: Liquid Transparent Book Session */}
        <button
          onClick={openBooking}
          className="flex-1 max-w-[150px] mx-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#e6b76c]/30 via-[#e6b76c]/20 to-[#d4a04e]/30 hover:bg-[#e6b76c]/35 backdrop-blur-2xl border border-[#e6b76c]/60 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(230,183,108,0.25)] active:scale-95 transition-all cursor-pointer"
        >
          <Calendar className="w-3.5 h-3.5 text-[#e6b76c]" />
          <span>Book Now</span>
        </button>

        {/* 4. Direct WhatsApp Trigger */}
        <a
          href={`https://wa.me/${STUDIO_PHONE}?text=${encodeURIComponent(
            "Hello Trixietales Studio, I would like to inquire about wedding photography and film bookings."
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1.5 px-2.5 rounded-xl text-emerald-400 hover:text-emerald-300 hover:bg-white/10 transition-all duration-300"
          title="WhatsApp Chat"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="text-[10px] font-semibold mt-0.5">WhatsApp</span>
        </a>

        {/* 5. Direct Phone Call Trigger */}
        <a
          href={`tel:+${STUDIO_PHONE}`}
          className="flex flex-col items-center justify-center py-1.5 px-2.5 rounded-xl text-zinc-300 hover:text-white hover:bg-white/10 transition-all duration-300"
          title="Direct Phone Call"
        >
          <Phone className="w-4 h-4" />
          <span className="text-[10px] font-semibold mt-0.5">Call</span>
        </a>
      </div>
    </div>
  );
};

export default MobileBottomNav;
