import Header from "@/components/Header";
import Collaborations from "@/components/Collaborations";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";

const CollaborationsPage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated mesh gradient background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-tl from-accent/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '7s', animationDelay: '0.1s' }} />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl animate-float" style={{ animationDuration: '8s' }} />
      </div>
      <Header />
      <div className="pt-20">
        <Collaborations />
      </div>
      <MobileBottomNav />
      <Footer />
    </div>
  );
};

export default CollaborationsPage;
