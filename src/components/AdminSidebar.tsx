import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";
import {
    Users,
    Building2,
    GraduationCap,
    Inbox,
    Mail,
    Star,
    Film,
    MessageSquare,
    LogOut,
    LayoutDashboard,
    Settings,
    Palette,
    Calendar,
    Image as ImageIcon,
} from "lucide-react";

export function AdminSidebar({
    activeTab,
    setActiveTab,
    handleLogout,
    counts,
}: {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    handleLogout: () => void;
    counts: {
        collaborators: number;
        collaborations: number;
        enrollments: number;
        contacts: number;
        subscribers: number;
        ratings: number;
        videos: number;
        services: number;
        bookings: number;
        banners?: number;
    };
}) {
    const menuItems = [
        {
            title: "Dashboard",
            items: [
                {
                    title: "Collaborators",
                    icon: Users,
                    id: "collaborators",
                    count: counts.collaborators,
                },
                {
                    title: "Enrollments",
                    icon: GraduationCap,
                    id: "enrollments",
                    count: counts.enrollments,
                    alert: counts.enrollments > 0,
                },
                {
                    title: "Service Bookings",
                    icon: Calendar,
                    id: "service-bookings",
                    count: counts.bookings,
                    alert: counts.bookings > 0,
                },
            ],
        },
        {
            title: "Communication",
            items: [
                {
                    title: "Collaborations",
                    icon: Building2,
                    id: "collaborations",
                    count: counts.collaborations,
                    alert: counts.collaborations > 0,
                },
                {
                    title: "Contacts",
                    icon: Inbox,
                    id: "contacts",
                    count: counts.contacts,
                    alert: counts.contacts > 0,
                },
                {
                    title: "Newsletter",
                    icon: Mail,
                    id: "newsletter",
                    count: counts.subscribers,
                },
            ],
        },
        {
            title: "Content",
            items: [
                {
                    title: "Hero Banner",
                    icon: ImageIcon,
                    id: "hero-banner",
                    count: counts.banners,
                },
                {
                    title: "Ratings",
                    icon: Star,
                    id: "ratings",
                    count: counts.ratings,
                },
                {
                    title: "Gallery Videos",
                    icon: Film,
                    id: "gallery-videos",
                    count: counts.videos,
                },
                {
                    title: "Testimonials",
                    icon: MessageSquare,
                    id: "testimonials",
                },
                {
                    title: "Manage Services",
                    icon: Palette,
                    id: "services",
                    count: counts.services,
                },
            ],
        },
    ];

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="p-4 border-b border-sidebar-border/50">
                <div className="flex items-center gap-2 px-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 shadow-lg">
                        <LayoutDashboard className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                        <span className="font-bold text-sm tracking-wide">Trixietales</span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Admin Panel</span>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent className="p-2">
                {menuItems.map((group) => (
                    <SidebarGroup key={group.title}>
                        <SidebarGroupLabel className="text-xs font-medium text-muted-foreground/70 px-2 py-2 uppercase tracking-wider">
                            {group.title}
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map((item) => (
                                    <SidebarMenuItem key={item.id}>
                                        <SidebarMenuButton
                                            isActive={activeTab === item.id}
                                            onClick={() => setActiveTab(item.id)}
                                            tooltip={item.title}
                                            className="transition-all duration-200 hover:translate-x-1"
                                        >
                                            <item.icon className={`w-4 h-4 ${activeTab === item.id ? "text-primary" : "text-muted-foreground"}`} />
                                            <span>{item.title}</span>
                                            {item.count !== undefined && (
                                                <span className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full ${item.alert
                                                    ? "bg-destructive text-destructive-foreground animate-pulse"
                                                    : "bg-sidebar-accent text-sidebar-accent-foreground"
                                                    }`}>
                                                    {item.count}
                                                </span>
                                            )}
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            <SidebarFooter className="p-4 border-t border-sidebar-border/50">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={handleLogout} tooltip="Logout" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
