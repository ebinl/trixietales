import { useRef, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Github, Linkedin, Twitter, Instagram } from "lucide-react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import {
    ScrollRevealHeading,
    ScrollRevealSubtitle,
    ScrollRevealBadge,
} from "@/components/ui/ScrollTextReveal";

// Studio Glow Team Data - Optimized with local images
const teamMembers = [
    {
        name: "Surya",
        role: "Senior Photographer",
        experience: "10+ Years Experience",
        image: "/images/Team Photos WebP/Team Photos_Surya.webp",
        bio: "Dedicated to capturing every smile and sunset with creative brilliance and expert technique.",
        social: {
            instagram: "#",
            twitter: "#",
            linkedin: "#"
        }
    },
    {
        name: "Abhilash",
        role: "Cinematographer",
        experience: "8+ Years Experience",
        image: "/images/Team Photos WebP/Team Photos_Abhilash.webp",
        bio: "Master of visual motion, turning every frame into a cinematic masterpiece that tells your story.",
        social: {
            instagram: "#",
            linkedin: "#"
        }
    },
    {
        name: "Ranjith",
        role: "Candid Photographer",
        experience: "10+ Years Experience",
        image: "/images/Team Photos WebP/Team Photos_Ranjith.webp",
        bio: "Specialist in documenting natural, unposed moments that capture the true essence of your emotions.",
        social: {
            instagram: "#",
            twitter: "#"
        }
    },
    {
        name: "Praveen",
        role: "Senior Photographer",
        experience: "5+ Years Experience",
        image: "/images/Team Photos WebP/Team Photos_Praveen.webp",
        bio: "Expert in high-end photography, blending timeless style with modern precision for stunning visuals.",
        social: {
            instagram: "#",
            linkedin: "#"
        }
    },
    {
        name: "Manoj",
        role: "Chief Editor",
        experience: "11+ Years Experience",
        image: "/images/Team Photos WebP/Team Photos_Manoj.webp",
        bio: "Crafting the final vision with expert editing skills, ensuring every detail glows with perfection.",
        social: {
            instagram: "#",
            twitter: "#"
        }
    },
    {
        name: "Kiran",
        role: "Cinematographer",
        experience: "6+ Years Experience",
        image: "/images/Team Photos WebP/Team Photos_Kiran.webp",
        bio: "Passionate about visual storytelling through the lens of a high-end cinematic experience.",
        social: {
            instagram: "#",
            linkedin: "#"
        }
    },
    {
        name: "Gowtham",
        role: "Video Editor",
        experience: "5+ Years Experience",
        image: "/images/Team Photos WebP/Team Photos_Gowtham.webp",
        bio: "Transforming raw footage into compelling stories with a sharp eye for rhythm and detail.",
        social: {
            instagram: "#",
            twitter: "#"
        }
    },
    {
        name: "Mukul",
        role: "Creative Head",
        experience: "12+ Years Experience",
        image: "/images/Team Photos WebP/Team Photos_Mukul.webp",
        bio: "Leading our creative vision with innovative ideas that push the boundaries of visual excellence.",
        social: {
            instagram: "#",
            linkedin: "#"
        }
    },
    {
        name: "Bhavani",
        role: "Post Production Manager",
        experience: "10+ Years Experience",
        image: "/images/Team Photos WebP/Team Photos_Bhavani.webp",
        bio: "Managing the flow of perfection from lens to screen, ensuring every project exceeds expectations.",
        social: {
            instagram: "#",
            linkedin: "#"
        }
    }
];

const OurTeam = () => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);
    const plugin = useRef(
        Autoplay({ delay: 4000, stopOnInteraction: true })
    );

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

    return (
        <section ref={ref} className="py-24 relative overflow-hidden bg-black/5">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center mb-16">
                    <ScrollRevealBadge className="mb-4">Our Creative Collective</ScrollRevealBadge>
                    <ScrollRevealHeading
                        text="The Masterminds Behind Every Golden Frame"
                        highlightWords={["Golden", "Frame"]}
                        as="h2"
                        className="text-4xl md:text-5xl font-black font-serif tracking-tight text-white mb-4 leading-tight"
                    />
                    <ScrollRevealSubtitle className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto font-light">
                        The visionary cinematographers, photographers, and editors sculpting your memories into eternal art
                    </ScrollRevealSubtitle>
                </div>

                <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <Carousel
                        plugins={[plugin.current]}
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                        className="w-full"
                        onMouseEnter={plugin.current.stop}
                        onMouseLeave={plugin.current.reset}
                    >
                        <CarouselContent className="-ml-4">
                            {teamMembers.map((member, index) => (
                                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/4">
                                    <div className="h-full">
                                        <Card className="border-0 overflow-hidden bg-white/50 dark:bg-black/40 backdrop-blur-sm hover:shadow-xl transition-all duration-300 h-full group my-[5px] pb-[5px]">
                                            <CardContent className="p-0 h-full flex flex-col">
                                                <div className="relative overflow-hidden aspect-square shrink-0">
                                                    <img
                                                        src={member.image}
                                                        alt={member.name}
                                                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                                                        loading="lazy"
                                                        decoding="async"
                                                    />

                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                                                        <div className="flex flex-col items-center gap-3">
                                                            {/* Experience Badge */}
                                                            <Badge variant="secondary" className="bg-white/20 text-white backdrop-blur-md border-0 text-[10px] py-1 px-3">
                                                                {member.experience}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-6 text-center relative flex-grow flex flex-col items-center">
                                                    <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                                                    <p className="text-primary font-medium text-sm mb-3">{member.role}</p>
                                                    <p className="text-muted-foreground text-sm line-clamp-3">
                                                        {member.bio}
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="flex -left-4 md:-left-12" />
                        <CarouselNext className="flex -right-4 md:-right-12" />
                    </Carousel>
                </div>
            </div>
        </section>
    );
};

export default OurTeam;
