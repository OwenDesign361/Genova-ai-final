// src/components/layout/main-layout.tsx

import { Link, Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/clerk-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Bot, Home, DollarSign, Image as ImageIcon, Menu } from "lucide-react";

export function MainLayout() {
  const location = useLocation();
  const navItems = [
    { href: "/", label: "Text Generator", icon: Home },
    { href: "/image-studio", label: "Image Studio", icon: ImageIcon },
    { href: "/pricing", label: "Pricing", icon: DollarSign },
  ];

  const NavLinks = ({ isMobile = false }: { isMobile?: boolean }) => (
    <nav className={cn("flex flex-col gap-2", { "mt-8": isMobile })}>
      {navItems.map((item) => (
        <Link key={item.href} to={item.href}>
          <Button
            variant={location.pathname === item.href ? "secondary" : "ghost"}
            className="w-full justify-start gap-2 text-base"
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Button>
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* --- Desktop Sidebar --- */}
      <aside className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <Bot className="h-6 w-6 text-primary" />
              <span className="text-xl font-heading font-bold">GENOVA</span>
            </Link>
          </div>
          <div className="flex-1 py-4">
            <NavLinks />
          </div>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <div className="flex flex-col">
        {/* --- Main Header (Mobile and Desktop) --- */}
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col">
                <NavLinks isMobile />
              </SheetContent>
            </Sheet>
          </div>
          <div className="w-full flex-1">
            {/* Header content like a title or breadcrumbs could go here */}
          </div>
          <UserButton afterSignOutUrl="/" />
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4 md:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
