"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Users, Scissors, Crown, Sun } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  // Hide on auth pages
  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  const tabs = [
    { href: "/", label: t("nav.today"), icon: Sun },
    { href: "/appointments", label: t("nav.appointments"), icon: CalendarDays },
    { href: "/clients", label: t("nav.clients"), icon: Users },
    { href: "/services", label: t("nav.services"), icon: Scissors },
    { href: "/plan", label: t("nav.plan"), icon: Crown },
  ];

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50"
      style={{ position: "fixed" }}
    >
      <div className="mx-3 mb-3 floating-nav rounded-2xl">
        <div className="flex items-center justify-around py-2.5 px-1">
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
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 tap-scale ${
                  isActive
                    ? "text-rose bg-rose/10"
                    : "text-plum-light hover:text-rose"
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.2 : 1.6} />
                <span className={`text-[10px] leading-tight ${isActive ? "font-semibold" : "font-medium"}`}>
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
