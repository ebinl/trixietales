import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  ScrollRevealHeading,
  ScrollRevealSubtitle,
  ScrollRevealBadge,
} from "@/components/ui/ScrollTextReveal";

export const faqSections = [
  {
    title: "General Questions",
    questions: [
      { q: "What type of photography services do you offer?", a: "We offer Wedding, Portrait, Landscape, Candid, and Commercial Photography." },
      { q: "Do you have a studio?", a: "Yes, located at No 3/4, near Hanuman Temple, Maruthi Layout, Belathur, Bengaluru." },
      { q: "What areas do you serve?", a: "We serve across India and abroad for pre-wedding and destination weddings." },
    ],
  },
  {
    title: "Booking & Pricing",
    questions: [
      { q: "How do I book a session?", a: "Contact us via our website, email, or phone." },
      { q: "What are your pricing packages?", a: "Pricing depends on the type of session. Contact us for a custom quote." },
      { q: "Do you offer discounts or promotions?", a: "Yes, we occasionally run promotions. Follow us on social media." },
    ],
  },
  {
    title: "Photography Process",
    questions: [
      { q: "What can I expect during a session?", a: "We'll capture your best moments with guidance. Soft copies included." },
      { q: "How long does a session take?", a: "4–5 hrs for traditional sessions, 5–6 hrs for candid/cinematography." },
      { q: "How will I receive photos?", a: "Via online gallery, USB, or hard drive depending on your preference." },
    ],
  },
  {
    title: "Image Usage & Rights",
    questions: [
      { q: "Do I own the rights to my photos?", a: "Yes, we provide a usage license as agreed." },
      { q: "Can I use photos commercially?", a: "Contact us to discuss licensing and fees." },
    ],
  },
  {
    title: "Miscellaneous",
    questions: [
      { q: "Do you have backup equipment?", a: "Yes, we always carry backup gear." },
      { q: "What if I'm not happy with my photos?", a: "We work with you until you’re satisfied." },
    ],
  },
];

const FAQ = () => {
  const { ref, isVisible } = useScrollReveal();

  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  const handleCategoryToggle = (category: string) => {
    setOpenCategory(openCategory === category ? null : category);
    setOpenQuestion(null); // reset question when category changes
  };

  const handleQuestionToggle = (question: string) => {
    setOpenQuestion(openQuestion === question ? null : question);
  };

  return (
    <section ref={ref} className="py-14 relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-10">
          <ScrollRevealBadge className="mb-4">Got Questions?</ScrollRevealBadge>
          <ScrollRevealHeading
            text="Frequently Asked Questions"
            highlightWords={["Questions"]}
            as="h2"
            className="text-3xl sm:text-4xl md:text-5xl font-black font-serif tracking-tight text-white mb-4 leading-tight"
          />
          <ScrollRevealSubtitle className="text-zinc-300 text-base md:text-lg max-w-xl mx-auto font-light">
            Everything you need to know about our cinematic photography, bookings, and delivery process
          </ScrollRevealSubtitle>
        </div>

        <div className="space-y-4">
          {faqSections.map((section) => (
            <div key={section.title} className="border border-border rounded-xl overflow-hidden">
              {/* Category Header */}
              <button
                onClick={() => handleCategoryToggle(section.title)}
                className="w-full flex justify-between items-center p-4 bg-card/80 hover:bg-card transition-all"
              >
                <span className="font-medium">{section.title}</span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    openCategory === section.title ? "rotate-180 text-primary" : ""
                  }`}
                />
              </button>

              {/* Questions */}
              {openCategory === section.title && (
                <div className="transition-all duration-500">
                  {section.questions.map((item) => (
                    <div key={item.q} className="border-t border-border">
                      <button
                        onClick={() => handleQuestionToggle(item.q)}
                        className="w-full flex justify-between items-center p-4 text-left bg-card/50 hover:bg-card transition-all"
                      >
                        <span>{item.q}</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            openQuestion === item.q ? "rotate-180 text-primary" : ""
                          }`}
                        />
                      </button>

                      {openQuestion === item.q && (
                        <div className="px-4 pb-4">
                          <p className="text-sm text-muted-foreground">{item.a}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
