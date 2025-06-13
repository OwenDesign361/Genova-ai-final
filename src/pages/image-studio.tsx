// src/pages/image-studio.tsx
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Download, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { generateAndDownloadImage } from "@/lib/gemini"; // Using our mock function for now

// Function to handle downloading the image from a URL
const downloadImage = (url: string, filename: string) => {
    fetch(url)
    .then(response => response.blob())
    .then(blob => {
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(blobUrl);
        toast.success("Image download started!");
    })
    .catch(e => {
        console.error("Download Error:", e);
        toast.error("Could not download image. It may be due to browser security (CORS).");
    });
}

export default function ImageStudioPage() {
    const [prompt, setPrompt] = useState("");

    const mutation = useMutation({
        mutationFn: (currentPrompt: string) => generateAndDownloadImage(currentPrompt, 4),
        onSuccess: () => {
            toast.success("Images generated!");
        },
        onError: () => {
            toast.error("Image generation failed.");
        }
    });

    const handleGenerate = () => {
        if (!prompt) {
            toast.error("Please enter a prompt.");
            return;
        }
        mutation.mutate(prompt);
    };
    
    return (
        <div className="flex flex-col gap-8">
            <Card className="border-primary/20">
                <CardHeader>
                    <CardTitle className="text-2xl">Image Studio</CardTitle>
                    <CardDescription>Craft stunning visuals from a simple text description.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-2">
                        <Input
                            placeholder="e.g., A golden retriever wearing sunglasses, synthwave style"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            disabled={mutation.isPending}
                            className="text-base"
                        />
                        <Button onClick={handleGenerate} disabled={mutation.isPending} size="lg" className="w-full md:w-auto">
                            {mutation.isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <ImageIcon className="mr-2 h-5 w-5" />}
                            Generate (4)
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {(mutation.isPending || mutation.isSuccess) && (
                 <Card>
                    <CardHeader>
                        <CardTitle>Generated Images</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {mutation.isPending && (
                                Array(4).fill(null).map((_, i) => (
                                    <div key={i} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                    </div>
                                ))
                            )}
                            {mutation.isSuccess && (
                                mutation.data.map((src, i) => (
                                    <div key={src} className="relative group overflow-hidden rounded-lg">
                                        <img src={src} alt={`Generated image ${i + 1}`} className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-2">
                                            <Button
                                                size="icon"
                                                variant="secondary"
                                                onClick={() => downloadImage(src, `${prompt.slice(0, 20)}-${i+1}.png`)}
                                            >
                                                <Download className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
