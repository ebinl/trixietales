import { useState, useRef, useEffect, Suspense, lazy } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Frame, BookOpen, Calendar, Image, X, Upload, Eye, Maximize2, Phone, CheckCircle, Palette, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ScrollRevealHeading,
  ScrollRevealSubtitle,
  ScrollRevealBadge,
} from "@/components/ui/ScrollTextReveal";
// Lazy load ThreeDViewer
const ThreeDViewer = lazy(() => import('./ThreeDViewer'));

// Simple scroll reveal hook
const useScrollReveal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return { ref, isVisible };
};

// Placeholder images
const frameClassic = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%238B4513' width='400' height='300'/%3E%3Crect fill='%23D2691E' x='20' y='20' width='360' height='260'/%3E%3C/svg%3E";
const frameModern = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23333' width='400' height='300'/%3E%3Crect fill='%23555' x='15' y='15' width='370' height='270'/%3E%3C/svg%3E";
const albumPortrait = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400'%3E%3Crect fill='%234A0E0E' width='300' height='400'/%3E%3Crect fill='%236B1616' x='30' y='30' width='240' height='340'/%3E%3C/svg%3E";
const albumLandscape = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%232C1810' width='400' height='300'/%3E%3Crect fill='%234A2C1A' x='30' y='30' width='340' height='240'/%3E%3C/svg%3E";
const calendarImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23fff' width='400' height='300'/%3E%3Crect fill='%23F59E0B' width='400' height='180'/%3E%3Crect fill='%23fff' y='180' width='400' height='120'/%3E%3C/svg%3E";
const magazineImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400'%3E%3Crect fill='%23fff' width='300' height='400'/%3E%3Crect fill='%23D97706' width='300' height='280'/%3E%3C/svg%3E";

interface PrintType {
  id: string;
  name: string;
  icon: any;
  description: string;
  variants?: { name: string; image: string; video?: string }[];
  features?: string[];
}

const printTypes: PrintType[] = [
  {
    id: "frames",
    name: "Premium Frames",
    icon: Frame,
    description: "Beautiful custom frames in various styles",
    features: ["Museum-quality materials", "Custom sizing available", "UV protection glass", "Professional mounting"],
    variants: [
      { name: "Classic Teakwood Frame", image: "/prints/wodden_frame.jpeg", video: "/prints/wodden_frame.mp4" },
      { name: "Dark Mahogany Wood Frame", image: "/prints/wodden_frame.jpeg", video: "/prints/wodden_frame.mp4" },
      { name: "Rustic Natural Oak Frame", image: "/prints/wodden_frame.jpeg", video: "/prints/wodden_frame.mp4" },
      { name: "Heritage Walnut Wood Frame", image: "/prints/wodden_frame.jpeg", video: "/prints/wodden_frame.mp4" },
      { name: "Royal Rosewood Frame", image: "/prints/wodden_frame.jpeg", video: "/prints/wodden_frame.mp4" },
      { name: "Acrylic Frame", image: "/prints/acr.jpeg", video: "/prints/acr.mp4" },
      { name: "Modern White Frame", image: "/prints/white_canvas.jpeg", video: "/prints/white_canvas.mp4" },
      { name: "Modern Black Canvas", image: "/prints/blk_canvas.jpeg", video: "/prints/blk_canvas.mp4" }
    ]
  },
  {
    id: "canvas",
    name: "Premium Canvas",
    icon: Palette,
    description: "Artistic canvas prints for your home and office",
    features: ["High-quality canvas", "Gallery wrap options", "Durable archival inks", "Ready to hang"],
    variants: [
      { name: "Fabric Canvas", image: "/prints/fabric_frame.jpeg", video: "/prints/fabric_frame.mp4" }
    ]
  },
  {
    id: "albums",
    name: "Premium Albums",
    icon: BookOpen,
    description: "Elegant photo albums to preserve your memories",
    features: ["Portrait & Landscape options", "Leather bound covers", "Lay-flat binding", "Premium paper quality"],
    variants: [
      { name: "Portrait Album", image: "/prints/potrate_album.jpeg", video: "/prints/potrate_album.mp4" },
      { name: "Landscape Album", image: "/prints/lanscape_album.jpeg", video: "/prints/lanscape_album.mp4" }
    ]
  },
  {
    id: "calendar",
    name: "Custom Calendars",
    icon: Calendar,
    description: "Personalized calendars with your memories",
    features: ["12-month layouts", "Custom start date", "High-quality printing", "Spiral or saddle binding"],
    variants: [
      { name: "Wall Calendar", image: "/prints/wall_calender.jpeg", video: "/prints/wall_calender.mp4" },
      { name: "Table Calendar", image: "/prints/table_calender.jpeg", video: "/prints/table_calender.mp4" }
    ]
  },
  {
    id: "magazine",
    name: "Photo Magazines",
    icon: Image,
    description: "Professional magazine-style photo books",
    features: ["Glossy or matte finish", "Editorial layouts", "Custom page count", "Professional binding"],
    variants: [
      { name: "Modern Photo Magazine", image: "/prints/mag.jpeg", video: "/prints/mag.mp4" }
    ]
  },
  {
    id: "engravings",
    name: "Custom Engravings",
    icon: Palette,
    description: "Laser-engraved wooden masterpieces",
    features: ["Precision laser engraving", "Premium wood selection", "Custom text & designs", "Durable finish"],
    variants: [
      { name: "Wooden Wall Portrait", image: "/prints/wooden_engraving.jpeg", video: "/prints/wooden_engraving.mp4" },
      { name: "Wooden Table Engraving Stand", image: "/prints/wooden_table_engraving.jpeg", video: "/prints/wooden_table_engraving.mp4" }
    ]
  }
];



const Prints = () => {
  const { ref, isVisible } = useScrollReveal();
  const [selectedPrint, setSelectedPrint] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [show3DViewer, setShow3DViewer] = useState(false);
  const [show3DPopup, setShow3DPopup] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState("frame");
  const [selected3DProduct, setSelected3DProduct] = useState(null);
  const fileInputRef = useRef(null);

  const popupFileInputRef = useRef(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const handleOrder = (printType, variant) => {
    const message = variant
      ? `Hi! I'd like to order ${variant} from ${printType}`
      : `Hi! I'd like to know more about ${printType}`;
    window.open(`https://wa.me/918618223659?text=${encodeURIComponent(message)}`, '_blank');
    toast.success("Redirecting to WhatsApp...");
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result);
        setShowPreview(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [showVideoPopup, setShowVideoPopup] = useState(false);
  const videoRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [initialTime, setInitialTime] = useState(0);

  const handleVideoDragStart = (e) => {
    setIsDragging(true);
    const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    setStartX(clientX);
    if (videoRef.current) {
      videoRef.current.pause();
      setInitialTime(videoRef.current.currentTime);
    }
  };

  const handleVideoDragMove = (e) => {
    if (!isDragging || !videoRef.current) return;
    const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    const delta = clientX - startX;
    const sensitivity = 0.01;
    videoRef.current.currentTime = initialTime + (delta * sensitivity);
  };

  const handleVideoDragEnd = () => {
    setIsDragging(false);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handle3DView = (variant) => {
    if (variant.video) {
      setSelectedVideo(variant.video);
      setShowVideoPopup(true);
      return;
    }
    setSelected3DProduct(variant);
    setShow3DViewer(true);
  };

  return (
    <section id="prints" ref={ref} className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-16 flex flex-col items-center">
          <ScrollRevealBadge className="mb-4">
            <Badge className="px-5 py-2 text-sm font-semibold tracking-wider uppercase border border-[#e6b76c]/40 bg-[#e6b76c]/10 text-[#e6b76c] shadow-[0_0_20px_rgba(230,183,108,0.2)]">
              Heritage Print Services
            </Badge>
          </ScrollRevealBadge>
          <ScrollRevealHeading
            text="Print Your Cherished Memories"
            highlightWords={["Cherished", "Memories"]}
            className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"
          />
          <ScrollRevealSubtitle className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform digital pixels into museum-grade fine art prints, teakwood frames, and luxury archival albums.
          </ScrollRevealSubtitle>
        </div>

        {/* Carousel */}
        <div className="relative">
          <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {printTypes.map((print, index) => {
                const Icon = print.icon;
                return (
                  <CarouselItem key={print.id} className="pl-2 md:pl-4 basis-3/4 md:basis-1/2 lg:basis-1/3">
                    <Card
                      className={`group hover-lift border overflow-hidden transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                        }`}
                      style={{
                        animationDelay: `${index * 0.1}s`,
                        transitionDelay: `${index * 0.05}s`
                      }}
                    >
                      <CardContent className="p-0">
                        <div className="p-8 bg-gradient-to-br from-primary/10 to-accent/10 relative overflow-hidden rounded-t-xl">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                          <div className="relative">
                            <div className="mb-4 inline-flex p-4 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:scale-110">
                              <Icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                              {print.name}
                            </h3>
                          </div>
                        </div>

                        <div className="p-6">
                          <p className="text-muted-foreground mb-4">{print.description}</p>

                          <ul className="space-y-2 mb-6">
                            {print.features?.map((feature, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>

                          <div className="flex gap-2">
                            <Button
                              className="flex-1"
                              onClick={() => setSelectedPrint(print)}
                            >
                              View Options
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handleOrder(print.name, null)}
                            >
                              <Phone className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="-left-6 md:-left-10" />
            <CarouselNext className="-right-6 md:-right-10" />
          </Carousel>
        </div>

        {/* CTA Section */}
        <div className={`mt-10 md:mt-16 text-center transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Card className="border-0 shadow-lg inline-block w-full md:w-auto overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <h3 className="text-lg md:text-2xl font-bold mb-3 md:mb-4">Custom Print Solutions</h3>
              <p className="text-[13px] md:text-base text-muted-foreground mb-5 md:mb-6 max-w-md mx-auto">
                Can't find what you're looking for? We offer custom printing solutions tailored to your needs.
              </p>
              <Button
                size="lg"
                className="group w-full sm:w-auto py-4 md:py-6 h-auto text-[13px] md:text-base"
                onClick={() => handleOrder("Custom Print Solutions", null)}
              >
                Contact Us for Custom Orders
                <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Variants Dialog */}
      <Dialog open={!!selectedPrint} onOpenChange={() => setSelectedPrint(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto rounded-xl">
          <DialogHeader>
            <div className="p-6 bg-gradient-to-br from-primary to-accent text-white relative overflow-hidden rounded-t-xl -m-6 mb-0">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <div className="inline-flex p-4 rounded-xl bg-white/20 backdrop-blur-sm mb-4">
                  {selectedPrint && <selectedPrint.icon className="w-8 h-8" />}
                </div>
                <DialogTitle className="text-3xl font-bold mb-2">{selectedPrint?.name}</DialogTitle>
                <DialogDescription className="text-white/90">
                  Browse through our {selectedPrint?.name.toLowerCase()} options and select your favorite
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 p-6">
            {selectedPrint?.variants?.map((variant, index) => (
              <div
                key={variant.name}
                className={`group transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <Card className="border-0 shadow-lg overflow-hidden hover-lift">
                  <CardContent className="p-0">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={variant.image}
                        alt={variant.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>

                    <div className="p-6">
                      <h4 className="font-semibold text-lg mb-2">{variant.name}</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Premium quality {variant.name.toLowerCase()} with professional finishing
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {variant.name === "Modern Photo Magazine" && (
                          <Button
                            onClick={() => setShowPdfViewer(true)}
                            className="flex-1"
                            size="sm"
                            variant="secondary"
                          >
                            <Image className="w-4 h-4 mr-2" />
                            Sample
                          </Button>
                        )}
                        <Button
                          onClick={() => handle3DView(variant)}
                          className="flex-1"
                          size="sm"
                        >
                          <Maximize2 className="w-4 h-4 mr-2" />
                          3D View
                        </Button>
                        <Button
                          onClick={() => handleOrder(selectedPrint.name, variant.name)}
                          variant="outline"
                          size="sm"
                        >
                          Order Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* 3D Viewer Dialog */}
      <Dialog open={show3DViewer} onOpenChange={setShow3DViewer}>
        <DialogContent className="max-w-5xl max-h-[90vh] rounded-xl">
          <DialogHeader>
            <div className="p-8 bg-gradient-to-br from-primary to-accent text-white relative overflow-hidden rounded-t-xl -m-6 mb-0">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <button
                onClick={() => setShow3DViewer(false)}
                className="absolute top-4 right-4 p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="relative">
                <div className="inline-flex p-4 rounded-xl bg-white/20 backdrop-blur-sm mb-4">
                  <Eye className="w-8 h-8" />
                </div>
                <DialogTitle className="text-3xl font-bold mb-2">
                  3D Product Viewer
                </DialogTitle>
                <DialogDescription className="text-white/90">
                  {selected3DProduct?.name} • Drag to rotate • Scroll to zoom
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="p-6">
            <Suspense fallback={<div className="w-full h-[500px] flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div></div>}>
              <ThreeDViewer
                productType={selectedProduct}
                userImage={previewImage}
              />
            </Suspense>

            <div className="flex flex-col sm:flex-row gap-3 justify-end mt-6">
              <Button variant="outline" onClick={() => setShow3DViewer(false)}>
                Close
              </Button>
              <Button
                onClick={() => {
                  handleOrder(selected3DProduct?.name || selectedProduct, null);
                  setShow3DViewer(false);
                }}
                className="group"
              >
                Order This Product
                <CheckCircle className="ml-2 w-4 h-4 group-hover:scale-110 transition-transform" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* PDF Viewer Dialog */}
      <Dialog open={showPdfViewer} onOpenChange={setShowPdfViewer}>
        <DialogContent className="max-w-6xl h-[90vh] p-0 overflow-hidden rounded-xl bg-slate-900/95 backdrop-blur-xl border-slate-800">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Image className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Modern Photo Magazine</h3>
                  <p className="text-sm text-white/60">Sample Preview</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPdfViewer(false)}
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 bg-slate-900 relative">
              <iframe
                src="/pdf/magzin.pdf"
                className="w-full h-full border-0"
                title="Magazine Preview"
              />
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 bg-black/20 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowPdfViewer(false)}
                className="border-white/10 text-white hover:bg-white/5 hover:text-white"
              >
                Close Preview
              </Button>
              <Button
                onClick={() => {
                  handleOrder("Modern Photo Magazine", "Sample View");
                  setShowPdfViewer(false);
                }}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Order This Magazine
                <CheckCircle className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl rounded-xl">
          <DialogHeader>
            <div className="p-8 bg-gradient-to-br from-primary to-accent text-white relative overflow-hidden rounded-t-xl -m-6 mb-0">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <button
                onClick={() => setShowPreview(false)}
                className="absolute top-4 right-4 p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="relative">
                <div className="inline-flex p-4 rounded-xl bg-white/20 backdrop-blur-sm mb-4">
                  <Eye className="w-8 h-8" />
                </div>
                <DialogTitle className="text-3xl font-bold mb-2">Product Preview</DialogTitle>
                <DialogDescription className="text-white/90">
                  See how your photo looks in our {selectedProduct} product
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="p-6">
            <Suspense fallback={<div className="w-full h-[500px] flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div></div>}>
              <ThreeDViewer
                productType={selectedProduct}
                userImage={previewImage}
              />
            </Suspense>

            <div className="flex flex-col sm:flex-row gap-3 justify-end mt-6">
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                Close
              </Button>
              <Button
                onClick={() => {
                  handleOrder(`${selectedProduct.charAt(0).toUpperCase() + selectedProduct.slice(1)} Print`, null);
                  setShowPreview(false);
                }}
                className="group"
              >
                Order This Product
                <CheckCircle className="ml-2 w-4 h-4 group-hover:scale-110 transition-transform" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New 3D Preview Popup Modal */}
      <Dialog open={show3DPopup} onOpenChange={setShow3DPopup}>
        <DialogContent className="max-w-6xl max-h-[95vh] rounded-2xl p-0 overflow-hidden border-0 shadow-2xl flex flex-col pointer-events-auto" data-lenis-prevent>
          {/* Header with gradient */}
          <div className="relative bg-gradient-to-br from-primary via-accent to-primary bg-[length:200%_200%] animate-gradient-shift p-8 text-white overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />

            {/* Close button */}
            <button
              onClick={() => setShow3DPopup(false)}
              className="absolute top-4 right-4 p-3 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:rotate-90 z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header content */}
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg">
                  <Eye className="w-10 h-10" />
                </div>
                <div>
                  <h2 className="text-4xl font-bold mb-2 flex items-center gap-3">
                    3D Product Preview
                    <Badge variant="secondary" className="bg-white/20 text-white border-0 animate-pulse">
                      Interactive
                    </Badge>
                  </h2>
                  <p className="text-white/90 text-lg">
                    Upload your image and visualize it in stunning 3D • Drag to rotate • Scroll to zoom
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div
            className="p-8 flex-1 overflow-y-auto overscroll-contain"
            data-lenis-prevent
            style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}
          >
            <div className="grid lg:grid-cols-12 gap-6">
              {/* Left Column: 3D Viewer (Takes up 7/12 columns) */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                <Card className="border-2 border-primary/30 overflow-hidden shadow-xl flex-1 min-h-[500px] relative">
                  <CardContent className="p-0 h-full">
                    <div className="absolute top-4 left-4 z-10">
                      <h3 className="text-2xl font-bold mb-1 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-lg inline-block">3D Preview</h3>
                      <p className="text-sm text-muted-foreground bg-white/80 backdrop-blur-sm px-3 py-1 rounded-lg inline-block mt-1">
                        Drag to rotate • Scroll to zoom
                      </p>
                    </div>
                    {previewImage && (
                      <div className="absolute top-4 right-4 z-10">
                        <Badge variant="secondary" className="animate-pulse shadow-lg">
                          <Eye className="w-3 h-3 mr-1" />
                          Live Preview
                        </Badge>
                      </div>
                    )}
                    <div className="relative w-full h-full bg-gradient-to-br from-gray-50 to-gray-100">
                      <Suspense fallback={<div className="w-full h-full flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div></div>}>
                        <ThreeDViewer
                          productType={selectedProduct}
                          userImage={previewImage}
                        />
                      </Suspense>
                      {!previewImage && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/5 backdrop-blur-sm pointer-events-none">
                          <div className="text-center p-8 bg-background/90 rounded-xl shadow-lg">
                            <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground animate-bounce" />
                            <p className="text-lg font-semibold mb-2">Upload an image to preview</p>
                            <p className="text-sm text-muted-foreground">
                              Your photo will appear here in 3D
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: Controls (Takes up 5/12 columns) */}
              <div className="lg:col-span-4 space-y-6">
                {/* Image Upload Card */}
                <Card className="border-2 border-dashed border-primary/30 hover:border-primary/60 transition-all duration-300 overflow-hidden group">
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 group-hover:from-primary/20 group-hover:to-accent/20 transition-all duration-300">
                        <Upload className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold mb-1">Upload Your Photo</h3>
                        <p className="text-xs text-muted-foreground mb-3">
                          Choose an image to preview
                        </p>
                      </div>
                      <input
                        type="file"
                        ref={popupFileInputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 5 * 1024 * 1024) {
                              toast.error("Image size should be less than 5MB");
                              return;
                            }
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setPreviewImage(event.target?.result);
                              toast.success("Image uploaded successfully!");
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        accept="image/*"
                        className="hidden"
                      />
                      <Button
                        onClick={() => popupFileInputRef.current?.click()}
                        className="w-full group/upload"
                      >
                        <Upload className="w-4 h-4 mr-2 group-hover/upload:scale-110 transition-transform" />
                        {previewImage ? 'Change Image' : 'Select Image'}
                      </Button>
                      {previewImage && (
                        <div className="mt-2 p-2 bg-green-500/10 border border-green-500/30 rounded-lg">
                          <p className="text-xs text-green-600 dark:text-green-400 flex items-center justify-center gap-2">
                            <CheckCircle className="w-3 h-3" />
                            Image loaded!
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Product Selector Card */}
                <Card className="border-2 border-primary/30 overflow-hidden flex-1">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-accent/10 to-primary/10">
                          <Frame className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">Product Type</h3>
                          <p className="text-xs text-muted-foreground">
                            Select display style
                          </p>
                        </div>
                      </div>

                      <div
                        className="space-y-2 max-h-[300px] overflow-y-auto pr-2 overscroll-contain"
                        data-lenis-prevent
                      >
                        {[
                          { value: 'frame', label: 'Photo Frame', icon: Frame, desc: 'Classic framed print' },
                          { value: 'magazine', label: 'Magazine', icon: BookOpen, desc: 'Magazine-style book' },
                          { value: 'calendar', label: 'Calendar', icon: Calendar, desc: 'Custom calendar' },
                          { value: 'album', label: 'Album', icon: Image, desc: 'Photo album' }
                        ].map((product) => (
                          <button
                            key={product.value}
                            onClick={() => setSelectedProduct(product.value)}
                            className={`w-full p-3 rounded-xl border-2 transition-all duration-300 text-left group/product ${selectedProduct === product.value
                              ? 'border-primary bg-primary/10 shadow-md scale-[1.02]'
                              : 'border-border hover:border-primary/50 hover:bg-primary/5'
                              }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg transition-colors ${selectedProduct === product.value
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted group-hover/product:bg-primary/20'
                                }`}>
                                <product.icon className="w-4 h-4" />
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-sm">{product.label}</div>
                                <div className="text-[10px] text-muted-foreground">{product.desc}</div>
                              </div>
                              {selectedProduct === product.value && (
                                <CheckCircle className="w-4 h-4 text-primary animate-scale-in" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 pt-2">
                  <Button
                    size="lg"
                    onClick={() => {
                      if (!previewImage) {
                        toast.error("Please upload an image first!");
                        return;
                      }
                      handleOrder(`${selectedProduct.charAt(0).toUpperCase() + selectedProduct.slice(1)} Print`, null);
                      setShow3DPopup(false);
                    }}
                    className="w-full group/order shadow-lg hover:shadow-xl transition-all"
                    disabled={!previewImage}
                  >
                    <Phone className="w-5 h-5 mr-2 group-hover/order:scale-110 transition-transform" />
                    Order This Product
                    <CheckCircle className="ml-2 w-5 h-5 group-hover/order:scale-110 transition-transform" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShow3DPopup(false)}
                    className="w-full"
                  >
                    Close Preview
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Popup Dialog */}
      <Dialog open={showVideoPopup} onOpenChange={setShowVideoPopup}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-0 rounded-xl" data-lenis-prevent>
          <div className="relative w-full aspect-video group">
            <video
              ref={videoRef}
              src={selectedVideo || ""}
              className="w-full h-full object-contain cursor-grab active:cursor-grabbing"
              autoPlay
              loop
              muted
              playsInline
              onMouseDown={handleVideoDragStart}
              onMouseMove={handleVideoDragMove}
              onMouseUp={handleVideoDragEnd}
              onMouseLeave={handleVideoDragEnd}
              onTouchStart={handleVideoDragStart}
              onTouchMove={handleVideoDragMove}
              onTouchEnd={handleVideoDragEnd}
            />

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
              Drag to rotate view
            </div>

            <button
              onClick={() => setShowVideoPopup(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <style>{`
        .hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-lift:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        .gradient-text {
          background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        /* Try Now Button */
        .try-now-btn {
          background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%);
          position: relative;
        }
        
        .try-now-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 0.75rem;
          background: linear-gradient(135deg, hsl(var(--accent)) 0%, hsl(var(--primary)) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .try-now-btn:hover::before {
          opacity: 1;
        }
        
        .try-now-btn::after {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 0.75rem;
          background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--primary)));
          background-size: 200% 200%;
          z-index: -1;
          animation: gradientShift 3s ease infinite;
          opacity: 0.6;
          filter: blur(8px);
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        /* Gradient Shift Animation */
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-gradient-shift {
          animation: gradient-shift 5s ease infinite;
        }
        
        /* Pulse Slow Animation */
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        /* Scale In Animation */
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </section>
  );
};

export default Prints;