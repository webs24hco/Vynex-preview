"use client";

import { useState } from "react";
import { ArrowLeft, Palette, Crown, Lock, Check, FlaskConical, MessageCircle, Users, BarChart3, Globe, Upload, ChevronRight, LogOut, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme, ThemeName, themes } from "@/context/ThemeContext";
import { usePlan, PlanType } from "@/context/PlanContext";
import { createClient } from "@/utils/supabase/client";

const themeOptions: { key: ThemeName; labelKey: string; preview: string[]; tier: "free" | "pro" }[] = [
  {
    key: "default",
    labelKey: "settings.themeDefault",
    preview: ["#DCAE96", "#f0d4c4", "#F3E5AB", "#4A3B3C"],
    tier: "free",
  },
  {
    key: "roseGold",
    labelKey: "settings.themeRoseGold",
    preview: ["#DCAE96", "#f0d4c4", "#F3E5AB", "#4A3B3C"],
    tier: "pro",
  },
  {
    key: "midnightGlamour",
    labelKey: "settings.themeMidnight",
    preview: ["#C9A0DC", "#dfc4ec", "#F0C27B", "#1A1125"],
    tier: "pro",
  },
  {
    key: "softSage",
    labelKey: "settings.themeSage",
    preview: ["#7BA68C", "#a8cdb6", "#E8D5B7", "#2D3B33"],
    tier: "pro",
  },
];

const planOptions: PlanType[] = ["Free", "Pro", "Studio"];

export default function SettingsPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { theme, setTheme, customBranding, setCustomBranding } = useTheme();
  const { plan, setPlan, isPro, isStudio } = usePlan();
  const [customColor, setCustomColor] = useState(customBranding.accentColor);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const menuItems = [
    { href: "/settings/templates", icon: MessageCircle, label: t("settings.templates"), badge: isPro ? null : "PRO" },
    { href: "/team", icon: Users, label: t("settings.team"), badge: isStudio ? null : "STUDIO" },
    { href: "/reports", icon: BarChart3, label: t("settings.reports"), badge: isStudio ? null : "STUDIO" },
  ];

  return (
    <div className="min-h-screen px-5 pt-6 pb-28 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="w-10 h-10 rounded-full bg-white/70 backdrop-blur-md border border-white/40 shadow-sm flex items-center justify-center text-plum-light hover:text-plum transition-all duration-200 active:scale-90 cursor-pointer touch-manipulation"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-plum tracking-tight">
            {t("settings.title")}
          </h1>
          <p className="text-xs text-plum-light">{t("settings.subtitle")}</p>
        </div>
      </div>

      {/* Test Mode Toggle */}
      <div className="relative z-10 glass-card-solid rounded-2xl p-4 premium-shadow border border-purple-200/40 bg-gradient-to-br from-purple-50/40 to-transparent">
        <div className="flex items-center gap-2 mb-3">
          <FlaskConical size={16} className="text-purple-600" />
          <h3 className="text-xs font-semibold text-plum uppercase tracking-wider">
            Test Mode
          </h3>
        </div>
        <p className="text-[11px] text-plum-light mb-3">
          Switch plans to test premium features like Themes, Templates, Team & Reports.
        </p>
        <div className="relative z-20 flex gap-2">
          {planOptions.map((p) => (
            <button
              type="button"
              key={p}
              onClick={() => setPlan(p)}
              onTouchEnd={(e) => {
                e.preventDefault();
                setPlan(p);
              }}
              className={`relative z-20 flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-all duration-200 active:scale-95 cursor-pointer touch-manipulation select-none ${
                plan === p
                  ? "bg-purple-600 text-white shadow-md"
                  : "bg-white/70 text-plum border border-white/50 hover:bg-purple-50"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        {plan !== "Free" && (
          <p className="text-[10px] text-purple-600 font-medium mt-2">
            ✓ Premium features unlocked ({plan} plan active)
          </p>
        )}
      </div>

      {/* Menu Links */}
      <div className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between glass-card-solid rounded-2xl p-4 premium-shadow tap-scale cursor-pointer touch-manipulation"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose/10 flex items-center justify-center">
                  <Icon size={16} className="text-rose" />
                </div>
                <span className="text-sm font-medium text-plum">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.badge && (
                  <span className="text-[9px] font-bold bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 border border-amber-200/50 px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
                <ChevronRight size={14} className="text-plum-light" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Theme Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Palette size={16} className="text-rose" />
          <h2 className="text-sm font-semibold text-plum">{t("settings.themeSection")}</h2>
        </div>

        <div className="space-y-3">
          {themeOptions.map((opt) => {
            const isActive = theme === opt.key;
            const isLocked = opt.tier === "pro" && !isPro;
            return (
              <button
                type="button"
                key={opt.key}
                onClick={() => {
                  if (!isLocked) {
                    setTheme(opt.key);
                  }
                }}
                className={`w-full glass-card-solid rounded-2xl p-4 premium-shadow text-left tap-scale transition-all duration-200 cursor-pointer touch-manipulation ${
                  isActive ? "ring-2 ring-rose/40 border-rose/30" : ""
                } ${isLocked ? "opacity-60" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Color preview circles */}
                    <div className="flex -space-x-1.5">
                      {opt.preview.map((color, i) => (
                        <div
                          key={i}
                          className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium text-plum">
                          {t(opt.labelKey)}
                        </span>
                        {opt.tier === "pro" && (
                          <span className={`flex items-center gap-0.5 text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${
                            isPro
                              ? "bg-green-50 text-green-700 border-green-200/50"
                              : "bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 border-amber-200/50"
                          }`}>
                            {isPro ? (
                              <>
                                <Check size={8} />
                                UNLOCKED
                              </>
                            ) : (
                              <>
                                <Crown size={8} />
                                PRO
                              </>
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isLocked && (
                      <Lock size={14} className="text-plum-light" />
                    )}
                    {isActive && (
                      <div className="w-6 h-6 rounded-full bg-rose/15 flex items-center justify-center">
                        <Check size={12} className="text-rose" />
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom Branding (Studio only) */}
        {isStudio && (
          <div className="glass-card-solid rounded-2xl p-4 premium-shadow border border-purple-200/30 bg-gradient-to-br from-purple-50/20 to-transparent">
            <div className="flex items-center gap-2 mb-3">
              <Crown size={14} className="text-purple-600" />
              <h3 className="text-sm font-semibold text-plum">{t("settings.customBranding")}</h3>
            </div>
            <p className="text-xs text-plum-light mb-4">{t("settings.customBrandingDesc")}</p>
            
            {/* Logo Upload */}
            <div className="mb-4">
              <label className="text-xs font-medium text-plum-light uppercase tracking-wider mb-1.5 block">
                {t("settings.uploadLogo")}
              </label>
              <button
                type="button"
                className="w-full h-20 rounded-xl border-2 border-dashed border-rose/30 flex items-center justify-center gap-2 text-plum-light hover:text-rose hover:border-rose/50 transition-all cursor-pointer touch-manipulation"
              >
                <Upload size={16} />
                <span className="text-xs font-medium">Choose file or drag & drop</span>
              </button>
            </div>

            {/* Color Picker */}
            <div className="mb-4">
              <label className="text-xs font-medium text-plum-light uppercase tracking-wider mb-1.5 block">
                {t("settings.accentColor")}
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="w-10 h-10 rounded-lg border-0 cursor-pointer touch-manipulation"
                />
                <input
                  type="text"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg glass-card border border-white/50 text-sm font-mono text-plum focus:outline-none focus:ring-2 focus:ring-rose/30"
                />
                <div className="w-8 h-8 rounded-full shadow-sm border border-white/50" style={{ backgroundColor: customColor }} />
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setCustomBranding({ accentColor: customColor, logoUrl: null });
                setTheme("custom");
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold text-xs shadow-md active:scale-[0.98] transition-all cursor-pointer touch-manipulation"
            >
              {t("settings.applyBranding")}
            </button>
          </div>
        )}

        {/* Pro upsell - only show when on Free plan */}
        {!isPro && (
          <div className="glass-card-solid rounded-2xl p-4 premium-shadow border border-amber-200/30 bg-gradient-to-br from-amber-50/50 to-transparent">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center shadow-sm">
                <Crown size={18} className="text-amber-700" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-plum">{t("settings.unlockThemes")}</p>
                <p className="text-xs text-plum-light mt-0.5">
                  {t("settings.unlockThemesDesc")}
                </p>
                <Link
                  href="/plan"
                  className="inline-block mt-2 text-xs font-medium text-rose hover:underline cursor-pointer touch-manipulation"
                >
                  {t("settings.viewPlans")} →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Account / Logout */}
      <div className="space-y-2">
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center justify-between glass-card-solid rounded-2xl p-4 tap-scale cursor-pointer touch-manipulation"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
              {loggingOut ? (
                <Loader2 size={16} className="text-red-500 animate-spin" />
              ) : (
                <LogOut size={16} className="text-red-500" />
              )}
            </div>
            <span className="text-sm font-medium text-red-500">{t("settings.logout")}</span>
          </div>
          <ChevronRight size={14} className="text-plum-light" />
        </button>
      </div>
    </div>
  );
}
