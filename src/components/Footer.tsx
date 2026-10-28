import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Camera,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";
import {
  STUDIO_PHONE,
  STUDIO_PHONE_DISPLAY,
  STUDIO_ADDRESS,
  STUDIO_MAPS_LINK,
  BRAND_NAME,
  FOUNDER_NAME,
} from "@/lib/whatsapp";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");

  const navigationColumns = [
    {
      title: "Navigation",
      links: [
        { label: "Home", href: "/" },
        { label: "Portfolio Gallery", href: "/portfolio" },
        { label: "Prints & 3D Lab", href: "/prints" },
        { label: "Client Reviews", href: "/reviews" },
        { label: "About Studio", href: "/about" },
      ],
    },
    {
      title: "Experiences",
      links: [
        { label: "Markhandeya's Vision", href: "/experience" },
        { label: "Masterclasses & Workshops", href: "/education" },
        { label: "Brand Collaborations", href: "/collaborations" },
        { label: "Contact & Studio Visit", href: "/contact" },
      ],
    },
    {
      title: "Services",
      links: [
        { label: "Cinematic Wedding Films", href: "/portfolio" },
        { label: "Pre-Wedding & Engagements", href: "/portfolio" },
        { label: "Editorial & Fashion", href: "/collaborations" },
        { label: "Museum Custom Frames", href: "/prints" },
      ],
    },
  ];

  const socialLinks = [
    {
      icon: Instagram,
      href: "https://www.instagram.com/weddingsbytrixietales/?hl=en",
      label: "Instagram",
    },
    {
      icon: Facebook,
      href: "https://www.facebook.com/MARKHANDEYA/?locale=hi_IN&_rdr",
      label: "Facebook",
    },
    {
      icon: Twitter,
      href: "https://x.com/Callme_Krack",
      label: "Twitter",
    },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/markhandeya-m-v-09a110192/?originalSubdomain=in",
      label: "LinkedIn",
    },
  ];

  return (
    <footer className="bg-[#07080c] border-t border-white/10 text-zinc-300 relative overflow-hidden">
      {/* Decorative subtle ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-[#e6b76c]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand & Studio Information (2 Columns) */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <img
                src="/logo.png"
                alt="Trixietales"
                className="w-10 h-10 object-contain group-hover:scale-105 transition-transform"
              />
              <div>
                <span className="text-2xl font-bold font-serif text-white tracking-tight block">
                  Trixietales
                </span>
                <span className="text-[10px] text-[#e6b76c] font-bold uppercase tracking-[0.2em] block">
                  Photography & Films
                </span>
              </div>
            </Link>

            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
              Led by International Award-Winning Wedding Photographer & Filmmaker{" "}
              <strong className="text-white font-medium">{FOUNDER_NAME}</strong>, capturing timeless emotions and cinematic love stories across Bangalore and worldwide.
            </p>

            {/* Studio Address Card */}
            <div className="space-y-2 pt-1 text-xs text-zinc-400">
              <a
                href={STUDIO_MAPS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 hover:text-[#e6b76c] transition-colors group"
              >
                <MapPin className="w-4 h-4 text-[#e6b76c] shrink-0 mt-0.5" />
                <span>
                  {STUDIO_ADDRESS}
                  <ExternalLink className="inline-block w-3 h-3 ml-1 opacity-70 group-hover:opacity-100" />
                </span>
              </a>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#e6b76c] shrink-0" />
                <a href={`tel:+${STUDIO_PHONE}`} className="hover:text-white transition-colors">
                  {STUDIO_PHONE_DISPLAY}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`https://wa.me/${STUDIO_PHONE}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Direct Studio WhatsApp: {STUDIO_PHONE_DISPLAY}
                </a>
              </div>
            </div>

            {/* Newsletter */}
            <form
              className="relative max-w-sm pt-2"
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  await addDoc(collection(db, "newsletterSubscribers"), {
                    email,
                    timestamp: serverTimestamp(),
                    status: "active",
                  });
                  toast.success("Successfully subscribed to Trixietales newsletter!");
                  setEmail("");
                } catch (error) {
                  console.error("Newsletter error:", error);
                  toast.success("Thank you for subscribing!");
                  setEmail("");
                }
              }}
            >
              <label htmlFor="footer-newsletter-email" className="sr-only">
                Email Address
              </label>
              <input
                id="footer-newsletter-email"
                type="email"
                placeholder="Enter email for private showcase updates"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 pr-28 rounded-xl border border-white/10 bg-[#0d0f17] text-white placeholder:text-zinc-500 text-xs focus:outline-none focus:border-[#e6b76c] transition-colors"
              />
              <button
                type="submit"
                className="absolute right-1 top-3 bottom-1 px-3 bg-[#e6b76c] hover:bg-[#d4a04e] text-black rounded-lg text-xs font-bold transition-all"
              >
                Join
              </button>
            </form>

            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-[#e6b76c] hover:text-black border border-white/10 text-zinc-400 transition-all duration-300"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Columns (3 Columns with clean react router links) */}
          {navigationColumns.map((col) => (
            <div key={col.title} className="space-y-4">
              <h4 className="font-serif font-bold text-white text-sm tracking-wider uppercase">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-xs text-zinc-400 hover:text-[#e6b76c] transition-colors flex items-center gap-1.5"
                    >
                      <span className="text-[#e6b76c]/60 text-[10px]">›</span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 mt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>
            &copy; {currentYear} {BRAND_NAME}. All rights reserved.
          </p>
          <p className="flex items-center gap-1 text-zinc-400">
            <span>Designed by</span>
            <a
              href="https://ebin-portfolio-rouge.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#e6b76c] hover:underline font-bold transition-colors"
            >
              Ebin Shaji
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;