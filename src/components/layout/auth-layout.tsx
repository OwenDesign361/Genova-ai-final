// src/components/layout/auth-layout.tsx

import { Bot } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <div className="flex items-center gap-2 mb-8">
            <Bot className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-heading font-bold">GENOVA AI</h1>
        </div>
      {children}
    </div>
  );
}
