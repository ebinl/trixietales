import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useNavigate } from "react-router-dom";
import { Camera, Video, BookImage, Palette, Lightbulb, Clapperboard, X, CheckCircle, Clock, Award, BookOpen, User, Mail, Phone, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ScrollRevealHeading,
  ScrollRevealSubtitle,
  ScrollRevealBadge,
} from "@/components/ui/ScrollTextReveal";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZCNRSPlDFTzK_HNBKxRYQkX7XJIzSSW4",
  authDomain: "mark-studio-4b30a.firebaseapp.com",
  projectId: "mark-studio-4b30a",
  storageBucket: "mark-studio-4b30a.firebasestorage.app",
  messagingSenderId: "717134874279",
  appId: "1:717134874279:web:e2d5ac9923c79ae21e3d82",
  measurementId: "G-NNNZWPJ6X1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const courses = [
  {
    icon: Camera,
    title: "Professional Photography",
    duration: "3 Months",
    level: "Beginner to Advanced",
    description: "Master the art of photography from basics to advanced techniques. Learn composition, lighting, and post-processing.",
    features: ["Camera fundamentals", "Lighting techniques", "Composition rules", "Photo editing"],
    detailedInfo: {
      overview: "This course is designed to equip students with the skills and knowledge needed to become proficient photographers. You'll learn the fundamentals of photography, including technical skills, creative techniques, and industry-standard practices.",
      topics: [
        { title: "Camera Fundamentals", desc: "Understanding camera settings, modes, and features." },
        { title: "Composition and Visual Storytelling", desc: "Learning principles of composition, framing, and visual storytelling." },
        { title: "Lighting and Exposure", desc: "Understanding natural and artificial lighting, exposure compensation, and metering modes." },
        { title: "Genre-Specific Photography", desc: "Exploring portrait, landscape, street, wildlife, and other photography genres." },
        { title: "Post-Processing and Editing", desc: "Mastering image editing software like Adobe Lightroom and Photoshop." }
      ],
      structure: [
        "Introduction to Photography: Understanding camera basics and photography fundamentals.",
        "Technical Skills: Learning about aperture, shutter speed, ISO, and other technical aspects.",
        "Creative Techniques: Exploring composition, lighting, and visual storytelling.",
        "Genre-Specific Photography: Focusing on specific photography genres.",
        "Post-Processing and Editing: Learning image editing techniques."
      ],
      benefits: [
        "Understanding camera settings and technical skills.",
        "Creating visually appealing and well-composed photographs.",
        "Working with different lighting conditions and genres.",
        "Editing and enhancing images using industry-standard software.",
        "Building a portfolio and developing a personal style."
      ],
      careers: [
        "Professional Photographer: Work in various photography genres, including portrait, wedding, commercial, and fine art.",
        "Photojournalist: Capture news and documentary-style photographs for publications and media outlets.",
        "Freelance Photographer: Offer photography services to clients, including events, portraits, and product photography.",
        "Photography Educator: Teach photography courses, workshops, or online tutorials."
      ]
    }
  },
  {
    icon: Video,
    title: "Videography Masterclass",
    duration: "10 weeks",
    level: "Intermediate",
    description: "Learn to create stunning videos with professional techniques, from shooting to editing and color grading.",
    features: ["Video production", "Cinematic techniques", "Editing workflow", "Color grading"],
    detailedInfo: {
      overview: "A cinematography course is designed to equip students with the skills and knowledge needed to become proficient cinematographers. The course covers various aspects of cinematography, including camera operations, lighting techniques, visual storytelling, and digital filmmaking software.",
      topics: [
        { title: "Camera Operations", desc: "Operating different types of cameras, lenses, and accessories" },
        { title: "Lighting Techniques", desc: "Designing and executing effective lighting setups for various cinematic styles" },
        { title: "Visual Storytelling", desc: "Using visual techniques to convey narrative and emotion" },
        { title: "Cinematography Styles", desc: "Understanding and applying different cinematic styles" },
        { title: "Digital Post-Production", desc: "Editing and color grading footage using industry-standard software" }
      ],
      structure: [
        "Practical Projects: Completing practical projects, such as wedding documentaries, music videos, or commercials",
        "Theoretical Foundations: Understanding film history, theory, and criticism",
        "Hands-on Training: Mastering camera equipment, lighting techniques, and digital filmmaking software"
      ],
      benefits: [
        "Master professional camera operations and techniques.",
        "Create cinematic content with proper lighting and composition.",
        "Understand visual storytelling principles.",
        "Work with industry-standard equipment and software."
      ],
      careers: [
        "Cinematographer: Working on film and television productions",
        "Director of Photography: Overseeing camera and lighting departments",
        "Videographer: Creating video content for various platforms",
        "Film Editor: Editing footage for film and television productions"
      ]
    }
  },
  {
    icon: BookImage,
    title: "Album Design",
    duration: "3 Months",
    level: "All Levels",
    description: "Create beautiful photo albums and coffee table books. Learn design principles and storytelling through imagery.",
    features: ["Layout design", "Photo selection", "Print preparation", "Binding techniques"],
    detailedInfo: {
      overview: "This course equips aspiring designers, photographers, and enthusiasts with the knowledge and skills needed to create visually appealing album designs. You'll learn the fundamentals of album design, photo editing, and layout strategies to craft cohesive and memorable albums.",
      topics: [
        { title: "Album Design Fundamentals", desc: "Understanding the importance of album design, different types of photo albums, and their uses" },
        { title: "Photo Editing", desc: "Basics of image editing software like Adobe Photoshop and Lightroom, including exposure, contrast, and color correction" },
        { title: "Layout and Composition", desc: "Principles of layout design, creating master pages, and templates" },
        { title: "Typography and Text Elements", desc: "Selecting fonts, adding titles, captions, and descriptions" },
        { title: "Color Management", desc: "Understanding color spaces, profiles, and achieving accurate color reproduction" },
        { title: "Printing and Production", desc: "Exploring printing options, paper types, and managing print orders" }
      ],
      structure: [
        "Introduction to Album Design: Understanding the role of a wedding album designer and researching popular designs",
        "Image Selection and Organization: Sorting, organizing, and selecting images for storytelling",
        "Designing Album Layouts: Creating cohesive layouts, mixing and matching styles",
        "Finalizing and Exporting: Reviewing, refining, and exporting designs for print or digital publishing"
      ],
      benefits: [
        "Creating visually stunning album designs",
        "Using industry-standard software like Adobe Photoshop, Lightroom, and InDesign",
        "Understanding print specifications and producing high-quality album designs",
        "Enhancing your creative portfolio and marketability as a Graphic designer"
      ],
      careers: [
        "Album Designer: Create wedding and event albums for photographers and clients",
        "Graphic Designer: Work in design studios specializing in print media",
        "Freelance Designer: Offer album design services independently",
        "Photography Studio Manager: Oversee album production and client deliverables"
      ]
    }
  },
  {
    icon: Palette,
    title: "Photo Editing & Retouching",
    duration: "6 Months",
    level: "Beginner",
    description: "Master Adobe Lightroom and Photoshop for stunning photo enhancements and creative edits.",
    features: ["Lightroom basics", "Photoshop tools", "Color correction", "Portrait retouching"],
    detailedInfo: {
      overview: "This course is designed to equip students with the skills and knowledge needed to become proficient video editors. You'll learn the fundamentals of video editing, storytelling techniques, and industry-standard software.",
      topics: [
        { title: "Video Editing Fundamentals", desc: "Understanding the basics of video editing, including cutting, trimming, and arranging footage." },
        { title: "Storytelling Techniques", desc: "Learning how to tell compelling stories through video, including pacing, tone, and narrative structure." },
        { title: "Software Training", desc: "Mastering industry-standard video editing software such as Adobe Premiere Pro, Final Cut Pro, or Avid Media Composer." },
        { title: "Color Grading and Correction", desc: "Understanding how to enhance the visual aesthetic of your videos through color grading and correction." },
        { title: "Sound Design and Audio Editing", desc: "Learning how to work with audio, including sound effects, music, and voiceovers." },
        { title: "Visual Effects and Motion Graphics", desc: "Understanding how to add visual effects and motion graphics to enhance your videos." }
      ],
      structure: [
        "Introduction to Video Editing: Understanding the basics of video editing software and workflow.",
        "Editing Techniques: Learning various editing techniques, including cutting, trimming, and arranging footage.",
        "Color Grading and Correction: Understanding how to enhance the visual aesthetic of your videos.",
        "Sound Design and Audio Editing: Learning how to work with audio.",
        "Visual Effects and Motion Graphics: Understanding how to add visual effects and motion graphics."
      ],
      benefits: [
        "Creating polished and engaging video content.",
        "Using industry-standard video editing software.",
        "Understanding storytelling techniques and narrative structure.",
        "Enhancing the visual aesthetic of your videos through color grading and correction.",
        "Working with audio and visual effects."
      ],
      careers: [
        "Video Editor: Work on various video projects, including films, television shows, commercials, and corporate videos.",
        "Post-Production Specialist: Work in post-production houses, studios, or production companies.",
        "Content Creator: Create engaging video content for social media, YouTube, or other platforms."
      ]
    }
  },
  {
    icon: Lightbulb,
    title: "Creative Lighting",
    duration: "4 weeks",
    level: "Intermediate",
    description: "Explore studio and natural lighting techniques to elevate your photography and videography.",
    features: ["Studio setup", "Natural light", "Flash photography", "Light modifiers"],
    detailedInfo: {
      overview: "Master the art of lighting for both photography and videography. This course covers everything from basic lighting principles to advanced studio setups.",
      topics: [
        { title: "Lighting Fundamentals", desc: "Understanding the properties of light, color temperature, and quality of light." },
        { title: "Studio Lighting", desc: "Setting up and using studio lights, modifiers, and accessories." },
        { title: "Natural Light Mastery", desc: "Working with available light and reflectors for stunning results." },
        { title: "Flash Photography", desc: "On-camera and off-camera flash techniques for various scenarios." }
      ],
      structure: [
        "Introduction to Light: Understanding light properties and behavior",
        "Studio Setup: Building and configuring professional lighting setups",
        "Practical Applications: Hands-on projects with different lighting scenarios",
        "Advanced Techniques: Creative lighting for dramatic effects"
      ],
      benefits: [
        "Master professional lighting techniques",
        "Create mood and atmosphere in your work",
        "Work confidently in any lighting condition",
        "Elevate the quality of your photography and video"
      ],
      careers: [
        "Lighting Specialist: Work on film and photo productions",
        "Gaffer: Lead lighting departments in video productions",
        "Studio Photographer: Run your own photography studio",
        "Cinematographer: Apply lighting skills to film projects"
      ]
    }
  },
  {
    icon: Clapperboard,
    title: "Wedding Photography & Video",
    duration: "12 weeks",
    level: "Advanced",
    description: "Specialized course for capturing weddings. Learn to manage events, work with couples, and deliver exceptional results.",
    features: ["Event management", "Couple posing", "Candid shots", "Same-day edits"],
    detailedInfo: {
      overview: "A comprehensive course designed for photographers and videographers who want to specialize in wedding coverage. Learn the business, technical, and interpersonal skills needed to succeed.",
      topics: [
        { title: "Wedding Photography Essentials", desc: "Understanding wedding day timeline, key moments, and shot lists." },
        { title: "Couple and Group Posing", desc: "Directing poses for couples, families, and bridal parties." },
        { title: "Candid Photography", desc: "Capturing authentic emotions and storytelling moments." },
        { title: "Event Management", desc: "Coordinating with vendors, managing time, and handling pressure." },
        { title: "Video Coverage", desc: "Filming ceremonies, speeches, and creating highlight reels." }
      ],
      structure: [
        "Pre-Wedding: Client consultations, planning, and preparation",
        "Wedding Day: Coverage techniques, equipment management, and backup strategies",
        "Post-Production: Editing workflow, album design, and delivery",
        "Business Skills: Marketing, pricing, and client relations"
      ],
      benefits: [
        "Build a profitable wedding photography business",
        "Deliver exceptional results under pressure",
        "Create stunning wedding albums and videos",
        "Establish long-term client relationships"
      ],
      careers: [
        "Wedding Photographer: Specialize in wedding coverage",
        "Event Videographer: Create wedding films and highlight reels",
        "Studio Owner: Run a wedding photography business",
        "Destination Wedding Photographer: Travel and capture weddings worldwide"
      ]
    }
  },
];

const ArrowRight = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const Courses = () => {
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [showEnrollForm, setShowEnrollForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    about: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const navigate = useNavigate();

  const handleEnrollClick = () => {
    setShowEnrollForm(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "enrollments"), {
        studentName: formData.name,
        email: formData.email,
        phone: formData.phone,
        about: formData.about,
        courseTitle: selectedCourse.title,
        courseDuration: selectedCourse.duration,
        courseLevel: selectedCourse.level,
        enrollmentDate: new Date().toISOString(),
        timestamp: new Date()
      });

      setSubmitSuccess(true);
      setTimeout(() => {
        setShowEnrollForm(false);
        setSelectedCourse(null);
        setFormData({ name: "", email: "", phone: "", about: "" });
        setSubmitSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error submitting enrollment:", error);
      alert("Failed to submit enrollment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section id="courses" className="py-24 relative overflow-hidden">
        {/* Photography-themed background (flipped upside down) */}
        <div className="absolute inset-0 -z-10 rotate-180 transform">
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
        </div>

        <div className="container mx-auto px-4">
          <div className="text-center mb-16 flex flex-col items-center">
            <ScrollRevealBadge className="mb-4">
              <Badge className="px-5 py-2 text-sm font-semibold tracking-wider uppercase border border-[#e6b76c]/40 bg-[#e6b76c]/10 text-[#e6b76c] shadow-[0_0_20px_rgba(230,183,108,0.2)]">
                Mastery & Mentorship
              </Badge>
            </ScrollRevealBadge>
            <ScrollRevealHeading
              text="Learn with the Best • Trixietales Academy"
              highlightWords={["Best", "Trixietales"]}
              className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"
            />
            <ScrollRevealSubtitle className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Master the craft of cinematography, natural lighting, and royal wedding storytelling taught directly by Markhandeya.
            </ScrollRevealSubtitle>
          </div>

          <div className="relative">
            <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {courses.map((course, index) => (
                  <CarouselItem key={index} className="pl-2 md:pl-4 basis-3/4 md:basis-1/2 lg:basis-1/3">
                    <Card
                      className="course-card group border-0 shadow-xl bg-card overflow-hidden flex flex-col h-full relative"
                      style={{
                        animationDelay: `${index * 0.1}s`,
                        animation: 'fadeInUp 0.6s ease-out forwards',
                        opacity: 0
                      }}
                    >
                      <div className="shimmer-overlay" />
                      <div className="gradient-border" />
                      <CardContent className="p-0 flex flex-col h-full relative z-10">
                        <div className="p-6 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700 ease-out" />
                          <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/10 rounded-full translate-y-1/2 -translate-x-1/2 group-hover:scale-150 transition-transform duration-700 ease-out" />

                          <div className="relative">
                            <div className="mb-4 inline-flex p-4 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary group-hover:from-primary group-hover:to-accent group-hover:text-primary-foreground transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg">
                              <course.icon className="w-8 h-8 transition-transform duration-500 group-hover:scale-110" />
                            </div>

                            <div className="flex gap-2 mb-3 flex-wrap">
                              <Badge variant="secondary" className="backdrop-blur-sm bg-background/60 group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-105">
                                <Clock className="w-3 h-3 mr-1" />
                                {course.duration}
                              </Badge>
                              <Badge variant="outline" className="backdrop-blur-sm group-hover:border-primary/50 transition-all duration-300 group-hover:scale-105">
                                <Award className="w-3 h-3 mr-1" />
                                {course.level}
                              </Badge>
                            </div>

                            <h3 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-primary transition-all duration-300 group-hover:translate-x-1">
                              {course.title}
                            </h3>
                          </div>
                        </div>

                        <div className="p-6 flex flex-col flex-grow bg-gradient-to-b from-transparent to-primary/5 group-hover:to-primary/10 transition-all duration-500">
                          <p className="text-[13px] md:text-base text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                            {course.description}
                          </p>

                          <ul className="space-y-2 mb-6 flex-grow">
                            {course.features.map((feature, idx) => (
                              <li
                                key={idx}
                                className="flex items-center gap-3 text-sm group/item hover:translate-x-2 transition-transform duration-300"
                              >
                                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gradient-to-r from-primary to-accent flex-shrink-0 group-hover/item:scale-150 transition-transform duration-300" />
                                <span className="group-hover/item:text-foreground transition-colors duration-300 text-[11px] md:text-sm">
                                  {feature}
                                </span>
                              </li>
                            ))}
                          </ul>

                          <button
                            className="gradient-btn w-full group/btn relative overflow-hidden transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                            onClick={() => setSelectedCourse(course)}
                          >
                            <span className="relative z-10 flex items-center justify-center font-semibold text-black">
                              Read More
                              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-2 duration-300" />
                            </span>
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-6 md:-left-10 hover:scale-110 transition-transform duration-300" />
              <CarouselNext className="-right-6 md:-right-10 hover:scale-110 transition-transform duration-300" />
            </Carousel>
          </div>
        </div>

        <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes shimmer {
            0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
            100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
          }
          @keyframes gradientRotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .course-card { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); border-radius: 1rem; position: relative; }
          .course-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15); }
          .shimmer-overlay { position: absolute; inset: 0; background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%); transform: translateX(-100%) translateY(-100%) rotate(45deg); pointer-events: none; z-index: 20; }
          .course-card:hover .shimmer-overlay { animation: shimmer 1.5s ease-in-out; }
          .gradient-border { position: absolute; inset: -2px; border-radius: 1rem; padding: 2px; background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 50%, hsl(var(--primary)) 100%); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; opacity: 0; transition: opacity 0.4s ease; pointer-events: none; z-index: 0; }
          .course-card:hover .gradient-border { opacity: 0.6; animation: gradientRotate 3s linear infinite; }
          .gradient-btn { position: relative; padding: 0.875rem 1.75rem; border-radius: 0.75rem; font-weight: 600; background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%); border: none; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }
          .gradient-btn-secondary { position: relative; padding: 0.875rem 1.75rem; border-radius: 0.75rem; font-weight: 600; color: hsl(var(--foreground)); background: transparent; border: 2px solid transparent; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
          .gradient-btn-secondary::before { content: ''; position: absolute; inset: -2px; border-radius: 0.75rem; padding: 2px; background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent))); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; z-index: -1; }
          .gradient-btn-secondary:hover { background: linear-gradient(135deg, hsl(var(--primary))/0.1 0%, hsl(var(--accent))/0.1 100%); transform: translateY(-2px); }
          .pulse-btn { position: relative; padding: 0.875rem 1.75rem; border-radius: 0.75rem; font-weight: 600; color: white; background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%); border: none; cursor: pointer; animation: pulse 2s ease-in-out infinite; }
          @keyframes pulse { 0%, 100% { box-shadow: 0 0 0 0 hsla(var(--primary), 0.7); } 50% { box-shadow: 0 0 0 15px hsla(var(--primary), 0); } }
        `}</style>
      </section>

      {/* Course Details Modal */}
      {selectedCourse && !showEnrollForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in pointer-events-auto" data-lenis-prevent>
          <div className="bg-background rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-scale-in border border-border">
            <div className="sticky top-0 bg-background/95 backdrop-blur-md border-b border-border p-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                  <selectedCourse.icon className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{selectedCourse.title}</h2>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary" className="bg-muted text-muted-foreground border-0">
                      <Clock className="w-3 h-3 mr-1" />
                      {selectedCourse.duration}
                    </Badge>
                    <Badge variant="secondary" className="bg-muted text-muted-foreground border-0">
                      <Award className="w-3 h-3 mr-1" />
                      {selectedCourse.level}
                    </Badge>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedCourse(null)}
                className="rounded-full hover:bg-muted"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            <div
              className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 overscroll-contain"
              data-lenis-prevent
              style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}
            >
              <div className="space-y-4">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-primary" />
                  Course Overview
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {selectedCourse.detailedInfo.overview}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-primary" />
                  Key Topics Covered
                </h3>
                <div className="space-y-4">
                  {selectedCourse.detailedInfo.topics.map((topic: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                      <h4 className="font-semibold mb-1">{topic.title}</h4>
                      <p className="text-sm text-muted-foreground">{topic.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Course Structure</h3>
                <ul className="space-y-3">
                  {selectedCourse.detailedInfo.structure.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">{idx + 1}</span>
                      </div>
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Benefits</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {selectedCourse.detailedInfo.benefits.map((benefit: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Career Opportunities</h3>
                <div className="space-y-3">
                  {selectedCourse.detailedInfo.careers.map((career: string, idx: number) => (
                    <div key={idx} className="p-4 rounded-lg border border-primary/20 hover:border-primary/40 transition-colors">
                      <p className="text-muted-foreground">{career}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-background border-t p-6 flex gap-4">
              <button
                className="gradient-btn-secondary flex-1"
                onClick={() => setSelectedCourse(null)}
              >
                Close
              </button>
              <button
                className="pulse-btn flex-1"
                onClick={handleEnrollClick}
              >
                Enroll Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enrollment Form Modal */}
      {selectedCourse && showEnrollForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in pointer-events-auto" data-lenis-prevent>
          <div className="bg-background rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-scale-in border border-border">
            <div className="bg-gradient-to-r from-primary to-accent p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <selectedCourse.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Enroll in Course</h2>
                  <p className="text-white/80 text-sm mt-1">{selectedCourse.title}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowEnrollForm(false);
                  setFormData({ name: "", email: "", phone: "", about: "" });
                }}
                className="text-white hover:bg-white/20"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            <div
              className="flex-1 overflow-y-auto min-h-0 overscroll-contain"
              data-lenis-prevent
              style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}
            >
              {submitSuccess ? (
                <div className="p-8 text-center text-black dark:text-white">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Enrollment Successful!</h3>
                  <p className="text-muted-foreground">
                    Thank you for enrolling. We'll contact you soon with more details.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitEnrollment} className="p-8 space-y-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <User className="w-4 h-4 text-primary" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <Mail className="w-4 h-4 text-primary" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <Phone className="w-4 h-4 text-primary" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="+91 1234567890"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <MessageSquare className="w-4 h-4 text-primary" />
                      About You
                    </label>
                    <textarea
                      name="about"
                      value={formData.about}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      placeholder="Tell us about your background and why you're interested in this course..."
                    />
                  </div>

                  <div className="bg-primary/5 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Course:</strong> {selectedCourse.title}<br />
                      <strong>Duration:</strong> {selectedCourse.duration}<br />
                      <strong>Level:</strong> {selectedCourse.level}
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      className="gradient-btn-secondary flex-1"
                      onClick={() => {
                        setShowEnrollForm(false);
                        setFormData({ name: "", email: "", phone: "", about: "" });
                      }}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="gradient-btn flex-1"
                      disabled={isSubmitting}
                    >
                      <span className="relative z-10 text-black">
                        {isSubmitting ? "Submitting..." : "Submit Enrollment"}
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Courses;