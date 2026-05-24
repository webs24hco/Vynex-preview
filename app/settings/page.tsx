"use client";

import { ArrowLeft, Palette, Crown, Lock, Check, FlaskConical } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme, ThemeName, themes } from "@/context/ThemeContext";
import { usePlan, PlanType } from "@/context/PlanContext";

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

const planOptions: PlanType[] = ["Free", "Pro", "Studio"];

export default function SettingsPage() {
  const { t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { plan, setPlan, isPro } = usePlan();

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

      {/* Test Mode Toggle */}
      <div className="glass-card-solid rounded-2xl p-4 premium-shadow border border-purple-200/40 bg-gradient-to-br from-purple-50/40 to-transparent">
        <div className="flex items-center gap-2 mb-3">
          <FlaskConical size={16} className="text-purple-600" />
          <h3 className="text-xs font-semibold text-plum uppercase tracking-wider">
            Test Mode
          </h3>
        </div>
        <p className="text-[11px] text-plum-light mb-3">
          Switch plans to test premium features like Themes.
        </p>
        <div className="flex gap-2">
          {planOptions.map((p) => (
            <button
              key={p}
              onClick={() => setPlan(p)}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-all duration-200 active:scale-95 ${
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

      {/* Theme Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Palette size={16} className="text-rose" />
          <h2 className="text-sm font-semibold text-plum">{t("settings.themeSection")}</h2>
        </div>

        <div className="space-y-3">
          {themeOptions.map((opt) => {
            const isActive = theme === opt.key;
            const isLocked = opt.pro && !isPro;
            return (
              <button
                key={opt.key}
                onClick={() => {
                  if (!isLocked) {
                    setTheme(opt.key);
                  }
                }}
                className={`w-full glass-card-solid rounded-2xl p-4 premium-shadow text-left tap-scale transition-all duration-200 ${
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
                        {opt.pro && (
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
                  className="inline-block mt-2 text-xs font-medium text-rose hover:underline"
                >
                  {t("settings.viewPlans")} →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
