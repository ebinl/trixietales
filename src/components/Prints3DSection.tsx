import { useState, useRef, useEffect, ChangeEvent } from "react";
import * as THREE from "three";
import {
  Upload,
  RotateCcw,
  Image as ImageIcon,
  Frame,
  BookOpen,
  Calendar,
  Check,
  Layers,
  Palette,
  Eye,
  Sliders,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/hooks/useBooking";
import {
  ScrollRevealHeading,
  ScrollRevealSubtitle,
  ScrollRevealBadge,
} from "@/components/ui/ScrollTextReveal";

export type FrameStyle =
  | "wooden_natural"
  | "wooden_teak"
  | "wooden_mahogany"
  | "wooden_oak"
  | "wooden_walnut"
  | "wooden_rosewood"
  | "gold"
  | "black"
  | "minimalist";

export type ProductFormat = "frame" | "album" | "magazine" | "calendar";

// Format-specific authentic studio portraits & couple captures
export const FORMAT_SAMPLES: Record<
  ProductFormat,
  { id: string; label: string; url: string; badge?: string }[]
> = {
  frame: [
    { id: "sample_frame_1", label: "Royal Wedding Portrait", url: "/images/protfolio images/Wedding/DSC09460_Conv.webp", badge: "Museum Wood" },
    { id: "sample_frame_2", label: "Candid Pre-Wedding", url: "/images/protfolio images/Pre-Wedding/DSC00286_Conv.webp", badge: "Fine Art" },
    { id: "sample_frame_3", label: "Luxury Bridal Heirloom", url: "/images/protfolio images/Wedding/DSC09507_Conv.webp", badge: "Gallery Matte" },
    { id: "sample_frame_4", label: "Sunset Romance", url: "/images/protfolio images/Pre-Wedding/DSC00540_Conv.webp", badge: "Archival Luster" },
    { id: "sample_frame_5", label: "Grand Mandap Moments", url: "/images/protfolio images/Wedding/DSC04407_Conv.webp", badge: "Masterpiece" },
    { id: "sample_frame_6", label: "Heritage Couple", url: "/banner/3.jpeg", badge: "Classic Finish" },
  ],
  calendar: [
    { id: "sample_cal_1", label: "Desk Couple Keepsake", url: "/images/protfolio images/Pre-Wedding/DSC00744_Conv.webp", badge: "Gold Wire Stand" },
    { id: "sample_cal_2", label: "Wedding Bliss 12-Month", url: "/images/protfolio images/Wedding/ANZ03064_Conv.webp", badge: "Artisan Cotton" },
    { id: "sample_cal_3", label: "Pre-Wedding Escapade", url: "/images/protfolio images/Pre-Wedding/DSC00886_Conv.webp", badge: "Desk Art" },
    { id: "sample_cal_4", label: "Golden Hour Couple", url: "/banner/2.jpeg", badge: "Modern Layout" },
    { id: "sample_cal_5", label: "Romantic Sunset Embrace", url: "/images/protfolio images/Pre-Wedding/DSC00075_Conv.webp", badge: "Heirloom Edition" },
  ],
  magazine: [
    { id: "sample_mag_1", label: "Editorial Wedding Cover", url: "/images/protfolio images/Wedding/DSC04429_Conv.webp", badge: "Vogue Style" },
    { id: "sample_mag_2", label: "Couture Bride Feature", url: "/images/protfolio images/Wedding/DSC09356_Conv.webp", badge: "Glossy Spread" },
    { id: "sample_mag_3", label: "High-Fashion Romance", url: "/images/protfolio images/Pre-Wedding/DSC00225_Conv.webp", badge: "Collector's Issue" },
    { id: "sample_mag_4", label: "Cinematic Love Story", url: "/banner/1.jpeg", badge: "Coffee Table" },
    { id: "sample_mag_5", label: "Royal Reception Feature", url: "/images/protfolio images/Wedding/DSC04775_Conv.webp", badge: "Spotlight" },
  ],
  album: [
    { id: "sample_album_1", label: "Royal Heritage Vows", url: "/banner/1.jpeg", badge: "Leather Lay-Flat" },
    { id: "sample_album_2", label: "Candid Couple Heirloom", url: "/images/protfolio images/Wedding/DSC09495_Conv.webp", badge: "Gold Foil Spine" },
    { id: "sample_album_3", label: "Traditional Rituals", url: "/images/protfolio images/Wedding/_DSC2438_Conv.webp", badge: "Panoramic Spread" },
    { id: "sample_album_4", label: "Hillside Sunset Vows", url: "/images/protfolio images/Pre-Wedding/DSC00881_Conv.webp", badge: "Silk Ribbon" },
  ],
};

export const Prints3DSection = () => {
  const { openBooking } = useBooking();
  const [selectedFormat, setSelectedFormat] = useState<ProductFormat>("frame");
  const [selectedFrame, setSelectedFrame] = useState<FrameStyle>("wooden_natural");
  const [userImageUrl, setUserImageUrl] = useState<string>(
    FORMAT_SAMPLES.frame[0].url
  );
  const [customUploadName, setCustomUploadName] = useState<string | null>(null);
  const [isRotating, setIsRotating] = useState(true);
  const isRotatingRef = useRef(true);

  useEffect(() => {
    isRotatingRef.current = isRotating;
  }, [isRotating]);

  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const productGroupRef = useRef<THREE.Group | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Preload image element for canvas texture generators
  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!userImageUrl) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setLoadedImage(img);
    };
    img.onerror = () => {
      setLoadedImage(null);
    };
    img.src = userImageUrl;
  }, [userImageUrl]);

  // When format changes, switch sample to the authentic format sample if no custom upload is active
  const handleFormatChange = (format: ProductFormat) => {
    setSelectedFormat(format);
    if (!customUploadName) {
      const newUrl = FORMAT_SAMPLES[format][0].url;
      setUserImageUrl(newUrl);
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        setLoadedImage(img);
      };
      img.src = newUrl;
    }
  };

  // File Upload Handler with Instant Image Preload
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUserImageUrl(url);
      setCustomUploadName(file.name);
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        setLoadedImage(img);
      };
      img.src = url;
    }
  };

  // Reset 3D Rotation
  const handleResetAngle = () => {
    if (productGroupRef.current) {
      productGroupRef.current.rotation.set(0.1, 0, 0);
    }
  };

  // Initialize Three.js Scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 480;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.8);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xfff6e5, 1.4);
    scene.add(ambientLight);

    const mainSpot = new THREE.SpotLight(0xffffff, 2.6);
    mainSpot.position.set(4, 6, 6);
    mainSpot.angle = Math.PI / 4;
    mainSpot.penumbra = 0.6;
    mainSpot.castShadow = true;
    scene.add(mainSpot);

    const rimLight = new THREE.DirectionalLight(0xe6b76c, 2.0);
    rimLight.position.set(-5, -2, -3);
    scene.add(rimLight);

    const frontFill = new THREE.PointLight(0xffffff, 0.9);
    frontFill.position.set(0, 0, 4);
    scene.add(frontFill);

    // Root Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);
    productGroupRef.current = rootGroup;
    rootGroup.rotation.x = 0.1;

    // Interactive Drag to Rotate
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !productGroupRef.current) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;

      productGroupRef.current.rotation.y += deltaX * 0.009;
      productGroupRef.current.rotation.x += deltaY * 0.009;

      productGroupRef.current.rotation.x = Math.max(
        -0.8,
        Math.min(0.8, productGroupRef.current.rotation.x)
      );

      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);
    dom.addEventListener("touchstart", onPointerDown, { passive: true });
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("touchend", onPointerUp);

    // Animation Loop with isRotatingRef check (instant pause & resume)
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      if (isRotatingRef.current && !isDragging && productGroupRef.current) {
        productGroupRef.current.rotation.y += 0.004;
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      dom.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);
      dom.removeEventListener("touchstart", onPointerDown);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("touchend", onPointerUp);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  // Object-fit: cover helper for canvas drawing
  const drawImageProp = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    x: number,
    y: number,
    w: number,
    h: number
  ) => {
    const nw = img.naturalWidth || img.width;
    const nh = img.naturalHeight || img.height;
    const aspect = nw / nh;
    const targetAspect = w / h;
    let sx = 0,
      sy = 0,
      sw = nw,
      sh = nh;

    if (aspect > targetAspect) {
      sw = nh * targetAspect;
      sx = (nw - sw) / 2;
    } else {
      sh = nw / targetAspect;
      sy = (nh - sh) / 2;
    }
    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  };

  // 1. Generate Realistic Desk Calendar Canvas Texture
  const generateCalendarTexture = (img: HTMLImageElement | null): THREE.CanvasTexture => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d")!;

    // Archival cotton textured card background
    ctx.fillStyle = "#faf8f5";
    ctx.fillRect(0, 0, 1024, 1024);

    // Subtle paper edge border
    ctx.strokeStyle = "#e8e0d4";
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, 984, 984);

    // Simulated spiral punch holes along the top
    ctx.fillStyle = "#d5cbba";
    for (let i = 0; i < 14; i++) {
      const holeX = 90 + i * 64;
      ctx.beginPath();
      ctx.arc(holeX, 42, 8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Studio Branding Header
    ctx.fillStyle = "#9c7c4c";
    ctx.font = "bold 20px 'Cinzel', Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText("T R I X I E T A L E S   S T U D I O", 512, 92);

    // Client Photo Window (864 x 520 px)
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(80, 115, 864, 520, 12);
      ctx.clip();
      drawImageProp(ctx, img, 80, 115, 864, 520);
      ctx.restore();

      // Brushed Gold Hairline Border around photo
      ctx.strokeStyle = "#e6b76c";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(80, 115, 864, 520, 12);
      ctx.stroke();
    } else {
      ctx.fillStyle = "#1e2230";
      ctx.beginPath();
      ctx.roundRect(80, 115, 864, 520, 12);
      ctx.fill();
      ctx.fillStyle = "#e6b76c";
      ctx.font = "22px sans-serif";
      ctx.fillText("Loading Bespoke Portrait...", 512, 380);
    }

    // Calendar Month & Typography
    ctx.fillStyle = "#161821";
    ctx.font = "bold 38px 'Cinzel', Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText("DECEMBER 2026", 512, 695);

    ctx.fillStyle = "#8a7550";
    ctx.font = "13px sans-serif";
    ctx.fillText("BESPOKE WEDDING & FINE-ART PRINTS • WHITEFIELD, BENGALURU", 512, 725);

    // Weekday Headers
    const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
    const startX = 145;
    const colGap = 122;
    const dayY = 765;

    ctx.font = "bold 17px sans-serif";
    days.forEach((d, idx) => {
      ctx.fillStyle = idx >= 5 ? "#d48b3b" : "#555b6e";
      ctx.fillText(d, startX + idx * colGap, dayY);
    });

    // Calendar Date Grid
    ctx.font = "500 20px sans-serif";
    const firstDayOffset = 1; // Dec 2026 starts on Tuesday
    let dayNum = 1;
    const rowStartY = 810;
    const rowGap = 36;

    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 7; c++) {
        const slot = r * 7 + c;
        if (slot >= firstDayOffset && dayNum <= 31) {
          if (dayNum === 25) {
            ctx.fillStyle = "#e6b76c";
            ctx.beginPath();
            ctx.arc(startX + c * colGap, rowStartY + r * rowGap - 6, 16, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#000000";
          } else {
            ctx.fillStyle = c >= 5 ? "#c2782b" : "#222634";
          }
          ctx.fillText(dayNum.toString(), startX + c * colGap, rowStartY + r * rowGap);
          dayNum++;
        }
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  };

  // 2. Generate Realistic Luxury Magazine Cover Canvas Texture
  const generateMagazineTexture = (img: HTMLImageElement | null): THREE.CanvasTexture => {
    const canvas = document.createElement("canvas");
    canvas.width = 1000;
    canvas.height = 1400;
    const ctx = canvas.getContext("2d")!;

    // Client Photo as Full-Bleed Cover
    if (img && img.complete && img.naturalWidth > 0) {
      drawImageProp(ctx, img, 0, 0, 1000, 1400);

      // Top vignette gradient for masthead legibility
      const topGrad = ctx.createLinearGradient(0, 0, 0, 360);
      topGrad.addColorStop(0, "rgba(0,0,0,0.7)");
      topGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, 1000, 360);

      // Bottom vignette gradient for editorial headlines
      const botGrad = ctx.createLinearGradient(0, 920, 0, 1400);
      botGrad.addColorStop(0, "rgba(0,0,0,0)");
      botGrad.addColorStop(1, "rgba(0,0,0,0.85)");
      ctx.fillStyle = botGrad;
      ctx.fillRect(0, 920, 1000, 480);
    } else {
      ctx.fillStyle = "#12141c";
      ctx.fillRect(0, 0, 1000, 1400);
    }

    // High-Fashion Vogue-Style Masthead
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 84px 'Cinzel', Georgia, serif";
    ctx.textAlign = "center";
    ctx.shadowColor = "rgba(0,0,0,0.8)";
    ctx.shadowBlur = 16;
    ctx.fillText("T R I X I E T A L E S", 500, 130);

    // Masthead Sub-Banner
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#e6b76c";
    ctx.font = "bold 18px sans-serif";
    ctx.fillText("THE LUXURY WEDDING & EDITORIAL ISSUE", 500, 172);

    // Date & Issue Line
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "14px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("WINTER 2026 • ISSUE 24", 55, 215);

    ctx.textAlign = "right";
    ctx.fillText("COLLECTOR'S EDITION", 945, 215);

    // Thin separator line
    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(55, 228);
    ctx.lineTo(945, 228);
    ctx.stroke();

    // Editorial Headlines
    ctx.textAlign = "left";
    ctx.shadowColor = "rgba(0,0,0,0.9)";
    ctx.shadowBlur = 12;

    ctx.fillStyle = "#e6b76c";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText("EXCLUSIVE COVER STORY", 60, 1020);

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 44px 'Cinzel', Georgia, serif";
    ctx.fillText("ROYAL VOWS", 60, 1070);

    ctx.font = "300 20px sans-serif";
    ctx.fillStyle = "#f1f5f9";
    ctx.fillText("Timeless Elegance & Cinematic Love Stories", 60, 1105);
    ctx.fillText("Captured by Markhandeya • Bengaluru", 60, 1135);

    // Barcode Block (bottom right)
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(810, 1260, 140, 85);
    ctx.fillStyle = "#000000";
    for (let i = 0; i < 30; i++) {
      const w = i % 3 === 0 ? 4 : i % 2 === 0 ? 2 : 1;
      ctx.fillRect(820 + i * 4, 1272, w, 52);
    }
    ctx.font = "10px monospace";
    ctx.fillText("9 771234 567003", 824, 1336);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  };

  // 3. Generate Realistic Luxury Wedding Album Cover Canvas Texture (Debossed Cameo & Gold Foil)
  const generateAlbumCoverTexture = (img: HTMLImageElement | null): THREE.CanvasTexture => {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 900;
    const ctx = canvas.getContext("2d")!;

    // 1. Italian Grain Leather Background
    ctx.fillStyle = "#1c1916";
    ctx.fillRect(0, 0, 1200, 900);

    // Subtle leather cushion radial shading for soft padded volume
    const leatherGrad = ctx.createRadialGradient(600, 450, 150, 600, 450, 750);
    leatherGrad.addColorStop(0, "rgba(255,255,255,0.04)");
    leatherGrad.addColorStop(1, "rgba(0,0,0,0.55)");
    ctx.fillStyle = leatherGrad;
    ctx.fillRect(0, 0, 1200, 900);

    // Stitched perimeter line in antique gold thread
    ctx.strokeStyle = "rgba(230, 183, 108, 0.4)";
    ctx.lineWidth = 2.5;
    ctx.setLineDash([8, 6]);
    ctx.strokeRect(32, 32, 1136, 836);
    ctx.setLineDash([]);

    // Spine Hinge Crease groove on the left
    ctx.strokeStyle = "rgba(0,0,0,0.7)";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(92, 32);
    ctx.lineTo(92, 868);
    ctx.stroke();

    ctx.strokeStyle = "rgba(255,255,255,0.07)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(96, 32);
    ctx.lineTo(96, 868);
    ctx.stroke();

    // 2. Debossed Cameo Photo Window in center (Width: 680, Height: 480, X: 290, Y: 110)
    const cameoX = 290;
    const cameoY = 110;
    const cameoW = 680;
    const cameoH = 480;

    // Cameo debossed deep shadow bevel
    ctx.fillStyle = "#080706";
    ctx.fillRect(cameoX - 8, cameoY - 8, cameoW + 16, cameoH + 16);

    // Client/Uploaded Photo drawn with cover aspect ratio (Optimized for ANY resolution/orientation)
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(cameoX, cameoY, cameoW, cameoH);
      ctx.clip();
      drawImageProp(ctx, img, cameoX, cameoY, cameoW, cameoH);
      ctx.restore();
    } else {
      ctx.fillStyle = "#1e2230";
      ctx.fillRect(cameoX, cameoY, cameoW, cameoH);
      ctx.fillStyle = "#e6b76c";
      ctx.font = "24px 'Cinzel', Georgia, serif";
      ctx.textAlign = "center";
      ctx.fillText("Loading Royal Wedding Portrait...", 630, 360);
    }

    // Cameo Gold Embossed Beveled Border
    ctx.strokeStyle = "#e6b76c";
    ctx.lineWidth = 4;
    ctx.strokeRect(cameoX, cameoY, cameoW, cameoH);

    ctx.strokeStyle = "#ffd599";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(cameoX + 6, cameoY + 6, cameoW - 12, cameoH - 12);

    // 3. Hot-Stamped Gold Foil Typography below the photo
    ctx.textAlign = "center";
    ctx.shadowColor = "rgba(0,0,0,0.85)";
    ctx.shadowBlur = 10;

    // Brand Name
    ctx.fillStyle = "#e6b76c";
    ctx.font = "bold 32px 'Cinzel', Georgia, serif";
    ctx.fillText("T R I X I E T A L E S", 630, 680);

    // Subtitle
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#f5d799";
    ctx.font = "500 16px 'Cinzel', Georgia, serif";
    ctx.fillText("ROYAL HEIRLOOM WEDDING ALBUM", 630, 720);

    // Archival Note
    ctx.fillStyle = "#8a7d68";
    ctx.font = "12px sans-serif";
    ctx.fillText("LAY-FLAT ARCHIVAL LEATHER • BENGALURU", 630, 755);

    // Delicate gold decorative divider
    ctx.strokeStyle = "#e6b76c";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(480, 695);
    ctx.lineTo(780, 695);
    ctx.stroke();

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  };

  // Re-build 3D model whenever format, frameStyle, or image changes
  useEffect(() => {
    const root = productGroupRef.current;
    if (!root) return;

    // Clear old meshes
    while (root.children.length > 0) {
      const child = root.children[0] as THREE.Mesh;
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => m.dispose());
        } else {
          child.material.dispose();
        }
      }
      root.remove(child);
    }

    const textureLoader = new THREE.TextureLoader();
    const photoTexture = userImageUrl ? textureLoader.load(userImageUrl) : null;
    if (photoTexture) {
      photoTexture.colorSpace = THREE.SRGBColorSpace;
    }

    if (selectedFormat === "frame") {
      buildFrameModel(root, selectedFrame, photoTexture);
    } else if (selectedFormat === "album") {
      buildAlbumModel(root, loadedImage);
    } else if (selectedFormat === "magazine") {
      buildMagazineModel(root, loadedImage);
    } else if (selectedFormat === "calendar") {
      buildCalendarModel(root, loadedImage);
    }
  }, [selectedFormat, selectedFrame, userImageUrl, loadedImage]);

  // Model Builders
  // 1. Handcrafted Luxury Photo Frame
  const buildFrameModel = (
    group: THREE.Group,
    style: FrameStyle,
    texture: THREE.Texture | null
  ) => {
    let frameColor = 0x8a5229;
    let roughness = 0.65;
    let metalness = 0.05;

    if (style === "wooden_natural") {
      frameColor = 0x8c532b; // Handcrafted Natural Wooden Photo Frame
      roughness = 0.64;
      metalness = 0.06;
    } else if (style === "wooden_teak") {
      frameColor = 0xa05f2c; // Classic Teakwood warm golden timber
      roughness = 0.68;
      metalness = 0.05;
    } else if (style === "wooden_mahogany") {
      frameColor = 0x381a10; // Dark Mahogany deep espresso
      roughness = 0.58;
      metalness = 0.08;
    } else if (style === "wooden_oak") {
      frameColor = 0x9b6c42; // Rustic Oak natural organic timber
      roughness = 0.72;
      metalness = 0.04;
    } else if (style === "wooden_walnut") {
      frameColor = 0x2a170d; // Heritage Walnut dark chocolate
      roughness = 0.56;
      metalness = 0.1;
    } else if (style === "wooden_rosewood") {
      frameColor = 0x4a1414; // Royal Rosewood deep wine timber
      roughness = 0.52;
      metalness = 0.12;
    } else if (style === "gold") {
      frameColor = 0xe6b76c; // Brushed luxury gold
      roughness = 0.25;
      metalness = 0.88;
    } else if (style === "black") {
      frameColor = 0x141416; // Matte carbon black
      roughness = 0.45;
      metalness = 0.2;
    } else if (style === "minimalist") {
      frameColor = 0xdedede; // Sleek frosted aluminum
      roughness = 0.2;
      metalness = 0.6;
    }

    const frameWidth = 3.0;
    const frameHeight = 4.0;
    const frameDepth = 0.16;
    const mouldingWidth = 0.24;

    const frameMat = new THREE.MeshStandardMaterial({
      color: frameColor,
      roughness,
      metalness,
    });

    // 4-Sided Handcrafted Beveled Frame Moulding
    // Top Rail
    const topRail = new THREE.Mesh(
      new THREE.BoxGeometry(frameWidth, mouldingWidth, frameDepth),
      frameMat
    );
    topRail.position.set(0, frameHeight / 2 - mouldingWidth / 2, 0);
    topRail.castShadow = true;
    group.add(topRail);

    // Bottom Rail
    const botRail = new THREE.Mesh(
      new THREE.BoxGeometry(frameWidth, mouldingWidth, frameDepth),
      frameMat
    );
    botRail.position.set(0, -frameHeight / 2 + mouldingWidth / 2, 0);
    botRail.castShadow = true;
    group.add(botRail);

    // Left Rail
    const leftRail = new THREE.Mesh(
      new THREE.BoxGeometry(mouldingWidth, frameHeight - mouldingWidth * 2, frameDepth),
      frameMat
    );
    leftRail.position.set(-frameWidth / 2 + mouldingWidth / 2, 0, 0);
    leftRail.castShadow = true;
    group.add(leftRail);

    // Right Rail
    const rightRail = new THREE.Mesh(
      new THREE.BoxGeometry(mouldingWidth, frameHeight - mouldingWidth * 2, frameDepth),
      frameMat
    );
    rightRail.position.set(frameWidth / 2 - mouldingWidth / 2, 0, 0);
    rightRail.castShadow = true;
    group.add(rightRail);

    // Museum Passe-Partout (Matte Board)
    const matteWidth = frameWidth - mouldingWidth * 2 + 0.02;
    const matteHeight = frameHeight - mouldingWidth * 2 + 0.02;
    const matteMesh = new THREE.Mesh(
      new THREE.BoxGeometry(matteWidth, matteHeight, 0.025),
      new THREE.MeshStandardMaterial({ color: 0xfcfaf6, roughness: 0.9 })
    );
    matteMesh.position.z = 0.02;
    group.add(matteMesh);

    // Client Fine-Art Portrait
    const photoWidth = matteWidth - 0.45;
    const photoHeight = matteHeight - 0.55;
    const photoMat = texture
      ? new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.32,
          metalness: 0.05,
        })
      : new THREE.MeshStandardMaterial({ color: 0x222226, roughness: 0.5 });
    const photoMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(photoWidth, photoHeight),
      photoMat
    );
    photoMesh.position.z = 0.035;
    group.add(photoMesh);

    // Anti-Reflective Museum Glass
    const glassMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(matteWidth, matteHeight),
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.2,
        roughness: 0.04,
        metalness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.04,
        transmission: 0.88,
      })
    );
    glassMesh.position.z = frameDepth / 2 + 0.005;
    group.add(glassMesh);

    // Rear Kraft Backing Board & Tabletop Easel Strut (visible when rotated 360°)
    const backBoard = new THREE.Mesh(
      new THREE.BoxGeometry(frameWidth - 0.05, frameHeight - 0.05, 0.02),
      new THREE.MeshStandardMaterial({ color: 0x423224, roughness: 0.85 })
    );
    backBoard.position.z = -frameDepth / 2 - 0.01;
    group.add(backBoard);

    // Brass Hanging Hardware
    const dRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.08, 0.015, 8, 16),
      new THREE.MeshStandardMaterial({ color: 0xe6b76c, metalness: 0.9, roughness: 0.2 })
    );
    dRing.position.set(0, frameHeight / 2 - 0.6, -frameDepth / 2 - 0.02);
    group.add(dRing);

    // Folding Easel Leg on the Back
    const easelLeg = new THREE.Mesh(
      new THREE.BoxGeometry(0.25, 2.2, 0.02),
      new THREE.MeshStandardMaterial({ color: 0x33251a, roughness: 0.8 })
    );
    easelLeg.rotation.z = -0.08;
    easelLeg.position.set(0.15, -0.4, -frameDepth / 2 - 0.025);
    group.add(easelLeg);
  };

  // 2. Realistic Handcrafted Luxury Wedding Heirloom Album
  const buildAlbumModel = (group: THREE.Group, img: HTMLImageElement | null) => {
    const albumWidth = 3.6;
    const albumHeight = 2.7;
    const albumDepth = 0.28;

    const albumCoverTexture = generateAlbumCoverTexture(img);

    // 1. Padded Italian Leather Front Cover
    const coverGeo = new THREE.BoxGeometry(albumWidth, albumHeight, 0.035);
    const coverMat = new THREE.MeshPhysicalMaterial({
      map: albumCoverTexture,
      roughness: 0.48,
      metalness: 0.06,
      clearcoat: 0.18,
      clearcoatRoughness: 0.25,
    });
    const coverMesh = new THREE.Mesh(coverGeo, coverMat);
    coverMesh.position.z = albumDepth / 2;
    coverMesh.castShadow = true;
    group.add(coverMesh);

    // 2. Thick 24k Gold Foil Gilded Leaf Page Edges Block
    const pagesGeo = new THREE.BoxGeometry(albumWidth - 0.14, albumHeight - 0.1, albumDepth - 0.06);
    const pagesMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37, // 24k Gold foil edge
      metalness: 0.92,
      roughness: 0.2,
    });
    const pagesMesh = new THREE.Mesh(pagesGeo, pagesMat);
    pagesMesh.position.set(0.045, 0, 0);
    group.add(pagesMesh);

    // Subtle page leaf horizontal lines for realism
    for (let i = 1; i <= 3; i++) {
      const lineMesh = new THREE.Mesh(
        new THREE.BoxGeometry(albumWidth - 0.13, 0.005, albumDepth - 0.08),
        new THREE.MeshStandardMaterial({ color: 0x9e7f22, roughness: 0.4 })
      );
      lineMesh.position.set(0.05, -albumHeight / 2 + 0.05 + i * 0.02, 0);
      group.add(lineMesh);
    }

    // 3. Rounded Leather Spine with 4 Raised Spine Ribs (Hubs)
    const spineGeo = new THREE.BoxGeometry(0.12, albumHeight, albumDepth);
    const spineMat = new THREE.MeshStandardMaterial({
      color: 0x161412,
      roughness: 0.6,
      metalness: 0.06,
    });
    const spineMesh = new THREE.Mesh(spineGeo, spineMat);
    spineMesh.position.set(-albumWidth / 2 + 0.04, 0, 0);
    group.add(spineMesh);

    // 4 Raised Spine Ribs
    const ribGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.11, 16);
    const ribMat = new THREE.MeshStandardMaterial({ color: 0x241e18, roughness: 0.5 });
    [-0.9, -0.3, 0.3, 0.9].forEach((yPos) => {
      const rib = new THREE.Mesh(ribGeo, ribMat);
      rib.rotation.z = Math.PI / 2;
      rib.position.set(-albumWidth / 2 + 0.04, yPos, albumDepth / 2 + 0.01);
      group.add(rib);
    });

    // 4. Back Leather Cover
    const backGeo = new THREE.BoxGeometry(albumWidth, albumHeight, 0.035);
    const backMat = new THREE.MeshStandardMaterial({
      color: 0x191714,
      roughness: 0.6,
    });
    const backMesh = new THREE.Mesh(backGeo, backMat);
    backMesh.position.z = -albumDepth / 2;
    group.add(backMesh);

    // 5. Hanging Silk Gold Bookmark Ribbon
    const ribbonGeo = new THREE.PlaneGeometry(0.08, 0.65);
    const ribbonMat = new THREE.MeshStandardMaterial({
      color: 0xe6b76c,
      side: THREE.DoubleSide,
      roughness: 0.35,
    });
    const ribbonMesh = new THREE.Mesh(ribbonGeo, ribbonMat);
    ribbonMesh.rotation.z = 0.22;
    ribbonMesh.position.set(0.25, -albumHeight / 2 - 0.28, 0);
    group.add(ribbonMesh);
  };

  // 3. Ultra-Glossy Coffee-Table Editorial Magazine
  const buildMagazineModel = (group: THREE.Group, img: HTMLImageElement | null) => {
    const magWidth = 2.6;
    const magHeight = 3.6;
    const magDepth = 0.09;

    const magTexture = generateMagazineTexture(img);

    // Front Cover with High-Gloss Magazine Varnish
    const coverGeo = new THREE.BoxGeometry(magWidth, magHeight, 0.02);
    const coverMat = new THREE.MeshPhysicalMaterial({
      map: magTexture,
      roughness: 0.14,
      metalness: 0.04,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
    });
    const coverMesh = new THREE.Mesh(coverGeo, coverMat);
    coverMesh.position.z = magDepth / 2;
    coverMesh.castShadow = true;
    group.add(coverMesh);

    // Interior Coated Page Block (Stacked leaves)
    const pageBlockGeo = new THREE.BoxGeometry(magWidth - 0.04, magHeight - 0.04, magDepth - 0.02);
    const pageBlockMat = new THREE.MeshStandardMaterial({
      color: 0xf6f4ed,
      roughness: 0.8,
    });
    const pageBlockMesh = new THREE.Mesh(pageBlockGeo, pageBlockMat);
    pageBlockMesh.position.set(0.015, 0, 0);
    group.add(pageBlockMesh);

    // Square Bound Magazine Spine
    const spineGeo = new THREE.BoxGeometry(0.06, magHeight, magDepth);
    const spineMat = new THREE.MeshStandardMaterial({
      color: 0x161822,
      roughness: 0.4,
    });
    const spineMesh = new THREE.Mesh(spineGeo, spineMat);
    spineMesh.position.set(-magWidth / 2 + 0.03, 0, 0);
    group.add(spineMesh);

    // Back Cover
    const backGeo = new THREE.BoxGeometry(magWidth, magHeight, 0.02);
    const backMat = new THREE.MeshStandardMaterial({
      color: 0x11131a,
      roughness: 0.35,
    });
    const backMesh = new THREE.Mesh(backGeo, backMat);
    backMesh.position.z = -magDepth / 2;
    group.add(backMesh);
  };

  // 4. Luxury Free-Standing Desk Tent Calendar with Gold Twin-Wire Spiral
  const buildCalendarModel = (group: THREE.Group, img: HTMLImageElement | null) => {
    const calWidth = 3.2;
    const calHeight = 2.4;
    const calDepth = 0.04;

    const calTexture = generateCalendarTexture(img);

    // Tent/Easel Group
    const tentGroup = new THREE.Group();
    tentGroup.position.set(0, 0, 0);
    group.add(tentGroup);

    // Top Hinge Apex Y position
    const apexY = 1.1;

    // 1. Front Panel Pivot (hinged at the top apex)
    const frontPivot = new THREE.Group();
    frontPivot.position.set(0, apexY, 0);
    frontPivot.rotation.x = -0.16; // Slopes forward as it goes down

    // Heavy Archival Front Calendar Board
    const frontBoardGeo = new THREE.BoxGeometry(calWidth, calHeight, calDepth);
    const frontBoardMat = new THREE.MeshStandardMaterial({
      color: 0xf5f3ee,
      roughness: 0.85,
    });
    const frontBoardMesh = new THREE.Mesh(frontBoardGeo, frontBoardMat);
    frontBoardMesh.position.set(0, -calHeight / 2, 0); // Top of board is at pivot Y=0
    frontBoardMesh.castShadow = true;
    frontPivot.add(frontBoardMesh);

    // Calendar Face Page with Dynamic Calendar Canvas (Contains Photo + Dates)
    const faceGeo = new THREE.PlaneGeometry(calWidth - 0.02, calHeight - 0.02);
    const faceMat = new THREE.MeshStandardMaterial({
      map: calTexture,
      roughness: 0.75,
    });
    const faceMesh = new THREE.Mesh(faceGeo, faceMat);
    faceMesh.position.set(0, -calHeight / 2, calDepth / 2 + 0.005);
    frontPivot.add(faceMesh);

    // Stacked Leaves Edge Illusion
    for (let i = 1; i <= 3; i++) {
      const leafGeo = new THREE.BoxGeometry(calWidth - i * 0.012, calHeight - i * 0.012, 0.005);
      const leafMat = new THREE.MeshStandardMaterial({ color: 0xfcfaf5, roughness: 0.9 });
      const leafMesh = new THREE.Mesh(leafGeo, leafMat);
      leafMesh.position.set(0, -calHeight / 2 - i * 0.004, -calDepth / 2 + i * 0.006);
      frontPivot.add(leafMesh);
    }
    tentGroup.add(frontPivot);

    // 2. Back Easel Strut Pivot (hinged at the SAME top apex, slopes backwards)
    const backPivot = new THREE.Group();
    backPivot.position.set(0, apexY, 0);
    backPivot.rotation.x = 0.22; // Slopes BACKWARDS as it goes down (Z is strictly negative!)

    const backBoardGeo = new THREE.BoxGeometry(calWidth, calHeight, calDepth);
    const backBoardMat = new THREE.MeshStandardMaterial({
      color: 0x22201d, // Luxury dark charcoal/kraft card
      roughness: 0.8,
    });
    const backBoardMesh = new THREE.Mesh(backBoardGeo, backBoardMat);
    backBoardMesh.position.set(0, -calHeight / 2, -calDepth / 2); // Top edge at pivot, hangs backwards
    backBoardMesh.castShadow = true;
    backPivot.add(backBoardMesh);
    tentGroup.add(backPivot);

    // 3. Bottom Connecting Base Flap (Forms the closed triangular tent stand)
    const baseFlapGeo = new THREE.BoxGeometry(calWidth - 0.08, 0.02, 0.88);
    const baseFlapMat = new THREE.MeshStandardMaterial({ color: 0x2e2b26, roughness: 0.85 });
    const baseFlapMesh = new THREE.Mesh(baseFlapGeo, baseFlapMat);
    baseFlapMesh.position.set(0, apexY - calHeight * Math.cos(0.18) + 0.02, -0.06);
    tentGroup.add(baseFlapMesh);

    // 4. 14 Twin-Wire Spiral Rings in Brushed Luxury Gold along the top apex
    const ringGeo = new THREE.TorusGeometry(0.065, 0.013, 16, 24);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xe6b76c,
      metalness: 0.95,
      roughness: 0.15,
    });

    const ringCount = 14;
    const startX = -1.25;
    const stepX = 2.5 / (ringCount - 1);

    for (let i = 0; i < ringCount; i++) {
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.y = Math.PI / 2;
      ringMesh.position.set(startX + i * stepX, apexY, 0);
      tentGroup.add(ringMesh);
    }
  };

  const currentSamples = FORMAT_SAMPLES[selectedFormat] || FORMAT_SAMPLES.frame;

  return (
    <div className="w-full bg-[#07080c] py-20 px-4 md:px-8 border-y border-white/10 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#e6b76c]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 flex flex-col items-center">
          {/* Liquid Transparent Eyebrow Pill */}
          <ScrollRevealBadge className="mb-4">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/[0.08] backdrop-blur-2xl border border-white/20 text-[#e6b76c] text-xs font-bold uppercase tracking-[0.2em] shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
              <Eye className="w-3.5 h-3.5 text-[#e6b76c]" />
              <span>Interactive 3D Art Studio</span>
            </div>
          </ScrollRevealBadge>

          <ScrollRevealHeading
            text="Live 3D Prints & Frames Visualizer"
            highlightWords={["Frames", "Visualizer"]}
            className="text-3xl md:text-5xl font-black text-white tracking-tight font-serif mb-3"
          />
          <ScrollRevealSubtitle className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base font-light">
            Preview your photos inside our handcrafted wooden photo frames, lay-flat albums, luxe magazines, and desk calendars in real-time 360° 3D.
          </ScrollRevealSubtitle>
        </div>

        {/* 3D Visualizer Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Interactive 3D Canvas */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="relative w-full h-[430px] md:h-[520px] rounded-3xl bg-gradient-to-b from-[#10131d]/90 via-[#0a0c13]/95 to-[#06070b]/98 backdrop-blur-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden flex items-center justify-center group cursor-grab active:cursor-grabbing">
              {/* 3D Canvas Mount */}
              <div ref={containerRef} className="w-full h-full" />

              {/* Top Hint Bar - Liquid Glass */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                <span className="text-[11px] font-bold text-zinc-300 bg-black/60 backdrop-blur-xl px-3.5 py-1.5 rounded-full border border-white/15 shadow-lg flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Drag to rotate • 360° Studio View
                </span>
                <button
                  onClick={() => setIsRotating((prev) => !prev)}
                  className="pointer-events-auto text-[11px] font-bold text-zinc-300 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-xl px-3.5 py-1.5 rounded-full border border-white/20 transition-all shadow-md cursor-pointer"
                >
                  {isRotating ? "Pause Auto-Spin" : "Resume Auto-Spin"}
                </button>
              </div>

              {/* Bottom Angle Reset Button - Liquid Glass Circle */}
              <button
                onClick={handleResetAngle}
                className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-zinc-300 hover:text-[#e6b76c] transition-all shadow-lg flex items-center justify-center cursor-pointer"
                title="Reset angle"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {customUploadName && (
                <div className="absolute bottom-4 left-4 text-[11px] font-semibold text-[#e6b76c] bg-black/75 backdrop-blur-xl px-3.5 py-1.5 rounded-full border border-[#e6b76c]/40 flex items-center gap-1.5 shadow-md">
                  <Check className="w-3.5 h-3.5 text-[#e6b76c]" /> Custom Photo: {customUploadName}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Customization Controls */}
          <div className="lg:col-span-5 space-y-5">
            {/* Step 1: Product Format Selector */}
            <div className="p-5 rounded-3xl bg-gradient-to-b from-[#141724]/90 to-[#0c0e16]/90 backdrop-blur-xl border border-white/10 shadow-xl">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2 mb-3">
                <Layers className="w-4 h-4 text-[#e6b76c]" />
                1. Select Product Format
              </label>

              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: "frame", label: "Wall Frame", icon: Frame, desc: "Museum wood & glass" },
                  { id: "album", label: "Wedding Album", icon: BookOpen, desc: "Lay-flat leather bind" },
                  { id: "magazine", label: "Luxe Magazine", icon: ImageIcon, desc: "High-gloss editorial" },
                  { id: "calendar", label: "Desk Calendar", icon: Calendar, desc: "Gold wire spiral" },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = selectedFormat === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleFormatChange(item.id as ProductFormat)}
                      className={`p-3.5 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
                        isSelected
                          ? "bg-[#e6b76c]/20 border-[#e6b76c] shadow-[0_4px_20px_rgba(230,183,108,0.25)] ring-1 ring-[#e6b76c]/50"
                          : "bg-white/[0.04] backdrop-blur-md border-white/10 hover:border-white/20 text-zinc-400 hover:text-white hover:bg-white/[0.08]"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className={`w-4 h-4 ${isSelected ? "text-[#e6b76c]" : "text-zinc-400"}`} />
                        <span className={`text-xs font-bold ${isSelected ? "text-white" : "text-zinc-300"}`}>
                          {item.label}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-500 leading-tight">{item.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Format-Specific Samples & Upload */}
            <div className="p-5 rounded-3xl bg-gradient-to-b from-[#141724]/90 to-[#0c0e16]/90 backdrop-blur-xl border border-white/10 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-[#e6b76c]" />
                  2. Choose Sample Or Upload Photo
                </label>
                <span className="text-[10px] text-zinc-500 font-medium">JPG, PNG, WebP</span>
              </div>

              {/* Upload Input */}
              <div className="relative mb-3">
                <input
                  type="file"
                  id="client-photo-upload"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="client-photo-upload"
                  className="flex items-center justify-center gap-2.5 w-full py-3 px-4 rounded-xl border border-dashed border-[#e6b76c]/40 hover:border-[#e6b76c] bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-md text-zinc-200 hover:text-white cursor-pointer transition-all text-xs font-semibold group shadow-sm"
                >
                  <Upload className="w-4 h-4 text-[#e6b76c] group-hover:scale-110 transition-transform" />
                  <span>{customUploadName ? "Replace Uploaded Photo" : "Upload Your Photo to Test in 3D"}</span>
                </label>
              </div>

              {/* Format-Specific Real Studio Samples */}
              <div>
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold block mb-2">
                  Real {selectedFormat === "frame" ? "Frame" : selectedFormat === "magazine" ? "Magazine" : selectedFormat === "calendar" ? "Calendar" : "Album"} Studio Samples:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {currentSamples.map((sample) => {
                    const isSelected = userImageUrl === sample.url && !customUploadName;
                    return (
                      <button
                        key={sample.id}
                        onClick={() => {
                          setUserImageUrl(sample.url);
                          setCustomUploadName(null);
                        }}
                        className={`text-left p-2 rounded-xl border transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? "bg-[#e6b76c]/20 border-[#e6b76c] shadow-md ring-1 ring-[#e6b76c]/50 text-white"
                            : "bg-white/[0.04] border-white/10 hover:border-white/20 text-zinc-300 hover:bg-white/[0.08]"
                        }`}
                      >
                        <div className="text-[11px] font-bold truncate">{sample.label}</div>
                        {sample.badge && (
                          <div className="text-[9px] text-[#e6b76c] uppercase font-semibold tracking-wider mt-0.5 truncate">
                            {sample.badge}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Step 3: Frame Finishes (Only shown when Frame is selected) */}
            {selectedFormat === "frame" && (
              <div className="p-5 rounded-3xl bg-gradient-to-b from-[#141724]/90 to-[#0c0e16]/90 backdrop-blur-xl border border-white/10 shadow-xl">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2 mb-3">
                  <Palette className="w-4 h-4 text-[#e6b76c]" />
                  3. Select Frame Finish (Includes Handcrafted Wood)
                </label>

                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: "wooden_natural", label: "Handcrafted Wood", color: "#8c532b", desc: "Natural Organic Grain" },
                    { id: "wooden_teak", label: "Classic Teakwood", color: "#a05f2c", desc: "Warm Golden Timber" },
                    { id: "wooden_mahogany", label: "Dark Mahogany", color: "#441f14", desc: "Deep Espresso Wood" },
                    { id: "wooden_oak", label: "Rustic Oak", color: "#9b6c42", desc: "Natural Timber" },
                    { id: "wooden_walnut", label: "Heritage Walnut", color: "#331e13", desc: "Dark Chocolate Finish" },
                    { id: "wooden_rosewood", label: "Royal Rosewood", color: "#541a1a", desc: "Imperial Wine Wood" },
                    { id: "gold", label: "Brushed Gold", color: "#e6b76c", desc: "Signature Royal Brass" },
                    { id: "black", label: "Carbon Black", color: "#141416", desc: "Modern Matte Finish" },
                  ].map((style) => {
                    const isSelected = selectedFrame === style.id;
                    return (
                      <button
                        key={style.id}
                        onClick={() => setSelectedFrame(style.id as FrameStyle)}
                        className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all text-left cursor-pointer ${
                          isSelected
                            ? "bg-[#e6b76c]/20 border-[#e6b76c] shadow-md ring-1 ring-[#e6b76c]/40"
                            : "bg-white/[0.04] border-white/10 hover:border-white/20 text-zinc-300 hover:bg-white/[0.08]"
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-white/30 shrink-0 shadow"
                          style={{ backgroundColor: style.color }}
                        />
                        <div className="overflow-hidden">
                          <span className={`text-xs font-bold block truncate ${isSelected ? "text-white" : "text-zinc-300"}`}>
                            {style.label}
                          </span>
                          <span className="text-[9px] text-zinc-500 block truncate">{style.desc}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Order / Inquire CTA Button */}
            <div className="pt-2">
              <Button
                onClick={openBooking}
                className="w-full h-13 rounded-2xl bg-gradient-to-r from-[#e6b76c] to-[#d4a04e] hover:from-[#d4a04e] hover:to-[#c28e3b] text-black font-black text-xs uppercase tracking-widest shadow-xl shadow-[#e6b76c]/20 transition-transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Order Custom 3D Frame & Print Via WhatsApp</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prints3DSection;
