import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  Star,
  Calendar,
  ChevronRight,
  X,
  ChevronLeft,
  User,
  Phone,
  Mail,
  CheckCircle2,
  Copy,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  cleanPhoneNumber,
  generateBookingId,
  generateConfirmationMessage,
  triggerBookingConfetti,
  STUDIO_PHONE,
  STUDIO_PHONE_DISPLAY,
  STUDIO_ADDRESS,
  BRAND_NAME,
} from "@/lib/whatsapp";

interface Service {
  id: string;
  name: string;
  description: string;
  price?: string;
  imageUrl?: string;
  category?: string;
  duration?: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Fallback curated services if Firestore is empty
const DEFAULT_SERVICES: Service[] = [
  {
    id: "serv-1",
    name: "Grand Wedding Film & Photography",
    description: "Complete cinematic 4K multi-camera coverage, candid portraiture, drone cinematography, and heirloom album.",
    price: "₹1,80,000",
    imageUrl: "/banner/1.jpeg",
    duration: "Full Wedding (2-3 Days)",
  },
  {
    id: "serv-2",
    name: "Pre-Wedding Cinematic Reel",
    description: "Exotic location shoot with Markhandeya, concept storytelling, high-fashion styling, and teaser reel.",
    price: "₹65,000",
    imageUrl: "/banner/2.jpeg",
    duration: "1 Full Day Shoot",
  },
  {
    id: "serv-3",
    name: "Intimate Wedding & Engagement",
    description: "Heartfelt documentary coverage, family portraits, color-graded cinematic highlight film.",
    price: "₹85,000",
    imageUrl: "/banner/3.jpeg",
    duration: "1 Day Coverage",
  },
  {
    id: "serv-4",
    name: "Editorial Portrait & Fashion",
    description: "Studio or outdoor conceptual portraiture, magazine-style color grading, and retouched master files.",
    price: "₹45,000",
    imageUrl: "/banner/4.jpeg",
    duration: "Half Day Shoot",
  },
];

export const BookingModal = ({ isOpen, onClose }: BookingModalProps) => {
  const [services, setServices] = useState<Service[]>(DEFAULT_SERVICES);
  const [loading, setLoading] = useState(true);
  const [selectedServices, setSelectedServices] = useState<Service[]>([DEFAULT_SERVICES[0]]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    message: "",
  });

  // Success Confirmation State
  const [bookingConfirmation, setBookingConfirmation] = useState<{
    bookingId: string;
    cleanedPhone: string;
    messageText: string;
    clientUrl: string;
    studioUrl: string;
  } | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setIsSuccess(false);
      setShowForm(false);
      setBookingConfirmation(null);
      return;
    }

    try {
      const q = query(collection(db, "services"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const servicesData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as Service[];
            setServices(servicesData);
          } else {
            setServices(DEFAULT_SERVICES);
          }
          setLoading(false);
        },
        () => {
          setServices(DEFAULT_SERVICES);
          setLoading(false);
        }
      );
      return () => unsubscribe();
    } catch {
      setServices(DEFAULT_SERVICES);
      setLoading(false);
    }
  }, [isOpen]);

  const toggleService = (service: Service) => {
    setSelectedServices((prev) => {
      const exists = prev.find((s) => s.id === service.id);
      if (exists) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter((s) => s.id !== service.id);
      }
      return [...prev, service];
    });
  };

  const calculateTotal = () => {
    return selectedServices.reduce((acc, s) => {
      const price = parseFloat(s.price?.replace(/[^\d.]/g, "") || "0");
      return acc + price;
    }, 0);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedServices.length === 0) {
      toast.error("Please select at least one service package.");
      return;
    }

    const cleanedPhone = cleanPhoneNumber(formData.phone);
    if (!cleanedPhone || cleanedPhone.length < 10) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    setIsSubmitting(true);

    const bookingId = generateBookingId();
    const serviceNames = selectedServices.map((s) => s.name).join(", ");
    const confirmationText = generateConfirmationMessage({
      bookingId,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      service: serviceNames,
      date: formData.date,
      notes: formData.message,
    });

    const clientUrl = `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(
      confirmationText
    )}`;
    const studioUrl = `https://wa.me/${STUDIO_PHONE}?text=${encodeURIComponent(
      confirmationText
    )}`;

    try {
      // Log to firestore
      await addDoc(collection(db, "bookings"), {
        bookingId,
        ...formData,
        cleanedPhone,
        services: selectedServices.map((s) => ({
          id: s.id,
          name: s.name,
          price: s.price,
        })),
        totalPrice: calculateTotal(),
        status: "confirmed_whatsapp",
        timestamp: serverTimestamp(),
      });
    } catch (err) {
      console.warn("Firestore logging skipped:", err);
    }

    // Set state & launch Confetti
    setBookingConfirmation({
      bookingId,
      cleanedPhone,
      messageText: confirmationText,
      clientUrl,
      studioUrl,
    });
    setIsSuccess(true);
    setIsSubmitting(false);

    // Launch Confetti
    triggerBookingConfetti();

    // Instant WhatsApp Redirection in new window
    window.open(clientUrl, "_blank");
    toast.success("Booking logged! Opening WhatsApp confirmation...");
  };

  const handleCopyMessage = () => {
    if (!bookingConfirmation) return;
    navigator.clipboard.writeText(bookingConfirmation.messageText);
    toast.success("Confirmation message copied to clipboard!");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-5xl p-0 overflow-hidden bg-[#07080c] border border-white/10 shadow-2xl h-[92dvh] md:h-[85vh] flex flex-col text-white"
        data-lenis-prevent
      >
        <div className="flex flex-col md:flex-row flex-1 w-full overflow-hidden min-h-0">
          {/* Left Hero Sidebar */}
          <div className="hidden md:flex w-[340px] flex-col relative overflow-hidden bg-[#0d0f17] border-r border-white/10 p-8 justify-between shrink-0">
            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e6b76c]/10 text-[#e6b76c] text-[10px] font-black uppercase tracking-widest border border-[#e6b76c]/30">
                <Star className="w-3 h-3" />
                Bengaluru • Whitefield
              </div>

              <div>
                <h3 className="text-3xl font-serif font-black text-white leading-tight">
                  Trixietales <br />
                  <span className="text-[#e6b76c]">Master Sessions</span>
                </h3>
                <p className="text-zinc-400 text-xs mt-3 leading-relaxed">
                  Reserve your wedding dates with Founder & Award-Winning Filmmaker{" "}
                  <strong className="text-white">Markhandeya</strong>. Direct WhatsApp verification on submission.
                </p>
              </div>

              {/* Studio Info Card */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs space-y-2">
                <div className="text-[#e6b76c] font-bold text-[11px] uppercase tracking-wider">
                  Belathur Studio
                </div>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  {STUDIO_ADDRESS}
                </p>
                <div className="text-[11px] text-zinc-300 font-semibold pt-1">
                  WhatsApp: {STUDIO_PHONE_DISPLAY}
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-4 border-t border-white/10 text-[11px] text-zinc-500">
              ⚡ Instant WhatsApp booking card generated upon submission.
            </div>
          </div>

          {/* Right Main Panel */}
          <div className="flex-1 flex flex-col bg-transparent min-h-0 overflow-hidden">
            {/* Header */}
            <DialogHeader className="px-5 py-4 border-b border-white/10 bg-[#0d0f17]/60 flex flex-row items-center justify-between shrink-0">
              <div>
                <DialogTitle className="text-lg md:text-2xl font-serif font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#e6b76c]" />
                  {isSuccess
                    ? "Booking Confirmed"
                    : showForm
                    ? "Enter Session Details"
                    : "Select Photography & Film Packages"}
                </DialogTitle>
                <DialogDescription className="text-xs text-zinc-400">
                  {isSuccess
                    ? "Official WhatsApp confirmation summary generated below."
                    : showForm
                    ? "Step 2 of 2: Fill in client contact information."
                    : "Step 1 of 2: Choose one or more signature services."}
                </DialogDescription>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </DialogHeader>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 md:p-8" data-lenis-prevent>
              <AnimatePresence mode="wait">
                {/* 1. SUCCESS SCREEN (WhatsApp Confirmation System) */}
                {isSuccess && bookingConfirmation ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6 max-w-2xl mx-auto"
                  >
                    {/* Status Badge */}
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">
                          Booking ID: {bookingConfirmation.bookingId} Generated!
                        </h4>
                        <p className="text-xs text-emerald-400/90">
                          WhatsApp window opened. If blocked by popup blocker, use the action buttons below.
                        </p>
                      </div>
                    </div>

                    {/* Rich WhatsApp Message Confirmation Card */}
                    <div className="p-6 rounded-2xl bg-[#0d0f17] border border-white/10 shadow-2xl space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <MessageCircle className="w-5 h-5 text-emerald-400" />
                          <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                            Live WhatsApp Message Preview
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleCopyMessage}
                          className="h-8 px-3 text-xs text-[#e6b76c] hover:text-[#d4a04e] hover:bg-[#e6b76c]/10 gap-1.5"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Text</span>
                        </Button>
                      </div>

                      {/* WhatsApp Chat Bubble */}
                      <div className="p-4 rounded-xl bg-black/60 border border-emerald-500/20 font-mono text-xs text-zinc-200 whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto">
                        {bookingConfirmation.messageText}
                      </div>

                      {/* Dual Trigger Action Buttons as per prompt */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        {/* Green Button: Open WhatsApp with Client Phone */}
                        <a
                          href={bookingConfirmation.clientUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-12 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02] active:scale-95"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>💬 Open Chat with {formData.phone || "Client"}</span>
                        </a>

                        {/* Gold Button: Send Copy to Trixietales Studio */}
                        <a
                          href={bookingConfirmation.studioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-12 px-4 rounded-xl bg-[#e6b76c] hover:bg-[#d4a04e] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02] active:scale-95"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>💬 Send Copy to Studio ({STUDIO_PHONE_DISPLAY})</span>
                        </a>
                      </div>
                    </div>

                    <div className="text-center pt-2">
                      <Button
                        type="button"
                        onClick={onClose}
                        variant="outline"
                        className="border-white/10 text-zinc-400 hover:text-white px-8"
                      >
                        Done & Close
                      </Button>
                    </div>
                  </motion.div>
                ) : showForm ? (
                  /* 2. FORM STEP */
                  <motion.form
                    key="form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleFormSubmit}
                    className="space-y-6 max-w-2xl mx-auto"
                  >
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">
                          Selected Packages ({selectedServices.length})
                        </span>
                        <h5 className="font-bold text-sm text-white truncate max-w-md">
                          {selectedServices.map((s) => s.name).join(" • ")}
                        </h5>
                      </div>
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => setShowForm(false)}
                        className="text-[#e6b76c] text-xs font-bold"
                      >
                        Change
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="book-name" className="text-xs font-bold text-zinc-300">
                          Full Name *
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                          <Input
                            id="book-name"
                            required
                            placeholder="e.g. Aditi Sharma"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-zinc-600 rounded-xl h-11 focus:border-[#e6b76c]"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="book-phone" className="text-xs font-bold text-zinc-300">
                          WhatsApp / Phone Number *
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                          <Input
                            id="book-phone"
                            required
                            type="tel"
                            placeholder="e.g. 98765 43210"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-zinc-600 rounded-xl h-11 focus:border-[#e6b76c]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="book-email" className="text-xs font-bold text-zinc-300">
                          Email Address
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                          <Input
                            id="book-email"
                            type="email"
                            placeholder="aditi@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-zinc-600 rounded-xl h-11 focus:border-[#e6b76c]"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="book-date" className="text-xs font-bold text-zinc-300">
                          Wedding / Event Date
                        </Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                          <Input
                            id="book-date"
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="pl-10 bg-white/5 border-white/10 text-white rounded-xl h-11 focus:border-[#e6b76c]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="book-notes" className="text-xs font-bold text-zinc-300">
                        Event Venue, City or Creative Notes
                      </Label>
                      <Textarea
                        id="book-notes"
                        rows={3}
                        placeholder="Share your wedding venue, dates, or dream aesthetic vision with Markhandeya..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="bg-white/5 border-white/10 text-white placeholder:text-zinc-600 rounded-xl focus:border-[#e6b76c]"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowForm(false)}
                        className="h-12 border-white/10 text-zinc-300 hover:text-white rounded-xl px-5"
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 h-12 bg-gradient-to-r from-[#e6b76c] to-[#d4a04e] hover:from-[#d4a04e] hover:to-[#c28e3b] text-black font-black text-xs uppercase tracking-widest rounded-xl shadow-lg transition-transform hover:scale-[1.01] active:scale-95"
                      >
                        {isSubmitting ? "Generating WhatsApp Link..." : "Confirm & Send via WhatsApp 💬"}
                      </Button>
                    </div>
                  </motion.form>
                ) : (
                  /* 3. SERVICE SELECTION STEP */
                  <motion.div
                    key="selection"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {services.map((service) => {
                        const isSelected = selectedServices.some((s) => s.id === service.id);
                        return (
                          <div
                            key={service.id}
                            onClick={() => toggleService(service)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? "bg-[#e6b76c]/10 border-[#e6b76c] shadow-lg shadow-[#e6b76c]/10"
                                : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.07]"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div>
                                <h4 className="font-serif font-bold text-white text-base">
                                  {service.name}
                                </h4>
                                {service.duration && (
                                  <span className="text-[10px] text-zinc-400 font-medium">
                                    Duration: {service.duration}
                                  </span>
                                )}
                              </div>
                              <span
                                className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                                  isSelected
                                    ? "bg-[#e6b76c] border-[#e6b76c] text-black"
                                    : "border-white/20"
                                }`}
                              >
                                {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                              </span>
                            </div>

                            <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2 mb-3">
                              {service.description}
                            </p>

                            <div className="flex items-center justify-between pt-2 border-t border-white/5">
                              <span className="text-sm font-black text-[#e6b76c]">
                                {service.price || "Custom Quote"}
                              </span>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                                {isSelected ? "Selected ✓" : "Click to select"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-4 flex items-center justify-between border-t border-white/10">
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block">
                          Total Estimate
                        </span>
                        <span className="text-xl font-black text-[#e6b76c]">
                          {calculateTotal() > 0 ? `₹${calculateTotal().toLocaleString()}` : "Custom Quote"}
                        </span>
                      </div>

                      <Button
                        type="button"
                        onClick={() => setShowForm(true)}
                        className="h-12 bg-gradient-to-r from-[#e6b76c] to-[#d4a04e] hover:from-[#d4a04e] hover:to-[#c28e3b] text-black font-black text-xs uppercase tracking-widest rounded-xl px-8 shadow-lg flex items-center gap-2"
                      >
                        <span>Continue to Details</span>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
