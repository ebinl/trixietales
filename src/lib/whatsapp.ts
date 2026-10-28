import confetti from "canvas-confetti";

export const STUDIO_PHONE = "918618223659";
export const STUDIO_PHONE_DISPLAY = "+91 86182 23659";
export const STUDIO_ADDRESS = "No 3/4, Near Hanuman Temple, Maruthi Layout, Belathur, Whitefield, Bengaluru";
export const STUDIO_MAPS_LINK = "https://share.google/fz4Pz3hsFivsuZIva";
export const FOUNDER_NAME = "Markhandeya";
export const BRAND_NAME = "Trixietales Photography & Films";

/**
 * Normalizes phone numbers:
 * - Strips non-digits
 * - Prepends 91 to 10-digit Indian numbers
 * - Handles leading 0
 */
export const cleanPhoneNumber = (phone: string): string => {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `91${digits}`;
  }
  if (digits.length === 11 && digits.startsWith("0")) {
    return `91${digits.slice(1)}`;
  }
  if (digits.length === 12 && digits.startsWith("91")) {
    return digits;
  }
  return digits;
};

/**
 * Generates unique booking ID TT-XXXXXX
 */
export const generateBookingId = (): string => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let random = "";
  for (let i = 0; i < 6; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `TT-${random}`;
};

export interface BookingDetails {
  bookingId?: string;
  name: string;
  phone: string;
  email?: string;
  service: string;
  date?: string;
  notes?: string;
}

/**
 * Generates formatted structured confirmation message
 */
export const generateConfirmationMessage = (data: BookingDetails): string => {
  const bookingId = data.bookingId || generateBookingId();
  const dateStr = data.date ? data.date : "To be scheduled";
  const notesStr = data.notes && data.notes.trim() ? data.notes.trim() : "None provided";
  const emailStr = data.email && data.email.trim() ? data.email.trim() : "Not provided";

  return `📸 *${BRAND_NAME.toUpperCase()}* 📸
*Official Session Booking Request*

🔖 *Booking ID:* ${bookingId}
👤 *Client Name:* ${data.name}
📞 *Phone:* ${data.phone}
✉️ *Email:* ${emailStr}
💍 *Service / Package:* ${data.service}
📅 *Preferred Date:* ${dateStr}
📝 *Client Notes:* ${notesStr}

🏛️ *Studio Address:*
${STUDIO_ADDRESS}
🗺️ *Map Location:* ${STUDIO_MAPS_LINK}

*Status:* Confirmed with Creative Director ${FOUNDER_NAME}. Our team will review your creative brief and reach out immediately!`;
};

/**
 * Builds direct WhatsApp URL
 */
export const getWhatsAppUrl = (phone: string, text: string): string => {
  const cleanPhone = cleanPhoneNumber(phone);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
};

/**
 * Triggers golden luxury celebratory confetti
 */
export const triggerBookingConfetti = () => {
  try {
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
      colors: ["#e6b76c", "#ffffff", "#ffd700", "#f59e0b", "#d97706"],
    });
  } catch (e) {
    console.warn("Confetti trigger warning:", e);
  }
};
