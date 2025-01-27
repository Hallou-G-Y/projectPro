"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { MapPin, Train, Wind } from "lucide-react";

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center space-x-8 h-16">
          <Link
            href="/"
            className={cn(
              "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary",
              pathname === "/" ? "text-primary" : "text-muted-foreground"
            )}
          >
            <MapPin className="h-4 w-4" />
            <span>Carte</span>
          </Link>
          <Link
            href="/transport"
            className={cn(
              "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary",
              pathname === "/transport" ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Train className="h-4 w-4" />
            <span>Transport</span>
          </Link>
          <Link
            href="/air"
            className={cn(
              "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary",
              pathname === "/air" ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Wind className="h-4 w-4" />
            <span>Qualité de l'air</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}