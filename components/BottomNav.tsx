"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Users, Scissors, Crown, Sun } from "lucide-react";

const tabs = [
  { href: "/", label: "Today", icon: Sun },
  { href: "/appointments", label: "Appointments", icon: CalendarDays },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/services", label: "Services", icon: Scissors },
  { href: "/plan", label: "Plan", icon: Crown },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-rose-light/50 z-50">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors ${
                isActive
                  ? "text-rose"
                  : "text-plum-light hover:text-rose"
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className={`text-[10px] ${isActive ? "font-semibold" : "font-medium"}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
