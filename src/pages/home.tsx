// src/pages/home.tsx
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { generateText } from "@/lib/gemini";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Copy, Sparkles } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  prompt: z.string().min(10, { message: "Prompt must be at least 10 characters." }),
});

export default function HomePage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { prompt: "" },
  });

  const mutation = useMutation({
    mutationFn: (prompt: string) => generateText(prompt),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values.prompt);
  }

  const handleCopy = () => {
    if (!mutation.data) return;
    const textToCopy = new DOMParser().parseFromString(mutation.data, 'text/html').body.textContent || "";
    navigator.clipboard.writeText(textToCopy);
    toast.success("Content copied to clipboard!");
  }

  return (
    <div className="flex flex-col gap-8">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl">AI Text Generator</CardTitle>
          <CardDescription>Bring your ideas to life with our advanced text generation engine.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Your Prompt</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Write a marketing email for a new AI-powered coffee machine..."
                        className="min-h-[150px] resize-y text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={mutation.isPending} size="lg">
                {mutation.isPending ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-5 w-5" />
                )}
                Generate Content
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {mutation.isPending && (
        <Card>
            <CardHeader>
                <CardTitle>Generating...</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-16">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </CardContent>
        </Card>
      )}

      {mutation.isSuccess && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Generated Content</CardTitle>
            <Button variant="ghost" size="icon" onClick={handleCopy}>
                <Copy className="h-5 w-5"/>
            </Button>
          </CardHeader>
          <CardContent>
            <div
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: mutation.data }}
            />
          </CardContent>
        </Card>
      )}

      {mutation.isError && (
          <Card className="border-destructive">
              <CardHeader>
                  <CardTitle className="text-destructive">Generation Failed</CardTitle>
              </CardHeader>
              <CardContent>
                  <p>There was an error communicating with the AI. Please check your API key and try again.</p>
              </CardContent>
          </Card>
      )}
    </div>
  );
}
