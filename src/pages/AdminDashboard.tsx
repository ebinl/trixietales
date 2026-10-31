import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus, Edit, Trash2, CheckCircle, MapPin, Phone, Mail, ExternalLink,
  User, Building2, Users, Palette, Music, Mic2, Heart, GraduationCap,
  Inbox, Star, Film, Search, Bell, Camera, Clock, Calendar,
  Image as ImageIcon, ArrowUp, ArrowDown, Eye, EyeOff, Upload, Sparkles, Loader2, X
} from "lucide-react";
import { toast } from "sonner";
import AdminTestimonials from "@/components/AdminTestimonials";
import { db, storage } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  timestamp: any;
  status: string;
}

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  message?: string;
  serviceId?: string;
  serviceName?: string;
  services?: Array<{
    id: string;
    name: string;
    price?: string;
  }>;
  totalPrice?: number;
  status: string;
  timestamp: any;
}

interface NewsletterSubscriber {
  id: string;
  email: string;
  timestamp: any;
  status: string;
}

interface CourseEnrollment {
  id: string;
  studentName: string;
  email: string;
  phone: string;
  about: string;
  courseTitle: string;
  courseDuration: string;
  courseLevel: string;
  enrollmentDate: string;
  timestamp: any;
  status?: string;
}

interface CollaborationRequest {
  id: string;
  serviceName: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  message: string;
  timestamp: any;
  status: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  price?: string;
  imageUrl?: string;
  category?: string;
  duration?: string;
  createdAt: any;
}

interface Collaborator {
  id: string;
  category: string;
  name: string;
  description: string;
  imageUrl: string;
  address: string;
  location: string;
  whatsappNumber: string;
  contactNumber: string;
  email: string;
  website?: string;
}

interface BannerItem {
  id: string;
  url: string;
  title?: string;
  subtitle?: string;
  location?: string;
  order: number;
  isActive: boolean;
  createdAt?: any;
}

const DEFAULT_BANNERS = [
  {
    url: "/banner/DSC00885.jpeg",
    title: "Sunset Architectural Silhouette",
    subtitle: "Golden Hour Whispers Amidst Ancient Heritage",
    location: "Heritage Sanctuaries",
    order: 1,
    isActive: true,
  },
  {
    url: "/banner/DSC09612.jpeg",
    title: "Palace Arch Romance",
    subtitle: "A Celebration of Love, Poise & Pure Joy",
    location: "Heritage Estate",
    order: 2,
    isActive: true,
  },
  {
    url: "/banner/DSC09578.jpeg",
    title: "Grand Colonnade Elegance",
    subtitle: "Where Architecture Meets Timeless Romance",
    location: "Bengaluru Palace",
    order: 3,
    isActive: true,
  },
  {
    url: "/banner/Banner_004.jpeg",
    title: "Sacred Mangalsutra Heirloom",
    subtitle: "Intimate Rituals & Heritage Traditions",
    location: "Vedic Sanctuaries",
    order: 4,
    isActive: true,
  },
  {
    url: "/banner/Wedding_Ritual.jpeg",
    title: "Joyous Sacred Vows",
    subtitle: "Shower of Blessings, Forever Treasured",
    location: "Royal Pavilion",
    order: 5,
    isActive: true,
  },
];

const serviceIcons: { [key: string]: any } = {
  "Wedding Halls": Building2,
  "Party Halls": Users,
  "Interior Designers": Palette,
  "Makeup Artists": Palette,
  "Orchestra": Music,
  "DJ Services": Mic2,
  "Photography": Camera,
  "Videography": Camera,
  "Catering": Users,
  "Decoration": Heart,
  "Other": Users
};

const collaboratorCategories = [
  "Makeover Artists",
  "Orchestra",
  "DJ",
  "Dhol",
  "Resorts and Conventions",
  "MC's",
  "Magicians",
  "Entertainers",
  "Bands",
  "Catering",
  "Decor",
  "Stage Lighting and Sounds",
  "LED",
  "VJ"
];

const galleryCategories = [
  "Wedding",
  "Pre wedding",
  "Engagement",
  "Reception",
  "Haldi / Mehandi",
  "Sangeeth",
  "Get togethers",
  "Birthdays",
  "Naming ceremonies",
  "Corporote shoots",
  "Product Shoots",
  "Industrial Photography and Films",
  "Baby shower",
  "Annaprashna",
  "Babyshoot",
  "Half-Saree Ceremony",
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("collaborators");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Data States
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [newsletterSubscribers, setNewsletterSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [courseEnrollments, setCourseEnrollments] = useState<CourseEnrollment[]>([]);
  const [collaborationRequests, setCollaborationRequests] = useState<CollaborationRequest[]>([]);
  const [collaboratorsList, setCollaboratorsList] = useState<Collaborator[]>([]);
  const [ratingsList, setRatingsList] = useState<any[]>([]);
  const [youtubeVideos, setYoutubeVideos] = useState<any[]>([]);
  const [servicesList, setServicesList] = useState<Service[]>([]);
  const [bookingsList, setBookingsList] = useState<Booking[]>([]);

  // UI States
  const [newVideoCategory, setNewVideoCategory] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [newVideoTitle, setNewVideoTitle] = useState("");
  const [isAddingVideo, setIsAddingVideo] = useState(false);
  const [showCollaboratorForm, setShowCollaboratorForm] = useState(false);
  const [editingCollaborator, setEditingCollaborator] = useState<Collaborator | null>(null);
  const [isSubmittingCollaborator, setIsSubmittingCollaborator] = useState(false);
  const [collaboratorForm, setCollaboratorForm] = useState({
    category: "",
    name: "",
    description: "",
    imageUrl: "",
    address: "",
    location: "",
    whatsappNumber: "",
    contactNumber: "",
    email: "",
    website: ""
  });

  // Service Management States
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isSubmittingService, setIsSubmittingService] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    category: "",
    duration: ""
  });

  // Banner Management States
  const [bannersList, setBannersList] = useState<BannerItem[]>([]);
  const [showBannerForm, setShowBannerForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerItem | null>(null);
  const [isSubmittingBanner, setIsSubmittingBanner] = useState(false);
  const [isUploadingBannerImage, setIsUploadingBannerImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isSeedingBanners, setIsSeedingBanners] = useState(false);
  const [bannerForm, setBannerForm] = useState({
    url: "",
    title: "",
    subtitle: "",
    location: "",
    order: 1,
    isActive: true,
  });

  // Auth Check
  useEffect(() => {
    const auth = localStorage.getItem("isAdminAuthenticated");
    if (auth !== "true") {
      navigate("/admin");
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  // Data Fetching Effects
  useEffect(() => {
    if (!isAuthenticated) return;

    const unsubContacts = onSnapshot(query(collection(db, "contactSubmissions"), orderBy("timestamp", "desc")), (snap) => {
      setContactSubmissions(snap.docs.map(d => ({ id: d.id, ...d.data() } as ContactSubmission)));
    });

    const unsubNewsletter = onSnapshot(query(collection(db, "newsletterSubscribers"), orderBy("timestamp", "desc")), (snap) => {
      setNewsletterSubscribers(snap.docs.map(d => ({ id: d.id, ...d.data() } as NewsletterSubscriber)));
    });

    const unsubEnrollments = onSnapshot(query(collection(db, "enrollments"), orderBy("timestamp", "desc")), (snap) => {
      setCourseEnrollments(snap.docs.map(d => ({ id: d.id, ...d.data() } as CourseEnrollment)));
    });

    const unsubCollabRequests = onSnapshot(query(collection(db, "partnerSubmissions"), orderBy("timestamp", "desc")), (snap) => {
      setCollaborationRequests(snap.docs.map(d => ({ id: d.id, ...d.data() } as CollaborationRequest)));
    });

    const unsubCollaborators = onSnapshot(query(collection(db, "collaborators"), orderBy("name", "asc")), (snap) => {
      setCollaboratorsList(snap.docs.map(d => ({ id: d.id, ...d.data() } as Collaborator)));
    });

    const unsubRatings = onSnapshot(query(collection(db, "ratings"), orderBy("createdAt", "desc")), (snap) => {
      setRatingsList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const unsubVideos = onSnapshot(query(collection(db, "youtube_videos"), orderBy("createdAt", "desc")), (snap) => {
      setYoutubeVideos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const unsubServices = onSnapshot(collection(db, "services"), (snap) => {
      const services = snap.docs.map(d => ({ id: d.id, ...d.data() } as Service));
      // Sort manually to handle cases where createdAt might be missing
      setServicesList(services.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      }));
    });

    const unsubBookings = onSnapshot(query(collection(db, "bookings"), orderBy("timestamp", "desc")), (snap) => {
      setBookingsList(snap.docs.map(d => ({ id: d.id, ...d.data() } as Booking)));
    });

    const unsubBanners = onSnapshot(query(collection(db, "banner_images"), orderBy("order", "asc")), (snap) => {
      setBannersList(snap.docs.map(d => ({ id: d.id, ...d.data() } as BannerItem)));
    });

    return () => {
      unsubContacts();
      unsubNewsletter();
      unsubEnrollments();
      unsubCollabRequests();
      unsubCollaborators();
      unsubRatings();
      unsubVideos();
      unsubServices();
      unsubBookings();
      unsubBanners();
    };
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem("isAdminAuthenticated");
    toast.success("Logged out successfully");
    navigate("/admin");
  };

  // Action Handlers
  const handleDelete = async (collectionName: string, id: string, successMsg: string) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
      toast.success(successMsg);
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const handleUpdateStatus = async (collectionName: string, id: string, status: string, successMsg: string) => {
    try {
      await updateDoc(doc(db, collectionName, id), { status });
      toast.success(successMsg);
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const handleCollaboratorFormChange = (field: string, value: string) => {
    setCollaboratorForm(prev => ({ ...prev, [field]: value }));
  };

  const handleCollaboratorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingCollaborator(true);
    try {
      if (editingCollaborator) {
        await updateDoc(doc(db, "collaborators", editingCollaborator.id), collaboratorForm);
        toast.success("Collaborator updated");
      } else {
        await addDoc(collection(db, "collaborators"), collaboratorForm);
        toast.success("Collaborator added");
      }
      setShowCollaboratorForm(false);
      setEditingCollaborator(null);
      setCollaboratorForm({
        category: "", name: "", description: "", imageUrl: "", address: "",
        location: "", whatsappNumber: "", contactNumber: "", email: "", website: ""
      });
    } catch (error) {
      toast.error("Failed to save collaborator");
    } finally {
      setIsSubmittingCollaborator(false);
    }
  };

  const handleEditCollaborator = (collaborator: Collaborator) => {
    setEditingCollaborator(collaborator);
    setCollaboratorForm({
      category: collaborator.category,
      name: collaborator.name,
      description: collaborator.description,
      imageUrl: collaborator.imageUrl,
      address: collaborator.address,
      location: collaborator.location,
      whatsappNumber: collaborator.whatsappNumber,
      contactNumber: collaborator.contactNumber,
      email: collaborator.email,
      website: collaborator.website || ""
    });
    setShowCollaboratorForm(true);
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingService(true);
    try {
      if (editingService) {
        await updateDoc(doc(db, "services", editingService.id), serviceForm);
        toast.success("Service updated");
      } else {
        await addDoc(collection(db, "services"), {
          ...serviceForm,
          createdAt: serverTimestamp()
        });
        toast.success("Service added");
      }
      setShowServiceForm(false);
      setEditingService(null);
      setServiceForm({
        name: "", description: "", price: "", imageUrl: "", category: "", duration: ""
      });
    } catch (error) {
      toast.error("Failed to save service");
    } finally {
      setIsSubmittingService(false);
    }
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setServiceForm({
      name: service.name,
      description: service.description,
      price: service.price || "",
      imageUrl: service.imageUrl || "",
      category: service.category || "",
      duration: service.duration || ""
    });
    setShowServiceForm(true);
  };

  const handleDeleteCollaborator = async (id: string) => {
    try {
      await deleteDoc(doc(db, "collaborators", id));
      toast.success("Collaborator deleted");
    } catch (error) {
      toast.error("Failed to delete collaborator");
    }
  };

  // Banner Management Handlers
  const handleBannerFormChange = (field: string, value: any) => {
    setBannerForm(prev => ({ ...prev, [field]: value }));
  };

  const handleOpenAddBanner = () => {
    setEditingBanner(null);
    setBannerForm({
      url: "",
      title: "",
      subtitle: "",
      location: "",
      order: bannersList.length + 1,
      isActive: true,
    });
    setUploadProgress(null);
    setShowBannerForm(true);
  };

  const handleOpenEditBanner = (banner: BannerItem) => {
    setEditingBanner(banner);
    setBannerForm({
      url: banner.url,
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      location: banner.location || "",
      order: banner.order || 1,
      isActive: banner.isActive !== false,
    });
    setUploadProgress(null);
    setShowBannerForm(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    setIsUploadingBannerImage(true);
    setUploadProgress(10);
    try {
      const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
      const storageRef = ref(storage, `banners/${Date.now()}_${cleanName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Banner upload error:", error);
          toast.error("Upload failed: " + error.message);
          setIsUploadingBannerImage(false);
          setUploadProgress(null);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          setBannerForm(prev => ({ ...prev, url: downloadUrl }));
          setIsUploadingBannerImage(false);
          setUploadProgress(100);
          toast.success("Photo uploaded to Firebase Storage!");
        }
      );
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to upload image");
      setIsUploadingBannerImage(false);
      setUploadProgress(null);
    }
  };

  const handleBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerForm.url.trim()) {
      toast.error("Please upload a photo or provide an image URL / path");
      return;
    }

    setIsSubmittingBanner(true);
    try {
      const bannerData = {
        url: bannerForm.url.trim(),
        title: bannerForm.title.trim(),
        subtitle: bannerForm.subtitle.trim(),
        location: bannerForm.location.trim(),
        order: Number(bannerForm.order) || 1,
        isActive: bannerForm.isActive,
      };

      if (editingBanner) {
        await updateDoc(doc(db, "banner_images", editingBanner.id), {
          ...bannerData,
          updatedAt: serverTimestamp(),
        });
        toast.success("Banner photo updated successfully");
      } else {
        await addDoc(collection(db, "banner_images"), {
          ...bannerData,
          createdAt: serverTimestamp(),
        });
        toast.success("New banner photo added successfully");
      }

      setShowBannerForm(false);
      setEditingBanner(null);
    } catch (error) {
      console.error("Banner save error:", error);
      toast.error("Failed to save banner photo");
    } finally {
      setIsSubmittingBanner(false);
    }
  };

  const handleToggleBannerActive = async (banner: BannerItem) => {
    try {
      await updateDoc(doc(db, "banner_images", banner.id), {
        isActive: !banner.isActive,
      });
      toast.success(banner.isActive ? "Banner slide hidden" : "Banner slide activated");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleMoveBanner = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= bannersList.length) return;

    const currentItem = bannersList[index];
    const targetItem = bannersList[targetIndex];

    try {
      const currentOrder = currentItem.order ?? index + 1;
      const targetOrder = targetItem.order ?? targetIndex + 1;

      await updateDoc(doc(db, "banner_images", currentItem.id), { order: targetOrder });
      await updateDoc(doc(db, "banner_images", targetItem.id), { order: currentOrder });
      toast.success("Slide order updated");
    } catch (error) {
      toast.error("Failed to reorder banner slides");
    }
  };

  const handleSeedDefaultBanners = async () => {
    setIsSeedingBanners(true);
    try {
      for (const item of DEFAULT_BANNERS) {
        await addDoc(collection(db, "banner_images"), {
          ...item,
          createdAt: serverTimestamp(),
        });
      }
      toast.success("5 Showcase photos successfully populated into banner!");
    } catch (error) {
      console.error("Seeding banners error:", error);
      toast.error("Failed to populate default banners");
    } finally {
      setIsSeedingBanners(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString();
  };

  const getServiceIcon = (serviceName: string) => {
    const IconComponent = serviceIcons[serviceName] || Users;
    return <IconComponent className="w-4 h-4" />;
  };

  if (!isAuthenticated) return null;

  const counts = {
    collaborators: collaboratorsList.length,
    collaborations: collaborationRequests.filter(c => c.status !== "contacted").length,
    enrollments: courseEnrollments.filter(e => e.status !== "contacted").length,
    contacts: contactSubmissions.filter(c => c.status === "unread").length,
    subscribers: newsletterSubscribers.length,
    ratings: ratingsList.length,
    videos: youtubeVideos.length,
    services: servicesList.length,
    bookings: bookingsList.filter(b => b.status === "new").length,
    banners: bannersList.length,
  };

  const allCollaboratorCategories = collaboratorCategories;

  return (
    <SidebarProvider>
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleLogout={handleLogout}
        counts={counts}
      />
      <SidebarInset className="bg-slate-50 dark:bg-[#0a0a0a]">
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white/50 dark:bg-black/20 backdrop-blur-sm sticky top-0 z-10">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex-1 flex items-center justify-between">
            <h2 className="text-lg font-semibold capitalize tracking-tight">
              {activeTab.replace("-", " ")}
            </h2>
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-64 rounded-full bg-background pl-9 h-9 border-none shadow-sm ring-1 ring-slate-200 dark:ring-slate-800"
                />
              </div>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              </Button>
              <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                <AvatarImage src="/logo.png" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">

            {/* Collaborators View */}
            {activeTab === "collaborators" && (
              <Card className="border-none shadow-lg bg-white/80 dark:bg-black/40 backdrop-blur-md">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Collaborators Directory</CardTitle>
                    <CardDescription>Manage your network of partners and service providers</CardDescription>
                  </div>
                  <Button onClick={() => {
                    setEditingCollaborator(null);
                    setShowCollaboratorForm(true);
                  }} className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {collaboratorsList.map((collaborator) => (
                      <div key={collaborator.id} className="group relative overflow-hidden rounded-xl border bg-card p-4 transition-all hover:shadow-xl hover:border-primary/50 dark:hover:border-primary/30">
                        <div className="flex items-start gap-4">
                          <div className="h-16 w-16 rounded-lg overflow-hidden bg-muted">
                            <img src={collaborator.imageUrl} alt={collaborator.name} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold truncate">{collaborator.name}</h4>
                            <p className="text-xs text-muted-foreground mb-2">{collaborator.category}</p>
                            <div className="flex items-center gap-2">
                              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => {
                                setEditingCollaborator(collaborator);
                                setCollaboratorForm({ ...collaborator, website: collaborator.website || "" });
                                setShowCollaboratorForm(true);
                              }}>
                                <Edit className="h-3.5 w-3.5" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete("collaborators", collaborator.id, "Collaborator deleted")}>
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Collaborations Requests */}
            {activeTab === "collaborations" && (
              <div className="grid gap-4">
                {collaborationRequests.map((request) => (
                  <Card key={request.id} className={`transition-all hover:shadow-md ${request.status !== "contacted" ? "border-l-4 border-l-primary bg-primary/5" : ""}`}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{request.name}</h3>
                            <span className="text-xs px-2 py-1 rounded-full bg-muted font-medium">{request.serviceName}</span>
                            {request.status !== "contacted" && <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary text-white font-bold uppercase tracking-wider">New</span>}
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {request.email}</div>
                            <div className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {request.phone}</div>
                            <div className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {request.address}</div>
                          </div>
                          {request.message && (
                            <p className="text-sm bg-background/50 p-3 rounded-lg border mt-2 italic">"{request.message}"</p>
                          )}
                          <p className="text-xs text-muted-foreground pt-2">Received: {formatDate(request.timestamp)}</p>
                        </div>
                        <div className="flex gap-2">
                          {request.status !== "contacted" && (
                            <Button size="sm" onClick={() => handleUpdateStatus("partnerSubmissions", request.id, "contacted", "Marked as contacted")}>
                              <CheckCircle className="w-4 h-4 mr-2" /> Mark Contacted
                            </Button>
                          )}
                          <Button size="sm" variant="destructive" onClick={() => handleDelete("partnerSubmissions", request.id, "Request deleted")}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Enrollments View */}
            {activeTab === "enrollments" && (
              <div className="grid gap-4">
                {courseEnrollments.map((enrollment) => (
                  <Card key={enrollment.id} className={`transition-all hover:shadow-md ${enrollment.status !== "contacted" ? "border-l-4 border-l-primary bg-primary/5" : ""}`}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{enrollment.studentName}</h3>
                            <span className="text-xs px-2 py-1 rounded-full bg-muted font-medium flex items-center gap-1">
                              <GraduationCap className="w-3 h-3" /> {enrollment.courseTitle}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {enrollment.email}</div>
                            <div className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {enrollment.phone}</div>
                          </div>
                          <div className="flex gap-2 mt-1">
                            <span className="text-xs border px-2 py-0.5 rounded">{enrollment.courseLevel}</span>
                            <span className="text-xs border px-2 py-0.5 rounded">{enrollment.courseDuration}</span>
                          </div>
                          {enrollment.about && (
                            <div className="mt-3 p-3 bg-muted rounded-lg">
                              <p className="text-xs font-semibold text-muted-foreground mb-1">About Student:</p>
                              <p className="text-sm">{enrollment.about}</p>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {enrollment.status !== "contacted" && (
                            <Button size="sm" onClick={() => handleUpdateStatus("enrollments", enrollment.id, "contacted", "Marked as contacted")}>
                              <CheckCircle className="w-4 h-4 mr-2" /> Mark Contacted
                            </Button>
                          )}
                          <Button size="sm" variant="destructive" onClick={() => handleDelete("enrollments", enrollment.id, "Enrollment deleted")}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Contacts View */}
            {activeTab === "contacts" && (
              <div className="grid gap-4">
                {contactSubmissions.map((contact) => (
                  <Card key={contact.id} className={`transition-all hover:shadow-md ${contact.status === "unread" ? "border-l-4 border-l-primary bg-primary/5" : ""}`}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <h3 className="font-semibold text-lg">{contact.name}</h3>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>{contact.email}</span>
                            {contact.phone && <span>{contact.phone}</span>}
                          </div>
                          <p className="text-sm bg-background/50 p-3 rounded-lg border mt-2">"{contact.message}"</p>
                          <p className="text-xs text-muted-foreground">Received: {formatDate(contact.timestamp)}</p>
                        </div>
                        <div className="flex gap-2">
                          {contact.status === "unread" && (
                            <Button size="sm" onClick={() => handleUpdateStatus("contactSubmissions", contact.id, "read", "Marked as read")}>
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                          <Button size="sm" variant="destructive" onClick={() => handleDelete("contactSubmissions", contact.id, "Message deleted")}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Testimonials View */}
            {activeTab === "testimonials" && (
              <AdminTestimonials />
            )}

            {/* Newsletter View */}
            {activeTab === "newsletter" && (
              <Card>
                <CardHeader>
                  <CardTitle>Newsletter Subscribers</CardTitle>
                  <CardDescription>Total Subscribers: {newsletterSubscribers.length}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="divide-y">
                    {newsletterSubscribers.map((sub) => (
                      <div key={sub.id} className="py-3 flex justify-between items-center">
                        <div>
                          <p className="font-medium">{sub.email}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(sub.timestamp)}</p>
                        </div>
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete("newsletterSubscribers", sub.id, "Subscriber removed")}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Ratings View */}
            {activeTab === "ratings" && (
              <div className="grid gap-4">
                {ratingsList.map((rating) => (
                  <Card key={rating.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{rating.customerName}</h4>
                            <div className="flex text-yellow-500">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${i < rating.rating ? "fill-current" : "text-gray-300"}`} />
                              ))}
                            </div>
                          </div>
                          {rating.comment && <p className="text-sm text-muted-foreground">"{rating.comment}"</p>}
                          <p className="text-xs text-muted-foreground mt-2">Page: {rating.page}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{formatDate(rating.createdAt)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Gallery Videos View */}
            {activeTab === "gallery-videos" && (
              <Card className="animate-scale-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Film className="w-5 h-5" />
                    Gallery YouTube Videos
                    <span className="inline-flex items-center rounded-full border-transparent bg-secondary text-secondary-foreground px-2.5 py-0.5 text-xs font-semibold">
                      {youtubeVideos.length} total
                    </span>
                  </CardTitle>
                  <CardDescription>Add YouTube videos mapped to gallery categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      setIsAddingVideo(true);
                      try {
                        await addDoc(collection(db, 'youtube_videos'), {
                          category: newVideoCategory,
                          url: newVideoUrl,
                          title: newVideoTitle || null,
                          createdAt: serverTimestamp(),
                        });
                        setNewVideoCategory('');
                        setNewVideoUrl('');
                        setNewVideoTitle('');
                        toast.success('Video added');
                      } catch (err) {
                        toast.error('Failed to add video');
                      } finally {
                        setIsAddingVideo(false);
                      }
                    }} className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                      <div>
                        <Label>Category</Label>
                        <select required value={newVideoCategory} onChange={(e) => setNewVideoCategory(e.target.value)} className="w-full px-3 py-2 border rounded">
                          <option value="">Select category</option>
                          {galleryCategories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <Label>YouTube URL</Label>
                        <Input required value={newVideoUrl} onChange={(e) => setNewVideoUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
                      </div>
                      <div>
                        <Label>Title (optional)</Label>
                        <Input value={newVideoTitle} onChange={(e) => setNewVideoTitle(e.target.value)} placeholder="Video title" />
                      </div>
                      <div className="md:col-span-3 text-right">
                        <Button type="submit" disabled={isAddingVideo || !newVideoCategory || !newVideoUrl}>{isAddingVideo ? 'Adding...' : 'Add Video'}</Button>
                      </div>
                    </form>

                    {youtubeVideos.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">No gallery videos added yet</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {youtubeVideos.map((v) => (
                          <Card key={v.id} className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h4 className="font-semibold">{v.title || 'YouTube Video'}</h4>
                                  <span className="text-xs text-muted-foreground">{v.category}</span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2"><a href={v.url} target="_blank" rel="noreferrer" className="underline">Open on YouTube</a></p>
                                <p className="text-xs text-muted-foreground">Added: {formatDate(v.createdAt)}</p>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="destructive" onClick={async () => { try { await deleteDoc(doc(db, 'youtube_videos', v.id)); toast.success('Video deleted'); } catch { toast.error('Failed to delete video'); } }}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Services Management View */}
            {activeTab === "services" && (
              <Card className="border-none shadow-lg bg-white/80 dark:bg-black/40 backdrop-blur-md">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Services Management</CardTitle>
                    <CardDescription>Manage the list of services shown in the booking popup</CardDescription>
                  </div>
                  <Button onClick={() => {
                    setEditingService(null);
                    setServiceForm({
                      name: "", description: "", price: "", imageUrl: "", category: "", duration: ""
                    });
                    setShowServiceForm(true);
                  }} className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Service
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {servicesList.map((service) => (
                      <div key={service.id} className="group relative overflow-hidden rounded-2xl border bg-card/50 backdrop-blur-sm p-4 md:p-5 transition-all hover:shadow-2xl hover:border-primary/50 dark:hover:border-primary/30 animate-scale-in">
                        {/* Admin Action Overlay on Hover */}
                        <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                          <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full shadow-lg" onClick={() => handleEditService(service)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="destructive" className="h-8 w-8 rounded-full shadow-lg" onClick={() => handleDelete("services", service.id, "Service deleted")}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-6">
                          <div className="h-24 w-24 sm:h-20 sm:w-20 rounded-xl overflow-hidden bg-muted flex-shrink-0 shadow-inner">
                            {service.imageUrl ? (
                              <img src={service.imageUrl} alt={service.name} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                            ) : (
                              <div className="h-full w-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                                <Palette className="w-8 h-8 text-primary" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0 text-center sm:text-left">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                              <h4 className="font-bold text-lg truncate group-hover:text-primary transition-colors">{service.name}</h4>
                              {service.category && (
                                <span className="inline-flex self-center sm:self-auto items-center px-2 py-0.5 rounded-full bg-accent/10 text-accent-foreground text-[10px] font-bold uppercase tracking-wider">
                                  {service.category}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2 md:line-clamp-3">{service.description}</p>
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                              {service.price && (
                                <div className="flex items-center gap-1 text-sm font-black text-primary">
                                  ₹{service.price}
                                </div>
                              )}
                              {service.duration && (
                                <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground bg-muted/50 px-2 py-1 rounded-lg">
                                  <Clock className="w-3 h-3" />
                                  {service.duration}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            {/* Service Bookings View */}
            {activeTab === "service-bookings" && (
              <div className="grid gap-4">
                {bookingsList.map((booking) => (
                  <Card key={booking.id} className={`transition-all hover:shadow-md ${booking.status === "new" ? "border-l-4 border-l-primary bg-primary/5 shadow-lg" : ""}`}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
                        <div className="space-y-4 flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="font-black text-xl tracking-tight">{booking.name}</h3>
                            {booking.services ? (
                              <div className="flex flex-wrap gap-2">
                                {booking.services.map((s, i) => (
                                  <span key={i} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                                    {s.name}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                                {booking.serviceName}
                              </span>
                            )}
                            {booking.status === "new" && (
                              <span className="px-3 py-1 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-widest animate-pulse">
                                New Booking
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-1 text-left">
                              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Contact Details</p>
                              <div className="flex flex-col gap-1.5">
                                <a href={`mailto:${booking.email}`} className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                                  <Mail className="w-4 h-4" /> {booking.email}
                                </a>
                                <a href={`tel:${booking.phone}`} className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                                  <Phone className="w-4 h-4" /> {booking.phone}
                                </a>
                              </div>
                            </div>

                            <div className="space-y-1 text-left">
                              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Event Schedule</p>
                              <div className="flex items-center gap-2 text-sm font-bold">
                                <Calendar className="w-4 h-4 text-primary" />
                                {new Date(booking.date).toLocaleDateString('en-IN', { dateStyle: 'long' })}
                              </div>
                            </div>

                            {booking.totalPrice && (
                              <div className="space-y-1 text-left">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Value</p>
                                <p className="text-xl font-black text-primary">₹{booking.totalPrice.toLocaleString()}</p>
                              </div>
                            )}

                            <div className="space-y-1 text-right">
                              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Received On</p>
                              <p className="text-sm font-medium">{formatDate(booking.timestamp)}</p>
                            </div>
                          </div>

                          {booking.message && (
                            <div className="bg-muted/30 p-4 rounded-2xl border border-dashed text-left">
                              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Message / Address</p>
                              <p className="text-sm italic leading-relaxed">"{booking.message}"</p>
                            </div>
                          )}
                        </div>

                        <div className="flex sm:flex-col gap-2 shrink-0">
                          {booking.status === "new" ? (
                            <Button
                              size="sm"
                              className="bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-all font-bold px-6"
                              onClick={() => handleUpdateStatus("bookings", booking.id, "replied", "Booking marked as replied")}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" /> Mark Replied
                            </Button>
                          ) : (
                            <span className="text-[10px] font-black uppercase tracking-widest text-green-500 flex items-center gap-1.5 px-4 py-2 bg-green-500/10 rounded-xl self-end">
                              <CheckCircle className="w-3 h-3" /> Replied
                            </span>
                          )}
                          <Button
                            size="sm"
                            variant="destructive"
                            className="px-6 transition-all"
                            onClick={() => handleDelete("bookings", booking.id, "Booking deleted permanently")}
                          >
                            <Trash2 className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Delete</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {bookingsList.length === 0 && (
                  <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed">
                    <Calendar className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                    <h3 className="text-xl font-bold">No Bookings Yet</h3>
                    <p className="text-sm text-muted-foreground">Active service bookings will appear here.</p>
                  </div>
                )}
              </div>
            )}

            {/* Hero Banner Management View */}
            {activeTab === "hero-banner" && (
              <div className="space-y-6">
                {/* Header Card */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-zinc-900/60 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                      <h2 className="text-xl font-bold tracking-tight">Hero Banner Slides</h2>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      Manage the photos displayed in the homepage hero carousel. Upload new images, reorder slides, or change titles.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    {bannersList.length === 0 && (
                      <Button
                        variant="outline"
                        onClick={handleSeedDefaultBanners}
                        disabled={isSeedingBanners}
                        className="gap-2 border-amber-500/30 hover:bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold"
                      >
                        {isSeedingBanners ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Sparkles className="w-4 h-4 text-amber-500" />
                        )}
                        Seed 5 Curated Photos
                      </Button>
                    )}
                    <Button
                      onClick={handleOpenAddBanner}
                      className="gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold shadow-md hover:shadow-lg transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      Add Banner Photo
                    </Button>
                  </div>
                </div>

                {/* Banner Grid */}
                {bannersList.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bannersList.map((banner, index) => (
                      <Card
                        key={banner.id}
                        className="group overflow-hidden border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 hover:shadow-xl transition-all duration-300 flex flex-col"
                      >
                        {/* Image Preview Container */}
                        <div className="relative aspect-[16/10] bg-zinc-950 overflow-hidden">
                          <img
                            src={banner.url}
                            alt={banner.title || "Banner slide"}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/banner/DSC09578.jpeg";
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                          {/* Order Badge */}
                          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white text-[11px] font-black uppercase tracking-wider">
                            Slide #{banner.order ?? index + 1}
                          </div>

                          {/* Status Badge */}
                          <div className="absolute top-3 right-3">
                            {banner.isActive !== false ? (
                              <span className="px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-[10px] font-black tracking-wider uppercase backdrop-blur-md shadow-sm">
                                Active
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full bg-zinc-700/90 text-zinc-300 text-[10px] font-black tracking-wider uppercase backdrop-blur-md">
                                Hidden
                              </span>
                            )}
                          </div>

                          {/* Location overlay if present */}
                          {banner.location && (
                            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-zinc-200 font-medium">
                              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span className="truncate max-w-[220px]">{banner.location}</span>
                            </div>
                          )}
                        </div>

                        {/* Card Content */}
                        <CardContent className="p-4 flex-1 flex flex-col justify-between gap-3">
                          <div className="space-y-1">
                            <h4 className="font-bold text-base line-clamp-1">
                              {banner.title || `Slide ${banner.order ?? index + 1}`}
                            </h4>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {banner.subtitle || "No subtitle provided"}
                            </p>
                            <p className="text-[10px] text-zinc-400 font-mono truncate pt-1">
                              {banner.url}
                            </p>
                          </div>

                          {/* Action Controls */}
                          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
                            {/* Reorder Buttons */}
                            <div className="flex items-center gap-1">
                              <Button
                                size="icon"
                                variant="outline"
                                className="w-8 h-8 rounded-lg"
                                disabled={index === 0}
                                onClick={() => handleMoveBanner(index, "up")}
                                title="Move Earlier"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                size="icon"
                                variant="outline"
                                className="w-8 h-8 rounded-lg"
                                disabled={index === bannersList.length - 1}
                                onClick={() => handleMoveBanner(index, "down")}
                                title="Move Later"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                size="icon"
                                variant="outline"
                                className={`w-8 h-8 rounded-lg ${
                                  banner.isActive !== false
                                    ? "text-emerald-500 hover:text-emerald-600"
                                    : "text-zinc-400"
                                }`}
                                onClick={() => handleToggleBannerActive(banner)}
                                title={banner.isActive !== false ? "Hide Slide" : "Show Slide"}
                              >
                                {banner.isActive !== false ? (
                                  <Eye className="w-3.5 h-3.5" />
                                ) : (
                                  <EyeOff className="w-3.5 h-3.5" />
                                )}
                              </Button>
                            </div>

                            {/* Edit & Delete Buttons */}
                            <div className="flex items-center gap-1.5">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 px-2.5 rounded-lg text-xs font-semibold"
                                onClick={() => handleOpenEditBanner(banner)}
                              >
                                <Edit className="w-3.5 h-3.5 mr-1" /> Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="h-8 px-2.5 rounded-lg text-xs"
                                onClick={() =>
                                  handleDelete(
                                    "banner_images",
                                    banner.id,
                                    "Banner photo removed successfully"
                                  )
                                }
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center p-8">
                    <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold">No Custom Banner Photos In Firestore</h3>
                    <p className="text-sm text-muted-foreground max-w-md mt-1 mb-6">
                      The homepage is currently displaying the default curated 4K photo showcase. You can add custom photos or populate Firestore with the 5 curated defaults to manage and reorder them.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <Button
                        onClick={handleSeedDefaultBanners}
                        disabled={isSeedingBanners}
                        className="gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold"
                      >
                        {isSeedingBanners ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Sparkles className="w-4 h-4" />
                        )}
                        Load Default 5 Showcase Photos
                      </Button>
                      <Button variant="outline" onClick={handleOpenAddBanner} className="gap-2">
                        <Plus className="w-4 h-4" />
                        Upload Custom Photo
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Collaborator Form Modal */}
          {showCollaboratorForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                <CardHeader>
                  <CardTitle>{editingCollaborator ? "Edit" : "Add"} Collaborator</CardTitle>
                  <CardDescription>
                    {editingCollaborator ? "Update" : "Add"} collaborator information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCollaboratorSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category *</Label>
                        <select
                          id="category"
                          required
                          value={collaboratorForm.category}
                          onChange={(e) => handleCollaboratorFormChange("category", e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg bg-background"
                        >
                          <option value="">Select category</option>
                          {allCollaboratorCategories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          required
                          value={collaboratorForm.name}
                          onChange={(e) => handleCollaboratorFormChange("name", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        required
                        value={collaboratorForm.description}
                        onChange={(e) => handleCollaboratorFormChange("description", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="imageUrl">Image URL *</Label>
                      <Input
                        id="imageUrl"
                        required
                        type="url"
                        value={collaboratorForm.imageUrl}
                        onChange={(e) => handleCollaboratorFormChange("imageUrl", e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="location">Location *</Label>
                        <Input
                          id="location"
                          required
                          value={collaboratorForm.location}
                          onChange={(e) => handleCollaboratorFormChange("location", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Full Address *</Label>
                        <Input
                          id="address"
                          required
                          value={collaboratorForm.address}
                          onChange={(e) => handleCollaboratorFormChange("address", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contactNumber">Contact Number *</Label>
                        <Input
                          id="contactNumber"
                          required
                          type="tel"
                          value={collaboratorForm.contactNumber}
                          onChange={(e) => handleCollaboratorFormChange("contactNumber", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="whatsappNumber">WhatsApp Number *</Label>
                        <Input
                          id="whatsappNumber"
                          required
                          type="tel"
                          value={collaboratorForm.whatsappNumber}
                          onChange={(e) => handleCollaboratorFormChange("whatsappNumber", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          required
                          type="email"
                          value={collaboratorForm.email}
                          onChange={(e) => handleCollaboratorFormChange("email", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Website (Optional)</Label>
                        <Input
                          id="website"
                          type="url"
                          value={collaboratorForm.website}
                          onChange={(e) => handleCollaboratorFormChange("website", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowCollaboratorForm(false);
                          setEditingCollaborator(null);
                          setCollaboratorForm({
                            category: "",
                            name: "",
                            description: "",
                            imageUrl: "",
                            address: "",
                            location: "",
                            whatsappNumber: "",
                            contactNumber: "",
                            email: "",
                            website: ""
                          });
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmittingCollaborator}>
                        {isSubmittingCollaborator ? "Saving..." : editingCollaborator ? "Update Collaborator" : "Add Collaborator"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
          {/* Service Form Modal */}
          {showServiceForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                <CardHeader>
                  <CardTitle>{editingService ? "Edit" : "Add"} Service</CardTitle>
                  <CardDescription>
                    {editingService ? "Update" : "Add"} service information for booking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleServiceSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="service-name">Service Name *</Label>
                      <Input
                        id="service-name"
                        required
                        value={serviceForm.name}
                        onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                        placeholder="e.g. Wedding Photography Pack"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="service-description">Description *</Label>
                      <Textarea
                        id="service-description"
                        required
                        value={serviceForm.description}
                        onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                        placeholder="Describe what's included in this service"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="service-price">Price (in ₹, e.g. 5000)</Label>
                        <Input
                          id="service-price"
                          value={serviceForm.price}
                          onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                          placeholder="5000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="service-duration">Duration (e.g. 4 hours, Full day)</Label>
                        <Input
                          id="service-duration"
                          value={serviceForm.duration}
                          onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="service-imageUrl">Image URL (Optional)</Label>
                      <Input
                        id="service-imageUrl"
                        type="url"
                        value={serviceForm.imageUrl}
                        onChange={(e) => setServiceForm({ ...serviceForm, imageUrl: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="service-category">Category (Optional)</Label>
                      <Input
                        id="service-category"
                        value={serviceForm.category}
                        onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                        placeholder="e.g. Wedding, Event, Portraits"
                      />
                    </div>

                    <div className="flex gap-3 justify-end pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowServiceForm(false);
                          setEditingService(null);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmittingService}>
                        {isSubmittingService ? "Saving..." : editingService ? "Update Service" : "Add Service"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Banner Form Modal */}
          {showBannerForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border-zinc-200 dark:border-zinc-800">
                <CardHeader className="px-0 pt-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold">
                        {editingBanner ? "Edit Banner Photo" : "Add Banner Photo"}
                      </CardTitle>
                      <CardDescription>
                        {editingBanner
                          ? "Update photo details, change image, or adjust display order"
                          : "Upload a high-resolution photo or provide an image link"}
                      </CardDescription>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-full"
                      onClick={() => {
                        setShowBannerForm(false);
                        setEditingBanner(null);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                  <form onSubmit={handleBannerSubmit} className="space-y-4">
                    {/* Live Image Preview */}
                    {bannerForm.url ? (
                      <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-black border border-zinc-200 dark:border-zinc-800">
                        <img
                          src={bannerForm.url}
                          alt="Banner Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/banner/DSC09578.jpeg";
                          }}
                        />
                        <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider">
                          Live Preview
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-[16/9] w-full rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-900/40 p-4">
                        <ImageIcon className="w-10 h-10 text-muted-foreground/40 mb-2" />
                        <span className="text-xs text-muted-foreground font-medium">
                          No photo selected yet
                        </span>
                      </div>
                    )}

                    {/* Image Upload / URL Input */}
                    <div className="space-y-2">
                      <Label htmlFor="banner-file" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Upload Image File
                      </Label>
                      <div className="flex items-center gap-3">
                        <Input
                          id="banner-file"
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          disabled={isUploadingBannerImage}
                          className="file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:cursor-pointer text-xs"
                        />
                        {isUploadingBannerImage && (
                          <div className="flex items-center gap-2 text-xs text-amber-500 font-semibold shrink-0">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>{uploadProgress || 0}%</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="banner-url" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Or Image URL / Local Asset Path *
                      </Label>
                      <Input
                        id="banner-url"
                        required
                        value={bannerForm.url}
                        onChange={(e) => handleBannerFormChange("url", e.target.value)}
                        placeholder="e.g. /banner/DSC09578.jpeg or https://..."
                        className="font-mono text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="banner-title">Title (Optional)</Label>
                        <Input
                          id="banner-title"
                          value={bannerForm.title}
                          onChange={(e) => handleBannerFormChange("title", e.target.value)}
                          placeholder="e.g. Grand Colonnade Elegance"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="banner-location">Location (Optional)</Label>
                        <Input
                          id="banner-location"
                          value={bannerForm.location}
                          onChange={(e) => handleBannerFormChange("location", e.target.value)}
                          placeholder="e.g. Bengaluru Palace"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="banner-subtitle">Subtitle / Story Tagline (Optional)</Label>
                      <Input
                        id="banner-subtitle"
                        value={bannerForm.subtitle}
                        onChange={(e) => handleBannerFormChange("subtitle", e.target.value)}
                        placeholder="e.g. Where Architecture Meets Timeless Romance"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-1">
                      <div className="space-y-2">
                        <Label htmlFor="banner-order">Display Order (Slide #)</Label>
                        <Input
                          id="banner-order"
                          type="number"
                          min="1"
                          value={bannerForm.order}
                          onChange={(e) => handleBannerFormChange("order", parseInt(e.target.value) || 1)}
                        />
                      </div>
                      <div className="space-y-2 flex flex-col justify-end">
                        <Label className="cursor-pointer flex items-center gap-2 pb-2">
                          <input
                            type="checkbox"
                            checked={bannerForm.isActive}
                            onChange={(e) => handleBannerFormChange("isActive", e.target.checked)}
                            className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
                          />
                          <span className="text-sm font-semibold">Active (Visible on homepage)</span>
                        </Label>
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-4 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowBannerForm(false);
                          setEditingBanner(null);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmittingBanner || isUploadingBannerImage}
                        className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold"
                      >
                        {isSubmittingBanner ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Saving...</span>
                          </div>
                        ) : editingBanner ? (
                          "Update Banner Photo"
                        ) : (
                          "Add Banner Photo"
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminDashboard;