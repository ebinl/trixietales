import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, Pencil, Trash2, X, MessageSquareQuote, Video } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

interface Testimonial {
    id: string;
    clientName: string;
    category: string;
    rating: number;
    description: string;
    youtubeLink: string;
    createdAt: any;
}

const AdminTestimonials = () => {
    const [clientName, setClientName] = useState("");
    const [category, setCategory] = useState("");
    const [rating, setRating] = useState(0);
    const [description, setDescription] = useState("");
    const [youtubeLink, setYoutubeLink] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        const q = query(collection(db, "testimonials"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data: Testimonial[] = [];
            snapshot.forEach((doc) => {
                data.push({ id: doc.id, ...doc.data() } as Testimonial);
            });
            setTestimonials(data);
        });
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!clientName || !category || rating < 1) {
            toast.error("Please fill in all required fields and select a rating.");
            return;
        }
        setIsSubmitting(true);
        try {
            const data = {
                clientName,
                category,
                rating,
                description,
                youtubeLink,
                updatedAt: new Date().toISOString(),
            };

            if (editingId) {
                await updateDoc(doc(db, "testimonials", editingId), data);
                toast.success("Testimonial updated successfully");
                setEditingId(null);
            } else {
                await addDoc(collection(db, "testimonials"), {
                    ...data,
                    createdAt: new Date().toISOString(),
                });
                toast.success("Testimonial added successfully");
            }
            resetForm();
        } catch (error) {
            console.error("Error saving testimonial:", error);
            toast.error("Failed to save testimonial");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (t: Testimonial) => {
        setEditingId(t.id);
        setClientName(t.clientName);
        setCategory(t.category);
        setRating(t.rating);
        setDescription(t.description);
        setYoutubeLink(t.youtubeLink || "");
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteDoc(doc(db, "testimonials", id));
            toast.success("Testimonial deleted");
        } catch (error) {
            console.error("Error deleting testimonial:", error);
            toast.error("Failed to delete testimonial");
        }
    };

    const resetForm = () => {
        setClientName("");
        setCategory("");
        setRating(0);
        setDescription("");
        setYoutubeLink("");
        setEditingId(null);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <Card className="border-none shadow-lg bg-white/80 dark:bg-black/40 backdrop-blur-md">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                {editingId ? <Pencil className="w-5 h-5" /> : <MessageSquareQuote className="w-5 h-5" />}
                                {editingId ? 'Edit Testimonial' : 'Add New Testimonial'}
                            </CardTitle>
                            <CardDescription>Share client success stories and feedback</CardDescription>
                        </div>
                        {editingId && (
                            <Button variant="ghost" onClick={resetForm} size="sm" className="text-muted-foreground hover:text-foreground">
                                <X className="w-4 h-4 mr-2" /> Cancel Edit
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="clientName">Client Name *</Label>
                                <Input
                                    id="clientName"
                                    value={clientName}
                                    onChange={(e) => setClientName(e.target.value)}
                                    placeholder="e.g. Sarah & John"
                                    required
                                    className="bg-background/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Category *</Label>
                                <Input
                                    id="category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    placeholder="e.g. Wedding Photography"
                                    required
                                    className="bg-background/50"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Rating *</Label>
                            <div className="flex items-center gap-1 p-2 border rounded-md bg-background/50 w-fit">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className={`p-1 transition-all hover:scale-110 focus:outline-none`}
                                        onClick={() => setRating(star)}
                                    >
                                        <Star
                                            className={`w-6 h-6 ${star <= rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground/30"}`}
                                        />
                                    </button>
                                ))}
                                <span className="ml-2 text-sm text-muted-foreground font-medium">
                                    {rating > 0 ? `${rating} Stars` : "Select rating"}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Testimonial *</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                placeholder="Write the client's feedback here..."
                                className="min-h-[100px] bg-background/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="youtubeLink" className="flex items-center gap-2">
                                <Video className="w-4 h-4" /> YouTube Video Link (Optional)
                            </Label>
                            <Input
                                id="youtubeLink"
                                value={youtubeLink}
                                onChange={(e) => setYoutubeLink(e.target.value)}
                                placeholder="https://www.youtube.com/watch?v=..."
                                className="bg-background/50"
                            />
                        </div>

                        <div className="pt-2">
                            <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto min-w-[150px]">
                                {isSubmitting ? "Saving..." : (editingId ? "Update Testimonial" : "Add Testimonial")}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h3 className="text-xl font-semibold tracking-tight">Existing Testimonials</h3>
                    <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">{testimonials.length} Total</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {testimonials.length === 0 ? (
                        <div className="col-span-full text-center py-12 border-2 border-dashed rounded-xl bg-muted/30">
                            <MessageSquareQuote className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                            <p className="text-muted-foreground font-medium">No testimonials yet.</p>
                            <p className="text-sm text-muted-foreground/70">Add your first client testimonial above.</p>
                        </div>
                    ) : (
                        testimonials.map((t) => (
                            <Card key={t.id} className="group overflow-hidden transition-all hover:shadow-md hover:border-primary/50">
                                <CardContent className="p-5">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="space-y-3 flex-1 min-w-0">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-semibold text-lg truncate">{t.clientName}</h4>
                                                    <span className="text-[10px] uppercase tracking-wider font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full whitespace-nowrap">
                                                        {t.category}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-3.5 h-3.5 ${i < t.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground/20"}`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="relative">
                                                <span className="absolute -top-2 -left-1 text-4xl text-muted-foreground/10 font-serif">"</span>
                                                <p className="text-sm text-muted-foreground line-clamp-3 pl-4 italic relative z-10">
                                                    {t.description}
                                                </p>
                                            </div>

                                            {t.youtubeLink && (
                                                <a
                                                    href={t.youtubeLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700 hover:underline mt-1"
                                                >
                                                    <Video className="w-3.5 h-3.5" />
                                                    Watch Video Review
                                                </a>
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleEdit(t)}>
                                                <Pencil className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDelete(t.id)}>
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminTestimonials;
