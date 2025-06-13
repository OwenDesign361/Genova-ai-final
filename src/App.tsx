// src/App.tsx
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { ClerkProvider, SignIn, SignUp, UserProfile, SignedIn, SignedOut } from "@clerk/clerk-react";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { MainLayout } from "@/components/layout/main-layout";
import HomePage from "@/pages/home";
import PricingPage from "@/pages/pricing";
import ImageStudioPage from "@/pages/image-studio";
import { AuthLayout } from "./components/layout/auth-layout";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!clerkPubKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");
}

const queryClient = new QueryClient();

// This component handles navigation for Clerk
function ClerkProviderWithRoutes() {
  const navigate = useNavigate();
  return (
    <ClerkProvider publishableKey={clerkPubKey} navigate={(to) => navigate(to)}>
      <Routes>
        <Route path="/sign-in/*" element={<AuthLayout><SignIn routing="path" path="/sign-in" /></AuthLayout>} />
        <Route path="/sign-up/*" element={<AuthLayout><SignUp routing="path" path="/sign-up" /></AuthLayout>} />
        <Route path="/account/*" element={<AuthLayout><UserProfile routing="path" path="/account" /></AuthLayout>} />

        <Route
          path="/*"
          element={
            <>
              <SignedIn>
                <MainLayout />
              </SignedIn>
              <SignedOut>
                 <AuthLayout><SignIn routing="path" path="/sign-in" /></AuthLayout>
              </SignedOut>
            </>
          }
        >
          <Route index element={<HomePage />} />
          <Route path="/image-studio" element={<ImageStudioPage />} />
          <Route path="/pricing" element={<PricingPage />} />
        </Route>
      </Routes>
    </ClerkProvider>
  )
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="genova-ui-theme">
      <TooltipProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <ClerkProviderWithRoutes />
          </BrowserRouter>
          <Toaster />
        </QueryClientProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
