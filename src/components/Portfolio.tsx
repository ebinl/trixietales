import { useState, useEffect } from "react";
import {
  Heart,
  Gem,
  Crown,
  Film,
  Music,
  Baby,
  Home,
  Cake,
  PartyPopper,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Play,
  Image,
  Video,
  Camera,
  Briefcase,
  Package,
  Building2,
  Users,
  Palette,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import {
  ScrollRevealHeading,
  ScrollRevealSubtitle,
  ScrollRevealBadge,
} from "@/components/ui/ScrollTextReveal";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";

// Gallery data with images and videos
const galleryData = {
  Wedding: {
    images: [
      "/images/protfolio images/Wedding/ANZ03064_Conv.webp",
      "/images/protfolio images/Wedding/ANZ03129_Conv.webp",
      "/images/protfolio images/Wedding/ANZ03160_Conv.webp",
      "/images/protfolio images/Wedding/ANZ03309_Conv.webp",
      "/images/protfolio images/Wedding/ANZ03375_Conv.webp",
      "/images/protfolio images/Wedding/ANZ03477_Conv.webp",
      "/images/protfolio images/Wedding/ANZ03706_Conv.webp",
      "/images/protfolio images/Wedding/DHA04732_Conv.webp",
      "/images/protfolio images/Wedding/DSC01317_Conv.webp",
      "/images/protfolio images/Wedding/DSC01503_Conv.webp",
      "/images/protfolio images/Wedding/DSC04407_Conv.webp",
      "/images/protfolio images/Wedding/DSC04429_Conv.webp",
      "/images/protfolio images/Wedding/DSC04435_Conv.webp",
      "/images/protfolio images/Wedding/DSC04438_Conv.webp",
      "/images/protfolio images/Wedding/DSC04775_Conv.webp",
      "/images/protfolio images/Wedding/DSC04965_Conv.webp",
      "/images/protfolio images/Wedding/DSC08959_Conv.webp",
      "/images/protfolio images/Wedding/DSC09356_Conv.webp",
      "/images/protfolio images/Wedding/DSC09460_Conv.webp",
      "/images/protfolio images/Wedding/DSC09495_Conv.webp",
      "/images/protfolio images/Wedding/DSC09507_Conv.webp",
      "/images/protfolio images/Wedding/DSC09518_Conv.webp",
      "/images/protfolio images/Wedding/DSC09578_Conv.webp",
      "/images/protfolio images/Wedding/DSC09612_Conv.webp",
      "/images/protfolio images/Wedding/DSC09785_Conv.webp",
      "/images/protfolio images/Wedding/IMG_4865_Conv.webp",
      "/images/protfolio images/Wedding/IMG_4871_TIF_Conv.webp",
      "/images/protfolio images/Wedding/IMG_4872_Conv.webp",
      "/images/protfolio images/Wedding/IMG_8185_TIF_Conv.webp",
      "/images/protfolio images/Wedding/MR0_7852_Conv.webp",
      "/images/protfolio images/Wedding/SCZ09116_Conv.webp",
      "/images/protfolio images/Wedding/SCZ09405_Conv.webp",
      "/images/protfolio images/Wedding/SCZ09491_Conv.webp",
      "/images/protfolio images/Wedding/SCZ09605_Conv.webp",
      "/images/protfolio images/Wedding/SCZ09617_Conv.webp",
      "/images/protfolio images/Wedding/SCZ09677_Conv.webp",
      "/images/protfolio images/Wedding/_DSC1797_Conv.webp",
      "/images/protfolio images/Wedding/_DSC1861_Conv.webp",
      "/images/protfolio images/Wedding/_DSC2438_Conv.webp",
    ],
    videos: [],
  },
  "Pre wedding": {
    images: [
      "/images/protfolio images/Pre-Wedding/DSC00047_Conv.webp",
      "/images/protfolio images/Pre-Wedding/DSC00075_Conv.webp",
      "/images/protfolio images/Pre-Wedding/DSC00225_Conv.webp",
      "/images/protfolio images/Pre-Wedding/DSC00244_Conv.webp",
      "/images/protfolio images/Pre-Wedding/DSC00286_Conv.webp",
      "/images/protfolio images/Pre-Wedding/DSC00540_Conv.webp",
      "/images/protfolio images/Pre-Wedding/DSC00556_Conv.webp",
      "/images/protfolio images/Pre-Wedding/DSC00732_Conv.webp",
      "/images/protfolio images/Pre-Wedding/DSC00744_Conv.webp",
      "/images/protfolio images/Pre-Wedding/DSC00873_Conv.webp",
      "/images/protfolio images/Pre-Wedding/DSC00881_Conv.webp",
      "/images/protfolio images/Pre-Wedding/DSC00886_Conv.webp",
      "/images/protfolio images/Pre-Wedding/DSC01051_Conv.webp",
      "/images/protfolio images/Pre-Wedding/DSC09603_Conv.webp",
      "/images/protfolio images/Pre-Wedding/DSC09730_Conv.webp",
      "/images/protfolio images/Pre-Wedding/SCZ01904-_Conv.webp",
      "/images/protfolio images/Pre-Wedding/SCZ02230_Conv.webp",
      "/images/protfolio images/Pre-Wedding/SCZ06248_Conv.webp",
    ],
    videos: [],
  },
  Engagement: {
    images: [
      "/images/protfolio images/Engagement/DHA00005_Conv.webp",
      "/images/protfolio images/Engagement/DHA09271_Conv.webp",
      "/images/protfolio images/Engagement/DHA09470_Conv.webp",
      "/images/protfolio images/Engagement/DHA09564_Conv.webp",
      "/images/protfolio images/Engagement/DHA09633_Conv.webp",
      "/images/protfolio images/Engagement/DHA09826_Conv.webp",
      "/images/protfolio images/Engagement/DSC00115_Conv.webp",
      "/images/protfolio images/Engagement/DSC00196_Conv.webp",
      "/images/protfolio images/Engagement/DSC00246_Conv.webp",
      "/images/protfolio images/Engagement/DSC00262_Conv.webp",
      "/images/protfolio images/Engagement/DSC00359_Conv.webp",
      "/images/protfolio images/Engagement/DSC00560_Conv.webp",
      "/images/protfolio images/Engagement/DSC00564_Conv.webp",
      "/images/protfolio images/Engagement/DSC00752_Conv.webp",
      "/images/protfolio images/Engagement/DSC01633_Conv.webp",
      "/images/protfolio images/Engagement/DSC01647_Conv.webp",
      "/images/protfolio images/Engagement/DSC01673_Conv.webp",
      "/images/protfolio images/Engagement/DSC01945_Conv.webp",
      "/images/protfolio images/Engagement/DSC01954_Conv.webp",
      "/images/protfolio images/Engagement/DSC01973_Conv.webp",
      "/images/protfolio images/Engagement/DSC02007_Conv.webp",
      "/images/protfolio images/Engagement/DSC02052_Conv.webp",
      "/images/protfolio images/Engagement/DSC02261_Conv.webp",
      "/images/protfolio images/Engagement/DSC09619_Conv.webp",
      "/images/protfolio images/Engagement/SCZ00183_Conv.webp",
      "/images/protfolio images/Engagement/SCZ00192_Conv.webp",
      "/images/protfolio images/Engagement/SCZ00215_Conv.webp",
      "/images/protfolio images/Engagement/SCZ01794_Conv.webp",
      "/images/protfolio images/Engagement/SCZ01868_Conv.webp",
      "/images/protfolio images/Engagement/SCZ02048_Conv.webp",
      "/images/protfolio images/Engagement/SCZ02256_Conv.webp",
      "/images/protfolio images/Engagement/SCZ02339_Conv.webp",
      "/images/protfolio images/Engagement/SCZ02488_Conv.webp",
      "/images/protfolio images/Engagement/SCZ02513_Conv.webp",
      "/images/protfolio images/Engagement/SCZ02542_Conv.webp",
      "/images/protfolio images/Engagement/SCZ02704_Conv.webp",
      "/images/protfolio images/Engagement/SCZ02875_Conv.webp",
      "/images/protfolio images/Engagement/SCZ02885_Conv.webp",
      "/images/protfolio images/Engagement/SCZ02989_Conv.webp",
      "/images/protfolio images/Engagement/SCZ03035_Conv.webp",
      "/images/protfolio images/Engagement/SCZ03047_Conv.webp",
      "/images/protfolio images/Engagement/SCZ09574_Conv.webp",
      "/images/protfolio images/Engagement/SCZ09592_Conv.webp",
      "/images/protfolio images/Engagement/SCZ09609_Conv.webp",
      "/images/protfolio images/Engagement/SCZ09658_Conv.webp",
      "/images/protfolio images/Engagement/SCZ09772_Conv.webp",
      "/images/protfolio images/Engagement/SCZ09816_Conv.webp",
    ],
    videos: [],
  },
  Reception: {
    images: [
      "/images/protfolio images/Reception/ANZ02171_Conv.webp",
      "/images/protfolio images/Reception/DHA03087_Conv.webp",
      "/images/protfolio images/Reception/DHA03112_Conv.webp",
      "/images/protfolio images/Reception/DHA03200_Conv.webp",
      "/images/protfolio images/Reception/DHA03282_Conv.webp",
      "/images/protfolio images/Reception/DHA03345_Conv.webp",
      "/images/protfolio images/Reception/DHA04504_Conv.webp",
      "/images/protfolio images/Reception/DSC08488_Conv.webp",
      "/images/protfolio images/Reception/DSC08495_Conv.webp",
      "/images/protfolio images/Reception/DSC08702_Conv.webp",
      "/images/protfolio images/Reception/SCZ09378 (2)_Conv.webp",
      "/images/protfolio images/Reception/SCZ09408_Conv.webp",
      "/images/protfolio images/Reception/SCZ09890_Conv.webp",
      "/images/protfolio images/Reception/_DSC0958_Conv.webp",
      "/images/protfolio images/Reception/_DSC0973_Conv.webp",
      "/images/protfolio images/Reception/_DSC1071_Conv.webp",
      "/images/protfolio images/Reception/_DSC1753_Conv.webp",
    ],
    videos: [],
  },
  "Haldi / Mehandi": {
    images: [
      "/images/protfolio images/Haldi & Mehendi/DSC00678_Conv.webp",
      "/images/protfolio images/Haldi & Mehendi/DSC00753_Conv.webp",
      "/images/protfolio images/Haldi & Mehendi/DSC00766_Conv.webp",
      "/images/protfolio images/Haldi & Mehendi/DSC00791_Conv.webp",
      "/images/protfolio images/Haldi & Mehendi/DSC00966_Conv.webp",
      "/images/protfolio images/Haldi & Mehendi/DSC01357_Conv.webp",
      "/images/protfolio images/Haldi & Mehendi/DSC01440_Conv.webp",
      "/images/protfolio images/Haldi & Mehendi/DSC01472_Conv.webp",
      "/images/protfolio images/Haldi & Mehendi/DSC04070_Conv.webp",
      "/images/protfolio images/Haldi & Mehendi/DSC04136_Conv.webp",
      "/images/protfolio images/Haldi & Mehendi/DSC04175_Conv.webp",
      "/images/protfolio images/Haldi & Mehendi/DSC04186_Conv.webp",
      "/images/protfolio images/Haldi & Mehendi/DSC04249_Conv.webp",
    ],
    videos: [],
  },
  Sangeeth: {
    images: [
      "/images/protfolio images/Sangeeth/DSC00129_Conv.webp",
      "/images/protfolio images/Sangeeth/DSC00758_Conv.webp",
      "/images/protfolio images/Sangeeth/DSC00759_Conv.webp",
      "/images/protfolio images/Sangeeth/DSC08681_Conv.webp",
      "/images/protfolio images/Sangeeth/DSC08779_Conv.webp",
      "/images/protfolio images/Sangeeth/DSC09597_Conv.webp",
      "/images/protfolio images/Sangeeth/DSC09977_Conv.webp",
    ],
    videos: [],
  },
  "Get togethers": {
    images: [],
    videos: [],
  },
  Birthdays: {
    images: [
      "/images/protfolio images/Birthday/5DVG3015_Conv.webp",
      "/images/protfolio images/Birthday/5DVG3109_Conv.webp",
      "/images/protfolio images/Birthday/DSC01925_Conv.webp",
      "/images/protfolio images/Birthday/DSC03537_Conv.webp",
      "/images/protfolio images/Birthday/DSC03544_Conv.webp",
      "/images/protfolio images/Birthday/DSC03567_Conv.webp",
      "/images/protfolio images/Birthday/DSC03599_Conv.webp",
      "/images/protfolio images/Birthday/DSC03664_Conv.webp",
      "/images/protfolio images/Birthday/DSC03954_Conv.webp",
      "/images/protfolio images/Birthday/DSC04021_Conv.webp",
      "/images/protfolio images/Birthday/DSC04874_Conv.webp",
      "/images/protfolio images/Birthday/DSC05049_Conv.webp",
      "/images/protfolio images/Birthday/DSC05116_Conv.webp",
      "/images/protfolio images/Birthday/DSC05145_Conv.webp",
      "/images/protfolio images/Birthday/DSC06151_Conv.webp",
      "/images/protfolio images/Birthday/DSC06261_Conv.webp",
      "/images/protfolio images/Birthday/DSC06307_Conv.webp",
      "/images/protfolio images/Birthday/DSC06357_Conv.webp",
      "/images/protfolio images/Birthday/DSC06975_Conv.webp",
      "/images/protfolio images/Birthday/DSC06990_Conv.webp",
      "/images/protfolio images/Birthday/DSC07052_Conv.webp",
      "/images/protfolio images/Birthday/DSC07056_Conv.webp",
      "/images/protfolio images/Birthday/DSC07151_Conv.webp",
      "/images/protfolio images/Birthday/DSC_5412_Conv.webp",
      "/images/protfolio images/Birthday/DSC_5420_Conv.webp",
      "/images/protfolio images/Birthday/DSC_5460_Conv.webp",
      "/images/protfolio images/Birthday/DSC_5719_Conv.webp",
      "/images/protfolio images/Birthday/DSC_7018_Conv.webp",
      "/images/protfolio images/Birthday/DSC_7036_Conv.webp",
      "/images/protfolio images/Birthday/DSC_8308_Conv.webp",
      "/images/protfolio images/Birthday/DSC_8884_Conv.webp",
      "/images/protfolio images/Birthday/MS_00255_Conv.webp",
      "/images/protfolio images/Birthday/MS_00262_Conv.webp",
      "/images/protfolio images/Birthday/MS_00266_Conv.webp",
      "/images/protfolio images/Birthday/RKP03764_Conv.webp",
      "/images/protfolio images/Birthday/RKP03844_Conv.webp",
      "/images/protfolio images/Birthday/RKP03947_Conv.webp",
      "/images/protfolio images/Birthday/ROY00192_Conv.webp",
      "/images/protfolio images/Birthday/ROY00244_Conv.webp",
      "/images/protfolio images/Birthday/ROY00311_Conv.webp",
      "/images/protfolio images/Birthday/ROY00514_Conv.webp",
      "/images/protfolio images/Birthday/SCZ03573_Conv.webp",
      "/images/protfolio images/Birthday/SCZ03672_Conv.webp",
      "/images/protfolio images/Birthday/SCZ03720_Conv.webp",
      "/images/protfolio images/Birthday/SCZ05895_Conv.webp",
      "/images/protfolio images/Birthday/SCZ06265_Conv.webp",
    ],
    videos: [],
  },
  "Naming ceremonies": {
    images: [
      "/images/protfolio images/Naming Ceremony/DSC03027_Conv.webp",
      "/images/protfolio images/Naming Ceremony/DSC03083_Conv.webp",
      "/images/protfolio images/Naming Ceremony/DSC03187_Conv.webp",
      "/images/protfolio images/Naming Ceremony/DSC03476_Conv.webp",
      "/images/protfolio images/Naming Ceremony/DSC03906_Conv.webp",
      "/images/protfolio images/Naming Ceremony/DSC03939_Conv.webp",
      "/images/protfolio images/Naming Ceremony/DSC03950_Conv.webp",
      "/images/protfolio images/Naming Ceremony/DSC04063_Conv.webp",
      "/images/protfolio images/Naming Ceremony/DSC04226_Conv.webp",
      "/images/protfolio images/Naming Ceremony/DSC04334_Conv.webp",
      "/images/protfolio images/Naming Ceremony/DSC04364_Conv.webp",
      "/images/protfolio images/Naming Ceremony/DSC04435_Conv.webp",
      "/images/protfolio images/Naming Ceremony/DSC04449_Conv.webp",
      "/images/protfolio images/Naming Ceremony/DSC05222_Conv.webp",
      "/images/protfolio images/Naming Ceremony/DSC06032_Conv.webp",
      "/images/protfolio images/Naming Ceremony/DSC06379_Conv.webp",
      "/images/protfolio images/Naming Ceremony/DSC_8143_Conv.webp",
      "/images/protfolio images/Naming Ceremony/MR0_0159_Conv.webp",
      "/images/protfolio images/Naming Ceremony/MR0_0164_Conv.webp",
      "/images/protfolio images/Naming Ceremony/MR0_0271_Conv.webp",
      "/images/protfolio images/Naming Ceremony/MR0_0553_Conv.webp",
      "/images/protfolio images/Naming Ceremony/MR0_0832_Conv.webp",
      "/images/protfolio images/Naming Ceremony/MR0_0968_Conv.webp",
      "/images/protfolio images/Naming Ceremony/MR0_1062_Conv.webp",
      "/images/protfolio images/Naming Ceremony/MR0_9757_Conv.webp",
      "/images/protfolio images/Naming Ceremony/SCZ05193_Conv.webp",
      "/images/protfolio images/Naming Ceremony/SCZ07570_Conv.webp",
      "/images/protfolio images/Naming Ceremony/SCZ07631_Conv.webp",
      "/images/protfolio images/Naming Ceremony/SCZ09706_Conv.webp",
    ],
    videos: [],
  },
  "Corporote shoots": {
    images: [],
    videos: [],
  },
  "Product Shoots": {
    images: [
      "/images/protfolio images/Product Shoot/DSC00002_Conv.webp",
      "/images/protfolio images/Product Shoot/DSC00007_Conv.webp",
      "/images/protfolio images/Product Shoot/DSC00014_Conv.webp",
      "/images/protfolio images/Product Shoot/DSC00029_Conv.webp",
      "/images/protfolio images/Product Shoot/DSC00037_Conv.webp",
      "/images/protfolio images/Product Shoot/DSC00040_Conv.webp",
      "/images/protfolio images/Product Shoot/DSC00068_Conv.webp",
      "/images/protfolio images/Product Shoot/DSC00088_Conv.webp",
      "/images/protfolio images/Product Shoot/DSC00099_Conv.webp",
      "/images/protfolio images/Product Shoot/DSC00139_Conv.webp",
      "/images/protfolio images/Product Shoot/DSC00173_Conv.webp",
      "/images/protfolio images/Product Shoot/DSC00218_Conv.webp",
      "/images/protfolio images/Product Shoot/DSC09827_Conv.webp",
      "/images/protfolio images/Product Shoot/DSC09829_Conv.webp",
      "/images/protfolio images/Product Shoot/DSC09834_Conv.webp",
      "/images/protfolio images/Product Shoot/DSC09866_Conv.webp",
      "/images/protfolio images/Product Shoot/DSC09878_Conv.webp",
      "/images/protfolio images/Product Shoot/DSC09934_Conv.webp",
      "/images/protfolio images/Product Shoot/DSC09961_Conv.webp",
      "/images/protfolio images/Product Shoot/DSC09995_Conv.webp",
      "/images/protfolio images/Product Shoot/IMGWA0012_Conv.webp",
      "/images/protfolio images/Product Shoot/IMGWA0013_Conv.webp",
      "/images/protfolio images/Product Shoot/IMGWA0014_Conv.webp",
      "/images/protfolio images/Product Shoot/IMGWA0015_Conv.webp",
      "/images/protfolio images/Product Shoot/IMGWA0016_Conv.webp",
      "/images/protfolio images/Product Shoot/IMGWA0017_Conv.webp",
      "/images/protfolio images/Product Shoot/IMGWA0018_Conv.webp",
      "/images/protfolio images/Product Shoot/IMGWA0019_Conv.webp",
      "/images/protfolio images/Product Shoot/IMGWA0021_Conv.webp",
      "/images/protfolio images/Product Shoot/IMGWA0022_Conv.webp",
      "/images/protfolio images/Product Shoot/IMGWA0023_Conv.webp",
      "/images/protfolio images/Product Shoot/IMGWA0024_Conv.webp",
      "/images/protfolio images/Product Shoot/IMGWA0025_Conv.webp",
      "/images/protfolio images/Product Shoot/IMGWA0026_Conv.webp",
      "/images/protfolio images/Product Shoot/IMGWA0027_Conv.webp",
      "/images/protfolio images/Product Shoot/IMGWA0028_Conv.webp",
      "/images/protfolio images/Product Shoot/IMGWA0029_Conv.webp",
      "/images/protfolio images/Product Shoot/IMGWA0030_Conv.webp",
      "/images/protfolio images/Product Shoot/IMGWA0031_Conv.webp",
      "/images/protfolio images/Product Shoot/IMGWA0032_Conv.webp",
      "/images/protfolio images/Product Shoot/IMGWA0033_Conv.webp",
      "/images/protfolio images/Product Shoot/IMGWA0034_Conv.webp",
    ],
    videos: [],
  },
  "Industrial Photography and Films": {
    images: [],
    videos: [],
  },
  "Baby shower": {
    images: [
      "/images/protfolio images/Babyshower/AKS09941_Conv.webp",
      "/images/protfolio images/Babyshower/DSC00048_Conv.webp",
      "/images/protfolio images/Babyshower/DSC00087_Conv.webp",
      "/images/protfolio images/Babyshower/DSC00131_Conv.webp",
      "/images/protfolio images/Babyshower/DSC00215_Conv.webp",
      "/images/protfolio images/Babyshower/DSC00229_Conv.webp",
      "/images/protfolio images/Babyshower/DSC00961_Conv.webp",
      "/images/protfolio images/Babyshower/DSC00998_Conv.webp",
      "/images/protfolio images/Babyshower/DSC01171_Conv.webp",
      "/images/protfolio images/Babyshower/DSC01282_Conv.webp",
      "/images/protfolio images/Babyshower/DSC01545_Conv.webp",
      "/images/protfolio images/Babyshower/DSC01608_Conv.webp",
      "/images/protfolio images/Babyshower/DSC04039_Conv.webp",
      "/images/protfolio images/Babyshower/DSC04040_Conv.webp",
      "/images/protfolio images/Babyshower/DSC04054_Conv.webp",
      "/images/protfolio images/Babyshower/DSC06205_Conv.webp",
      "/images/protfolio images/Babyshower/DSC06282_Conv.webp",
      "/images/protfolio images/Babyshower/SCZ04580_Conv.webp",
      "/images/protfolio images/Babyshower/SCZ04612_Conv.webp",
      "/images/protfolio images/Babyshower/SCZ04790_Conv.webp",
      "/images/protfolio images/Babyshower/SKP_0532_Conv.webp",
      "/images/protfolio images/Babyshower/SKP_0598_Conv.webp",
      "/images/protfolio images/Babyshower/SKP_0908_Conv.webp",
    ],
    videos: [],
  },
  Annaprashna: {
    images: [
      "/images/protfolio images/Annaprashana/DSC00017_Conv.webp",
      "/images/protfolio images/Annaprashana/DSC00019_Conv.webp",
      "/images/protfolio images/Annaprashana/DSC00048_Conv.webp",
      "/images/protfolio images/Annaprashana/DSC00052_Conv.webp",
      "/images/protfolio images/Annaprashana/DSC08845_Conv.webp",
      "/images/protfolio images/Annaprashana/DSC08848_Conv.webp",
      "/images/protfolio images/Annaprashana/DSC08963_Conv.webp",
      "/images/protfolio images/Annaprashana/DSC09052_Conv.webp",
      "/images/protfolio images/Annaprashana/DSC09073_Conv.webp",
      "/images/protfolio images/Annaprashana/DSC09098_Conv.webp",
      "/images/protfolio images/Annaprashana/DSC09145_Conv.webp",
      "/images/protfolio images/Annaprashana/DSC09181_Conv.webp",
      "/images/protfolio images/Annaprashana/DSC09731_Conv.webp",
      "/images/protfolio images/Annaprashana/DSC09782_Conv.webp",
      "/images/protfolio images/Annaprashana/DSC09974_Conv.webp",
      "/images/protfolio images/Annaprashana/MR_00085_Conv.webp",
      "/images/protfolio images/Annaprashana/MR_00112_Conv.webp",
      "/images/protfolio images/Annaprashana/MR_00183_Conv.webp",
    ],
    videos: [],
  },
  Babyshoot: {
    images: [
      "/images/protfolio images/Babyshoot/SCZ00985_Conv.webp",
      "/images/protfolio images/Babyshoot/SCZ01051_Conv.webp",
      "/images/protfolio images/Babyshoot/SCZ01210_Conv.webp",
      "/images/protfolio images/Babyshoot/SCZ01225_Conv.webp",
      "/images/protfolio images/Babyshoot/SCZ01373_Conv.webp",
      "/images/protfolio images/Babyshoot/SCZ01435_Conv.webp",
    ],
    videos: [],
  },
  "Half-Saree Ceremony": {
    images: [
      "/images/protfolio images/Half-Saree Ceremony/DSC02001_Conv.webp",
      "/images/protfolio images/Half-Saree Ceremony/DSC02027_Conv.webp",
      "/images/protfolio images/Half-Saree Ceremony/DSC06798_Conv.webp",
      "/images/protfolio images/Half-Saree Ceremony/DSC07126_2_Conv.webp",
      "/images/protfolio images/Half-Saree Ceremony/DSC07126_Conv.webp",
      "/images/protfolio images/Half-Saree Ceremony/DSC07174_Conv.webp",
      "/images/protfolio images/Half-Saree Ceremony/DSC07274_Conv.webp",
      "/images/protfolio images/Half-Saree Ceremony/DSC07290_Conv.webp",
      "/images/protfolio images/Half-Saree Ceremony/DSC07342_Conv.webp",
      "/images/protfolio images/Half-Saree Ceremony/DSC07385_Conv.webp",
      "/images/protfolio images/Half-Saree Ceremony/DSC07405_Conv.webp",
      "/images/protfolio images/Half-Saree Ceremony/IMG_4860_TIF_Conv.webp",
      "/images/protfolio images/Half-Saree Ceremony/IMG_4861_TIF_Conv.webp",
      "/images/protfolio images/Half-Saree Ceremony/IMG_4862_TIF_Conv.webp",
      "/images/protfolio images/Half-Saree Ceremony/IMG_4866_TIF_Conv.webp",
      "/images/protfolio images/Half-Saree Ceremony/IMG_4867_TIF_Conv.webp",
      "/images/protfolio images/Half-Saree Ceremony/IMG_4868_TIF_Conv.webp",
      "/images/protfolio images/Half-Saree Ceremony/IMG_4869_TIF_Conv.webp",
      "/images/protfolio images/Half-Saree Ceremony/IMG_4876_TIF_Conv.webp",
      "/images/protfolio images/Half-Saree Ceremony/IMG_4877_TIF_Conv.webp",
      "/images/protfolio images/Half-Saree Ceremony/IMG_4878_TIF_Conv.webp",
      "/images/protfolio images/Half-Saree Ceremony/IMG_4881_TIF_Conv.webp",
      "/images/protfolio images/Half-Saree Ceremony/SCZ05726_Conv.webp",
      "/images/protfolio images/Half-Saree Ceremony/SCZ05758_Conv.webp",
      "/images/protfolio images/Half-Saree Ceremony/SCZ05837_Conv.webp",
      "/images/protfolio images/Half-Saree Ceremony/SCZ06260_Conv.webp",
      "/images/protfolio images/Half-Saree Ceremony/SCZ06266_Conv.webp",
      "/images/protfolio images/Half-Saree Ceremony/SCZ06368_Conv.webp",
      "/images/protfolio images/Half-Saree Ceremony/SCZ06391_Conv.webp",
      "/images/protfolio images/Half-Saree Ceremony/SCZ06580_Conv.webp",
    ],
    videos: [],
  },
};

const services = [
  { icon: Heart, title: "Wedding", category: "Wedding", video: "/gif/wed.mp4" },
  { icon: Camera, title: "Pre wedding", category: "Pre wedding", video: "/gif/engagement.mp4" },
  { icon: Gem, title: "Engagement", category: "Engagement", video: "/gif/engagement.mp4" },
  { icon: Music, title: "Reception", category: "Reception", video: "/gif/reception.mp4" },
  { icon: PartyPopper, title: "Haldi / Mehandi", category: "Haldi / Mehandi", video: "/gif/haldi.mp4" },
  { icon: Music, title: "Sangeeth", category: "Sangeeth", video: "/gif/concert.mp4" },
  { icon: Users, title: "Get togethers", category: "Get togethers", video: "/gif/stories.mp4" },
  { icon: Cake, title: "Birthdays", category: "Birthdays", video: "/gif/birthday.mp4" },
  { icon: Baby, title: "Naming ceremonies", category: "Naming ceremonies", video: "/gif/anna.mp4" },
  { icon: Briefcase, title: "Corporote shoots", category: "Corporote shoots", video: "/gif/concert.mp4" },
  { icon: Package, title: "Product Shoots", category: "Product Shoots", video: "/gif/concert.mp4" },
  { icon: Building2, title: "Industrial Photography", category: "Industrial Photography and Films", video: "/gif/concert.mp4" },
  { icon: Baby, title: "Baby shower", category: "Baby shower", video: "/gif/maternity.mp4" },
  { icon: Baby, title: "Annaprashna", category: "Annaprashna", video: "/gif/anna.mp4" },
  { icon: Camera, title: "Babyshoot", category: "Babyshoot", video: "/gif/maternity.mp4" },
  { icon: Crown, title: "Half-Saree Ceremony", category: "Half-Saree Ceremony", video: "/gif/reception.mp4" },
];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalCategory, setModalCategory] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLightboxItem, setModalLightboxItem] = useState<"image" | "video" | null>(null);
  const [modalLightboxIndex, setModalLightboxIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("images");
  const [lightboxItem, setLightboxItem] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [youtubeByCategory, setYoutubeByCategory] = useState<Record<string, any[]>>({});

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleCategoryClick = (category) => {
    // open modal for this category
    setModalCategory(category);
    setModalOpen(true);
    setActiveTab("images");
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setLightboxItem(null);
  };

  const openLightbox = (type, index) => {
    setLightboxItem(type);
    setLightboxIndex(index);
  };

  const closeLightbox = () => setLightboxItem(null);

  const nextItem = () => {
    const items = lightboxItem === "image"
      ? galleryData[selectedCategory].images
      : getCombinedVideos(selectedCategory);
    setLightboxIndex((prev) => (prev + 1) % items.length);
  };

  const prevItem = () => {
    const items = lightboxItem === "image"
      ? galleryData[selectedCategory].images
      : getCombinedVideos(selectedCategory);
    setLightboxIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const currentGallery = selectedCategory ? galleryData[selectedCategory] : null;
  const modalGallery = modalCategory ? galleryData[modalCategory] : null;

  useEffect(() => {
    // listen for youtube videos added in admin
    const q = query(collection(db, "youtube_videos"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const map: Record<string, any[]> = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        const cat = data.category || "Uncategorized";
        if (!map[cat]) map[cat] = [];
        map[cat].push({ id: doc.id, ...data });
      });
      setYoutubeByCategory(map);
    });
    return () => unsub();
  }, []);

  // close modal on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (modalLightboxItem) {
          setModalLightboxItem(null);
        } else if (modalOpen) {
          setModalOpen(false);
        } else if (lightboxItem) {
          setLightboxItem(null);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen, modalLightboxItem, lightboxItem]);

  const getCombinedVideos = (category) => {
    const base = (galleryData[category] && galleryData[category].videos) || [];
    const yt = youtubeByCategory[category] ? youtubeByCategory[category].map(v => v.url) : [];
    return [...base, ...yt];
  };

  const isYouTubeUrl = (url: string) => /(?:youtube\.com|youtu\.be)/.test(url);
  const getYouTubeId = (url: string) => {
    if (!url) return null;
    // common patterns: watch?v=, youtu.be/, embed/
    const patterns = [/(?:v=|embed\/|be\/)([a-zA-Z0-9_-]{11})/, /youtu\.be\/([a-zA-Z0-9_-]{11})/, /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/];
    for (const p of patterns) {
      const m = url.match(p as RegExp);
      if (m && m[1]) return m[1];
    }
    try {
      const u = new URL(url);
      const v = u.searchParams.get('v');
      if (v) return v;
    } catch (e) {
      // ignore
    }
    return null;
  };
  const getYouTubeThumbnail = (url: string) => {
    const id = getYouTubeId(url);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
  };

  // Service Selection View
  if (!selectedCategory) {
    return (
      <section id="portfolio" className="py-24 relative overflow-hidden">

        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16 flex flex-col items-center">
            <ScrollRevealBadge className="mb-4">
              <Badge className="px-5 py-2 text-sm font-semibold tracking-wider uppercase border border-[#e6b76c]/40 bg-[#e6b76c]/10 text-[#e6b76c] shadow-[0_0_20px_rgba(230,183,108,0.2)]">
                Our Signature Portfolio
              </Badge>
            </ScrollRevealBadge>
            <ScrollRevealHeading
              text="Explore Our Curated Masterpieces"
              highlightWords={["Curated", "Masterpieces"]}
              className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"
            />
            <ScrollRevealSubtitle className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              A celebration of royal vows, intimate rituals, and timeless visual artistry captured across India.
            </ScrollRevealSubtitle>
          </div>

          <div className="relative">
            <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
              <CarouselContent className="-ml-4 md:-ml-6">
                {services.map((service, index) => (
                  <CarouselItem key={index} className="pl-4 md:pl-6 basis-3/4 sm:basis-1/2 lg:basis-1/4">
                    <div
                      className="group hover-lift"
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      <div
                        onClick={() => handleCategoryClick(service.category)}
                        className="relative cursor-pointer rounded-xl shadow-md overflow-hidden border-0 hover:shadow-2xl transition-all duration-500 aspect-square w-full"
                      >
                        <video
                          ref={(el) => {
                            if (el) {
                              if (isMobile || hoveredIndex === index) {
                                el.play();
                              } else {
                                el.pause();
                                el.currentTime = 0;
                              }
                            }
                          }}
                          loop
                          muted
                          playsInline
                          className="absolute inset-0 w-full h-full object-cover scale-125"
                        >
                          <source src={service.video} type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/40 transition-all duration-500"></div>

                        {/* Icon Badge */}
                        <div className="absolute top-4 right-4 p-3 rounded-xl bg-white/20 backdrop-blur-md group-hover:bg-white/30 transition-all">
                          <service.icon className="w-5 h-5 text-white" />
                        </div>
                      </div>

                      <h3 className="text-xl font-semibold mt-4 text-center text-gray-800 dark:text-gray-200 group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-6 md:-left-10" />
              <CarouselNext className="-right-6 md:-right-10" />
            </Carousel>
          </div>

          {/* Category modal opened from the service cards */}
          {modalOpen && modalCategory && (
            <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-2 md:p-10 pointer-events-auto" data-lenis-prevent>
              <div className="w-full max-w-7xl h-full max-h-[92vh] rounded-2xl bg-background border border-border shadow-2xl flex flex-col overflow-hidden animate-scale-in">
                <div className="px-6 py-4 flex items-center justify-between border-b border-border sticky top-0 bg-background/95 backdrop-blur-md z-20">
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight">{modalCategory}</h3>
                    <div className="text-sm text-muted-foreground">{(modalGallery?.images || []).length} photos • {getCombinedVideos(modalCategory).length} videos</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-1 bg-muted/50 p-1 rounded-lg">
                      <button onClick={() => setActiveTab('images')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'images' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>Images</button>
                      <button onClick={() => setActiveTab('videos')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'videos' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>Videos</button>
                    </div>
                    <button
                      onClick={() => setModalOpen(false)}
                      className="p-2 rounded-full hover:bg-muted transition-colors"
                      aria-label="Close modal"
                    >
                      <X className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                    </button>
                  </div>
                </div>

                <div
                  className="flex-1 overflow-y-auto p-4 md:p-8 overscroll-contain"
                  data-lenis-prevent
                  style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}
                >
                  <div className="md:hidden flex gap-2 mb-6 p-1 bg-muted/50 rounded-lg">
                    <button onClick={() => setActiveTab('images')} className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'images' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}>Images</button>
                    <button onClick={() => setActiveTab('videos')} className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'videos' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}>Videos</button>
                  </div>

                  {activeTab === 'images' && (
                    <div className="masonry columns-2 sm:columns-3 md:columns-4 gap-4">
                      {(modalGallery?.images || []).map((img, idx) => (
                        <div key={idx} className="mb-4 break-inside-avoid rounded-lg overflow-hidden shadow-sm group bg-gray-50 dark:bg-slate-800">
                          <button onClick={() => { setModalLightboxItem('image'); setModalLightboxIndex(idx); }} className="block w-full h-full group">
                            <img src={img} loading="lazy" decoding="async" className="w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-105" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'videos' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {getCombinedVideos(modalCategory).map((videoUrl, idx) => (
                        <div key={idx} className="relative rounded-lg overflow-hidden bg-black text-white shadow-sm">
                          {isYouTubeUrl(videoUrl) ? (
                            <button onClick={() => { setModalLightboxItem('video'); setModalLightboxIndex(idx); }} className="block w-full h-full">
                              <img src={getYouTubeThumbnail(videoUrl)} loading="lazy" decoding="async" className="w-full h-56 object-cover" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-xl">
                                  <Play className="w-8 h-8 text-primary" />
                                </div>
                              </div>
                            </button>
                          ) : (
                            <button onClick={() => { setModalLightboxItem('video'); setModalLightboxIndex(idx); }}>
                              <video src={videoUrl} className="w-full h-56 object-cover" preload="metadata" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Modal Lightbox for images/videos opened from category modal */}
          {modalLightboxItem && modalCategory && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-4">
              <div className="relative w-full max-w-6xl">
                <button onClick={() => setModalLightboxItem(null)} className="absolute -top-2 right-0 md:-right-2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full z-[10000]">
                  <X className="w-6 h-6" />
                </button>

                <div className="bg-black rounded-2xl overflow-hidden shadow-2xl z-[10001]">
                  {modalLightboxItem === 'image' ? (
                    <img src={(modalGallery?.images || [])[modalLightboxIndex]} className="w-full max-h-[80vh] object-contain mx-auto" />
                  ) : (
                    (() => {
                      const items = getCombinedVideos(modalCategory);
                      const url = items[modalLightboxIndex];
                      if (isYouTubeUrl(url)) {
                        const id = getYouTubeId(url);
                        const embed = id ? `https://www.youtube.com/embed/${id}?rel=0&autoplay=1` : url;
                        return (
                          <iframe
                            src={embed}
                            className="w-full h-[75vh]"
                            title="YouTube video"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            loading="lazy"
                          />
                        );
                      }
                      return <video src={url} controls autoPlay className="w-full h-[75vh] object-contain" />;
                    })()
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </section >
    );
  }

  // Gallery View with Slidable Carousels
  return (
    <section id="portfolio" className="py-12 relative overflow-hidden">
      {/* background removed for cleaner look */}

      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header with Back Button */}
        <div className="mb-8 animate-fade-in">
          <button
            onClick={handleBackToCategories}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6 group"
          >
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="font-medium">Back to Categories</span>
          </button>

          <div className="flex items-center gap-4 mb-2">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text">
              {selectedCategory} Gallery
            </h2>
          </div>
          <p className="text-muted-foreground flex items-center gap-3">
            <span className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              {currentGallery.images.length} Photos
            </span>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <span className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              {getCombinedVideos(selectedCategory).length} Videos
            </span>
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab("images")}
            className={`pb-3 px-4 font-semibold transition-all flex items-center gap-2 relative ${activeTab === "images"
              ? "text-primary"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
          >
            <Image className="w-4 h-4" />
            Images ({currentGallery.images.length})
            {activeTab === "images" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("videos")}
            className={`pb-3 px-4 font-semibold transition-all flex items-center gap-2 relative ${activeTab === "videos"
              ? "text-primary"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
          >
            <Video className="w-4 h-4" />
            Videos ({getCombinedVideos(selectedCategory).length})
            {activeTab === "videos" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600" />
            )}
          </button>
        </div>

        {/* Images Grid with featured hero */}
        {activeTab === "images" && (
          <div className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 rounded-xl overflow-hidden shadow-lg">
                {currentGallery.images[0] ? (
                  <button onClick={() => openLightbox("image", 0)} className="block w-full h-full">
                    <img src={currentGallery.images[0]} decoding="async" className="w-full h-96 object-cover rounded-xl" />
                  </button>
                ) : (
                  <div className="w-full h-96 bg-gray-100 dark:bg-slate-800 rounded-xl" />
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
                {currentGallery.images.slice(1, 5).map((img, idx) => (
                  <button key={idx} onClick={() => openLightbox("image", idx + 1)} className="rounded-lg overflow-hidden group shadow-sm">
                    <img src={img} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" decoding="async" />
                  </button>
                ))}
              </div>
            </div>

            {/* Full masonry below */}
            <div className="mt-6 masonry columns-2 sm:columns-3 md:columns-4 gap-4">
              {currentGallery.images.map((img, idx) => (
                <div key={idx} className="mb-4 break-inside-avoid rounded-lg overflow-hidden shadow-sm">
                  <button onClick={() => openLightbox("image", idx)} className="block w-full h-full">
                    <img src={img} alt={`${selectedCategory} ${idx + 1}`} className="w-full object-cover rounded-lg" loading="lazy" decoding="async" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Videos Carousel */}
        {activeTab === "videos" && (
          <div className="animate-fade-in">
            {getCombinedVideos(selectedCategory).length > 0 ? (
              <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
                <CarouselContent className="-ml-4 md:-ml-6">
                  {getCombinedVideos(selectedCategory).map((video, idx) => (
                    <CarouselItem key={idx} className="pl-4 md:pl-6 basis-full sm:basis-1/2 lg:basis-1/3">
                      <div
                        onClick={() => openLightbox("video", idx)}
                        className="relative aspect-video rounded-xl overflow-hidden cursor-pointer group shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-slate-700"
                      >
                        {isYouTubeUrl(video) ? (
                          <img src={getYouTubeThumbnail(video)} className="w-full h-full object-cover" />
                        ) : (
                          <video
                            src={video}
                            className="w-full h-full object-cover"
                            muted
                          />
                        )}
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                          <div className="w-20 h-20 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl">
                            <Play className="w-10 h-10 text-primary ml-1" fill="currentColor" />
                          </div>
                        </div>

                        {/* Video Badge */}
                        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-xs font-medium flex items-center gap-1.5">
                          <Video className="w-3.5 h-3.5" />
                          Video {idx + 1}
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="-left-6 md:-left-10" />
                <CarouselNext className="-right-6 md:-right-10" />
              </Carousel>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="p-6 rounded-full bg-primary/10 mb-4">
                  <Video className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  No Videos Available
                </h3>
                <p className="text-muted-foreground">
                  Videos for this category will be added soon.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/95 backdrop-blur-lg p-4 animate-fade-in pointer-events-auto"
          onClick={closeLightbox}
          data-lenis-prevent
        >
          <div
            className="relative w-full max-w-6xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute -top-2 right-0 md:-right-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-full transition-all hover:rotate-90 duration-300 group z-[10000]"
              aria-label="Close"
            >
              <X className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>

            {/* Title */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-1">{selectedCategory}</h3>
              <p className="text-white/70">
                {lightboxIndex + 1} of {lightboxItem === "image" ? currentGallery.images.length : getCombinedVideos(selectedCategory).length}
              </p>
            </div>

            {/* Content */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black z-[10001]">
              {(() => {
                if (lightboxItem === "image") {
                  return (
                    <img
                      src={currentGallery.images[lightboxIndex]}
                      alt={`${selectedCategory} ${lightboxIndex + 1}`}
                      className="w-full max-h-[75vh] object-contain mx-auto"
                    />
                  );
                }
                const items = getCombinedVideos(selectedCategory);
                const src = items[lightboxIndex];
                if (isYouTubeUrl(src)) {
                  const id = getYouTubeId(src);
                  const embed = id ? `https://www.youtube.com/embed/${id}?rel=0&autoplay=1` : src;
                  return (
                    <iframe
                      src={embed}
                      className="w-full max-h-[75vh]"
                      title="YouTube video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      loading="lazy"
                    />
                  );
                }
                return (
                  <video
                    src={src}
                    controls
                    autoPlay
                    className="w-full max-h-[75vh] object-contain mx-auto"
                  />
                );
              })()}

              {/* Navigation Arrows */}
              {((lightboxItem === "image" && currentGallery.images.length > 1) ||
                (lightboxItem === "video" && getCombinedVideos(selectedCategory).length > 1)) && (
                  <>
                    <button
                      onClick={prevItem}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-full transition-all hover:scale-110 group"
                      aria-label="Previous"
                    >
                      <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    </button>
                    <button
                      onClick={nextItem}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-full transition-all hover:scale-110 group"
                      aria-label="Next"
                    >
                      <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    </button>
                  </>
                )}
            </div>

            {/* Thumbnails */}
            {lightboxItem === "image" && currentGallery.images.length > 1 && (
              <div className="flex gap-2 mt-6 overflow-x-auto pb-2 px-1 scrollbar-hide">
                {currentGallery.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setLightboxIndex(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${idx === lightboxIndex
                      ? "border-primary ring-2 ring-primary/60 scale-105"
                      : "border-white/20 hover:border-white/50"
                      }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}



      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulseSlow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        .gradient-text {
          background: linear-gradient(135deg, #f59e0b 0%, #eab308 50%, #f59e0b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in;
        }
        .animate-scale-in {
          animation: scaleIn 0.3s ease-out;
        }
        .animate-pulse-slow {
          animation: pulseSlow 4s ease-in-out infinite;
        }
        .hover-lift {
          transition: transform 0.3s ease;
        }
        .hover-lift:hover {
          transform: translateY(-4px);
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .masonry {
          column-gap: 1rem;
        }
        .break-inside-avoid {
          break-inside: avoid-column;
          -webkit-column-break-inside: avoid;
          page-break-inside: avoid;
        }
        .masonry img {
          width: 100%;
          display: block;
        }
      `}</style>
    </section>
  );
}