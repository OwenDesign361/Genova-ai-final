// src/pages/pricing.tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";
import { cn } from "@/lib/utils";

// In a real app, you would get this from your user's auth state.
// We'll hardcode it to 'Pro' for now to show how the UI highlights the current plan.
const currentUserPlan = "Free";

export default function PricingPage() {
  const tiers = [
    {
      name: "Free",
      id: "free",
      price: "$0",
      description: "Get a feel for our platform.",
      features: [
        "5 Text Generations per month", 
        "2 Image Generations (8 images) per month",
        "Access to Standard AI models", 
        "Community support"
      ],
      cta: "Your Current Plan",
      // IMPORTANT: Replace with your actual payment link from Lemon Squeezy/Stripe
      paymentLink: "#", 
    },
    {
      name: "Pro",
      id: "pro",
      price: "$20 / month",
      description: "For professionals and power users.",
      features: [
        "Unlimited Text Generations",
        "100 Image Generations (400 images) per month",
        "Access to Advanced AI models",
        "Priority Email Support",
        "Early access to new features"
      ],
      isFeatured: true, // This will make the card stand out
      cta: "Upgrade to Pro",
      // IMPORTANT: Replace with your actual payment link from Lemon Squeezy/Stripe
      paymentLink: "https://wencestudio.lemonsqueezy.com/buy/your-pro-plan-id",
    },
    {
      name: "Enterprise",
      id: "enterprise",
      price: "Custom",
      description: "For teams and businesses.",
      features: [
        "Everything in Pro",
        "Custom generation limits",
        "Team management features",
        "Dedicated account manager",
        "API Access"
      ],
      cta: "Contact Sales",
      // This can be a mailto link or a link to a contact form
      paymentLink: "mailto:sales@wencestudio.com",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
        <div className="text-center">
            <h1 className="text-4xl font-bold font-heading">Find the Right Plan for You</h1>
            <p className="text-muted-foreground mt-2 text-lg">Start for free, then upgrade to unlock powerful new capabilities.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {tiers.map((tier) => (
                <Card 
                    key={tier.id} 
                    className={cn(
                        "flex flex-col h-full", 
                        tier.isFeatured && "border-primary ring-2 ring-primary shadow-lg"
                    )}
                >
                <CardHeader className="text-center">
                    {tier.isFeatured && (
                        <div className="flex justify-center mb-4">
                            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                                <Star className="h-4 w-4" />
                                Most Popular
                            </div>
                        </div>
                    )}
                    <CardTitle className="text-3xl font-heading">{tier.name}</CardTitle>
                    <CardDescription className="text-xl font-semibold">{tier.price}</CardDescription>
                    <p className="text-muted-foreground">{tier.description}</p>
                </CardHeader>
                <CardContent className="flex-1">
                    <ul className="space-y-4">
                    {tier.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-base">{feature}</span>
                        </li>
                    ))}
                    </ul>
                </CardContent>
                <CardFooter>
                    <Button
                        asChild
                        className="w-full"
                        size="lg"
                        variant={tier.isFeatured ? "default" : "secondary"}
                        disabled={currentUserPlan === tier.id}
                    >
                        <a href={tier.paymentLink}>{currentUserPlan === tier.id ? "Your Current Plan" : tier.cta}</a>
                    </Button>
                </CardFooter>
                </Card>
            ))}
        </div>
    </div>
  );
}
