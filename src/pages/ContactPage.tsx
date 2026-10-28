import Header from "@/components/Header";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";

const ContactPage = () => {
  return (
    <div className="min-h-screen relative">
      {/* Animated particles background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-background to-primary/5">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>
      <Header />
      <div className="pt-20">
        <Contact />
      </div>
      <MobileBottomNav />
      <Footer />
    </div>
  );
};

export default ContactPage;
