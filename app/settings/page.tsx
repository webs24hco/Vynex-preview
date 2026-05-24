"use client";

import { ArrowLeft, Palette, Crown, Lock, Check } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme, ThemeName, themes } from "@/context/ThemeContext";

const themeOptions: { key: ThemeName; labelKey: string; preview: string[]; pro: boolean }[] = [
  {
    key: "roseGold",
    labelKey: "settings.themeRoseGold",
    preview: ["#DCAE96", "#f0d4c4", "#F3E5AB", "#4A3B3C"],
    pro: false,
  },
  {
    key: "midnightGlamour",
    labelKey: "settings.themeMidnight",
    preview: ["#C9A0DC", "#dfc4ec", "#F0C27B", "#1A1125"],
    pro: true,
  },
  {
    key: "softSage",
    labelKey: "settings.themeSage",
    preview: ["#7BA68C", "#a8cdb6", "#E8D5B7", "#2D3B33"],
    pro: true,
  },
];

export default function SettingsPage() {
  const { t } = useLanguage();
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen px-5 pt-6 pb-28 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="w-10 h-10 rounded-full bg-white/70 backdrop-blur-md border border-white/40 shadow-sm flex items-center justify-center text-plum-light hover:text-plum transition-all duration-200 active:scale-90"
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

      {/* Theme Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Palette size={16} className="text-rose" />
          <h2 className="text-sm font-semibold text-plum">{t("settings.themeSection")}</h2>
        </div>

        <div className="space-y-3">
          {themeOptions.map((opt) => {
            const isActive = theme === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => {
                  if (!opt.pro) {
                    setTheme(opt.key);
                  }
                }}
                className={`w-full glass-card-solid rounded-2xl p-4 premium-shadow text-left tap-scale transition-all duration-200 ${
                  isActive ? "ring-2 ring-rose/40 border-rose/30" : ""
                } ${opt.pro ? "opacity-80" : ""}`}
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
                        {opt.pro && (
                          <span className="flex items-center gap-0.5 text-[9px] font-semibold bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 px-1.5 py-0.5 rounded-full border border-amber-200/50">
                            <Crown size={8} />
                            PRO
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {opt.pro && (
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

        {/* Pro upsell */}
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
                className="inline-block mt-2 text-xs font-medium text-rose hover:underline"
              >
                {t("settings.viewPlans")} →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
