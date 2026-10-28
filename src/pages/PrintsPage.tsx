import Header from "@/components/Header";
import Prints from "@/components/Prints";
import Prints3DSection from "@/components/Prints3DSection";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";

export const PrintsPage = () => {
  return (
    <div className="min-h-screen bg-[#07080c] text-white relative">
      <Header />

      <main className="pt-20">
        {/* Interactive 3D Frame & Art Visualizer */}
        <Prints3DSection />

        {/* Catalog of Museum Frames, Canvas & Lay-flat Albums */}
        <Prints />
      </main>

      <MobileBottomNav />
      <Footer />
    </div>
  );
};

export default PrintsPage;
