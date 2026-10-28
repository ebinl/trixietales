import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageCircle,
  Copy,
  ExternalLink,
  CheckCircle2,
  Calendar,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useLocation } from "react-router-dom";
import {
  ScrollRevealHeading,
  ScrollRevealSubtitle,
  ScrollRevealBadge,
} from "@/components/ui/ScrollTextReveal";
import {
  cleanPhoneNumber,
  generateBookingId,
  generateConfirmationMessage,
  triggerBookingConfetti,
  STUDIO_PHONE,
  STUDIO_PHONE_DISPLAY,
  STUDIO_ADDRESS,
  STUDIO_MAPS_LINK,
  BRAND_NAME,
  FOUNDER_NAME,
} from "@/lib/whatsapp";

export const Contact = () => {
  const location = useLocation();
  const { ref, isVisible } = useScrollReveal();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "Wedding Film & Photography",
    date: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    bookingId: string;
    cleanedPhone: string;
    messageText: string;
    clientUrl: string;
    studioUrl: string;
  } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const serviceParam = params.get("service");
    if (serviceParam) {
      setFormData((prev) => ({
        ...prev,
        service: serviceParam,
        message: `I am interested in reserving dates for ${serviceParam}. Please share availability and customized packages.`,
      }));
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleaned = cleanPhoneNumber(formData.phone);
    if (!cleaned || cleaned.length < 10) {
      toast.error("Please provide a valid contact number.");
      return;
    }

    setIsSubmitting(true);
    const bookingId = generateBookingId();

    const confirmationText = generateConfirmationMessage({
      bookingId,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      service: formData.service,
      date: formData.date,
      notes: formData.message,
    });

    const clientUrl = `https://wa.me/${cleaned}?text=${encodeURIComponent(
      confirmationText
    )}`;
    const studioUrl = `https://wa.me/${STUDIO_PHONE}?text=${encodeURIComponent(
      confirmationText
    )}`;

    try {
      await addDoc(collection(db, "contactSubmissions"), {
        bookingId,
        ...formData,
        cleanedPhone: cleaned,
        timestamp: serverTimestamp(),
        status: "confirmed_whatsapp",
      });
    } catch (err) {
      console.warn("Firestore contact logging note:", err);
    }

    setSubmissionSuccess({
      bookingId,
      cleanedPhone: cleaned,
      messageText: confirmationText,
      clientUrl,
      studioUrl,
    });
    setIsSubmitting(false);

    // Trigger celebratory confetti
    triggerBookingConfetti();

    // Instant WhatsApp Redirection in new window
    window.open(clientUrl, "_blank");
    toast.success("Inquiry confirmed! Opening WhatsApp...");
  };

  const handleCopy = () => {
    if (!submissionSuccess) return;
    navigator.clipboard.writeText(submissionSuccess.messageText);
    toast.success("Confirmation message copied to clipboard!");
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Direct Phone Call",
      value: STUDIO_PHONE_DISPLAY,
      link: `tel:+${STUDIO_PHONE}`,
      desc: "Speak with Markhandeya & Studio Manager",
    },
    {
      icon: MessageCircle,
      title: "Official Studio WhatsApp",
      value: STUDIO_PHONE_DISPLAY,
      link: `https://wa.me/${STUDIO_PHONE}?text=${encodeURIComponent(
        "Hello Trixietales, I would like to schedule a consultation with Markhandeya."
      )}`,
      desc: "Instant replies & wedding portfolios",
    },
    {
      icon: Mail,
      title: "Direct Studio Email",
      value: "hello@trixietales.com",
      link: "mailto:hello@trixietales.com",
      desc: "Detailed briefs & vendor partnerships",
    },
    {
      icon: MapPin,
      title: "Belathur Studio, Whitefield",
      value: STUDIO_ADDRESS,
      link: STUDIO_MAPS_LINK,
      desc: "By appointment for private frame viewings",
    },
  ];

  return (
    <section id="contact" className="py-24 bg-[#07080c] text-white relative overflow-hidden" ref={ref}>
      {/* Ambient background glow */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#e6b76c]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <ScrollRevealBadge className="mb-3">
            <MessageCircle className="w-3.5 h-3.5" />
            Connect with Trixietales
          </ScrollRevealBadge>
          <ScrollRevealHeading
            text="Schedule Your Private Consultation"
            highlightWords={["Private", "Consultation"]}
            as="h2"
            className="text-3xl md:text-5xl font-black font-serif tracking-tight text-white mb-3 leading-tight"
          />
          <ScrollRevealSubtitle className="text-sm md:text-base text-zinc-400 max-w-2xl mx-auto">
            Every love story has an unforgettable soul. Connect directly with Creative Director Markhandeya at our Belathur Studio or over WhatsApp.
          </ScrollRevealSubtitle>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-6xl mx-auto">
          {/* Left Column: Contact Form or Success Screen */}
          <div className="lg:col-span-7">
            <Card className="border border-white/10 bg-[#0d0f17]/90 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
              <CardContent className="p-6 md:p-8">
                {submissionSuccess ? (
                  /* Rich Submission Screen as requested */
                  <div className="space-y-6">
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">
                          Booking ID: {submissionSuccess.bookingId} Generated!
                        </h4>
                        <p className="text-xs text-emerald-400/90">
                          Your structured session request is ready for WhatsApp dispatch.
                        </p>
                      </div>
                    </div>

                    {/* WhatsApp Card & Live Preview */}
                    <div className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-white/10">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-300">
                          <MessageCircle className="w-4 h-4 text-emerald-400" />
                          <span>WhatsApp Confirmation Message</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleCopy}
                          className="h-7 text-xs text-[#e6b76c] hover:text-[#d4a04e] gap-1 px-2"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Text</span>
                        </Button>
                      </div>

                      <div className="p-3.5 rounded-xl bg-black/80 border border-emerald-500/20 font-mono text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed max-h-52 overflow-y-auto">
                        {submissionSuccess.messageText}
                      </div>

                      {/* Required Action Buttons */}
                      <div className="space-y-2.5 pt-2">
                        <a
                          href={submissionSuccess.clientUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.01]"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>💬 Open WhatsApp Chat with {formData.phone}</span>
                        </a>

                        <a
                          href={submissionSuccess.studioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full h-12 rounded-xl bg-[#e6b76c] hover:bg-[#d4a04e] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.01]"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>💬 Send Copy to Trixietales Studio ({STUDIO_PHONE_DISPLAY})</span>
                        </a>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSubmissionSuccess(null)}
                      className="w-full border-white/10 text-zinc-400 hover:text-white"
                    >
                      Submit Another Inquiry
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="contact-name" className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                          Full Name *
                        </label>
                        <Input
                          id="contact-name"
                          name="name"
                          placeholder="Your Name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          className="bg-white/5 border-white/10 text-white placeholder:text-zinc-600 rounded-xl h-11 focus:border-[#e6b76c]"
                        />
                      </div>

                      <div>
                        <label htmlFor="contact-phone" className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                          Phone / WhatsApp Number *
                        </label>
                        <Input
                          id="contact-phone"
                          name="phone"
                          type="tel"
                          placeholder="e.g. 98765 43210"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required
                          className="bg-white/5 border-white/10 text-white placeholder:text-zinc-600 rounded-xl h-11 focus:border-[#e6b76c]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="contact-email" className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                          Email Address
                        </label>
                        <Input
                          id="contact-email"
                          name="email"
                          type="email"
                          placeholder="your.email@domain.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="bg-white/5 border-white/10 text-white placeholder:text-zinc-600 rounded-xl h-11 focus:border-[#e6b76c]"
                        />
                      </div>

                      <div>
                        <label htmlFor="contact-date" className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                          Event / Wedding Date
                        </label>
                        <Input
                          id="contact-date"
                          name="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="bg-white/5 border-white/10 text-white rounded-xl h-11 focus:border-[#e6b76c]"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="contact-service" className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                        Service Interest
                      </label>
                      <select
                        id="contact-service"
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full bg-[#141724] border border-white/10 text-white rounded-xl h-11 px-3 text-xs focus:outline-none focus:border-[#e6b76c]"
                      >
                        <option value="Grand Wedding Film & Photography">Grand Wedding Film & Photography</option>
                        <option value="Pre-Wedding Cinematic Reel">Pre-Wedding Cinematic Reel</option>
                        <option value="Intimate Wedding & Engagement">Intimate Wedding & Engagement</option>
                        <option value="Editorial Portrait & Fashion">Editorial Portrait & Fashion</option>
                        <option value="Fine Art Frames & 3D Album Lab">Fine Art Frames & 3D Album Lab</option>
                        <option value="Photography Masterclasses & Mentoring">Photography Masterclasses & Mentoring</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="contact-message" className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                        Tell Us About Your Vision & Venue *
                      </label>
                      <Textarea
                        id="contact-message"
                        name="message"
                        placeholder="Mention your wedding venue, aesthetic expectations, or specific questions..."
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        className="bg-white/5 border-white/10 text-white placeholder:text-zinc-600 rounded-xl focus:border-[#e6b76c]"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 bg-gradient-to-r from-[#e6b76c] to-[#d4a04e] hover:from-[#d4a04e] hover:to-[#c28e3b] text-black font-black text-xs uppercase tracking-widest rounded-xl shadow-lg transition-transform hover:scale-[1.01]"
                    >
                      {isSubmitting ? "Generating WhatsApp Link..." : "Submit Inquiry & Open WhatsApp 💬"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Studio Info & Location Map */}
          <div className="lg:col-span-5 space-y-4">
            {contactInfo.map((info, idx) => {
              const Icon = info.icon;
              return (
                <a
                  key={idx}
                  href={info.link}
                  target={info.link.startsWith("http") ? "_blank" : undefined}
                  rel={info.link.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-[#0d0f17] border border-white/10 hover:border-[#e6b76c]/40 hover:bg-[#e6b76c]/5 transition-all group shadow-md"
                >
                  <div className="p-3 rounded-xl bg-[#e6b76c]/10 text-[#e6b76c] group-hover:scale-110 transition-transform shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 group-hover:text-[#e6b76c] transition-colors">
                      {info.title}
                    </h4>
                    <p className="text-sm font-semibold text-white break-words mt-0.5">
                      {info.value}
                    </p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">{info.desc}</p>
                  </div>
                </a>
              );
            })}

            {/* Google Map Box */}
            <div className="rounded-2xl overflow-hidden border border-white/10 h-64 shadow-xl relative group">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.892607908906!2d77.7554900757271!3d13.010645613317765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae0fafe1c1e5e9%3A0x697f3a7d629a588a!2sBelathur%2C%20Kadugodi%2C%20Bengaluru%2C%20Karnataka%20560067!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Trixietales Studio Belathur Whitefield"
                className="grayscale contrast-125 opacity-80 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500"
              />
              <a
                href={STUDIO_MAPS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 right-3 py-1.5 px-3 rounded-lg bg-black/80 hover:bg-[#e6b76c] text-white hover:text-black text-xs font-bold backdrop-blur-md border border-white/10 flex items-center gap-1.5 transition-colors shadow-lg"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const ContactSection = Contact;
export default Contact;