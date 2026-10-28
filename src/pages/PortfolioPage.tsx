import Header from "@/components/Header";
import Portfolio from "@/components/Portfolio";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";

const PortfolioPage = () => {
  return (
    <div className="min-h-screen relative">
      {/* Background simplified: decorative gradients removed for a cleaner gallery */}
      <Header />
      <div className="pt-20">
        <Portfolio />
      </div>
      <MobileBottomNav />
      <Footer />
    </div>
  );
};

export default PortfolioPage;
