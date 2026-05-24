"use client";

import { Check, Crown, Sparkles, Zap, Lock } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function PlanPage() {
  const { t } = useLanguage();

  const plans = [
    {
      name: t("plan.free"),
      price: "€0",
      period: t("plan.month"),
      description: t("plan.freeDesc"),
      icon: Zap,
      features: [
        { text: t("plan.feat.20clients"), locked: false },
        { text: t("plan.feat.basicScheduling"), locked: false },
        { text: t("plan.feat.manualReminders"), locked: false },
        { text: t("plan.feat.1provider"), locked: false },
      ],
      cta: t("plan.currentPlan"),
      current: true,
      featured: false,
      badge: null,
    },
    {
      name: t("plan.pro"),
      price: "€19",
      period: t("plan.month"),
      description: t("plan.proDesc"),
      icon: Sparkles,
      features: [
        { text: t("plan.feat.unlimitedClients"), locked: false },
        { text: t("plan.feat.smartScheduling"), locked: false },
        { text: t("plan.feat.whatsappReminders"), locked: false },
        { text: t("plan.feat.revenueAnalytics"), locked: false },
        { text: t("plan.feat.clientNotes"), locked: false },
        { text: t("plan.feat.themeCustomizer"), locked: false },
        { text: t("plan.feat.prioritySupport"), locked: false },
      ],
      cta: t("plan.upgradePro"),
      current: false,
      featured: true,
      badge: "PRO",
    },
    {
      name: t("plan.studio"),
      price: "€49",
      period: t("plan.month"),
      description: t("plan.studioDesc"),
      icon: Crown,
      features: [
        { text: t("plan.feat.everythingPro"), locked: false },
        { text: t("plan.feat.5team"), locked: false },
        { text: t("plan.feat.teamCalendar"), locked: false },
        { text: t("plan.feat.advancedAnalytics"), locked: false },
        { text: t("plan.feat.customBranding"), locked: false },
        { text: t("plan.feat.apiAccess"), locked: false },
        { text: t("plan.feat.accountManager"), locked: false },
      ],
      cta: t("plan.upgradeStudio"),
      current: false,
      featured: false,
      badge: "STUDIO",
    },
  ];

  // Pro-gated features shown in a separate section
  const proFeatures = [
    { text: t("plan.feat.themeCustomizer"), icon: "🎨" },
    { text: t("plan.feat.advancedAnalytics"), icon: "📊" },
    { text: t("plan.feat.customBranding"), icon: "✨" },
  ];

  return (
    <div className="px-5 pt-6 space-y-5 pb-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="text-center flex-1">
          <h1 className="text-xl font-bold text-plum tracking-tight">{t("plan.title")}</h1>
          <p className="text-xs text-plum-light mt-1">{t("plan.subtitle")}</p>
        </div>
        <LanguageSwitcher />
      </div>

      {/* Pro Features Banner */}
      <div className="glass-card-solid rounded-2xl p-4 premium-shadow border border-amber-200/30 bg-gradient-to-br from-amber-50/40 to-transparent">
        <div className="flex items-center gap-2 mb-3">
          <Crown size={16} className="text-amber-600" />
          <h3 className="text-xs font-semibold text-plum uppercase tracking-wider">
            {t("plan.proFeatures")}
          </h3>
        </div>
        <div className="space-y-2">
          {proFeatures.map((feat) => (
            <div key={feat.text} className="flex items-center gap-2.5">
              <span className="text-sm">{feat.icon}</span>
              <span className="text-xs text-plum flex-1">{feat.text}</span>
              <span className="flex items-center gap-0.5 text-[9px] font-semibold bg-amber-100/80 text-amber-700 px-1.5 py-0.5 rounded-full border border-amber-200/50">
                <Lock size={8} />
                PRO
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Plans */}
      <div className="space-y-4">
        {plans.map((plan, index) => {
          const Icon = plan.icon;
          return (
            <div
              key={plan.name}
              className={`rounded-3xl p-5 transition-all duration-200 tap-scale animate-fade-in-up ${
                plan.featured
                  ? "glass-card-solid ring-2 ring-rose/25 premium-shadow-lg relative"
                  : "glass-card-solid premium-shadow"
              }`}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-1 bg-gradient-to-r from-rose to-rose-dark text-white text-[10px] font-semibold rounded-full uppercase tracking-wider shadow-sm">
                  {t("plan.mostPopular")}
                </div>
              )}

              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm ${
                    plan.featured ? "bg-rose/15 text-rose" : "bg-gold/30 text-plum"
                  }`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-plum">{plan.name}</h3>
                      {plan.badge && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                          plan.badge === "PRO"
                            ? "bg-rose/10 text-rose-dark border border-rose/20"
                            : "bg-amber-100/80 text-amber-700 border border-amber-200/50"
                        }`}>
                          {plan.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-plum-light">{plan.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-plum">{plan.price}</span>
                  <span className="text-xs text-plum-light">{plan.period}</span>
                </div>
              </div>

              <div className="mt-4 space-y-2.5">
                {plan.features.map((feature) => (
                  <div key={feature.text} className="flex items-center gap-2.5">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${plan.featured ? "bg-rose/10" : "bg-green-50"}`}>
                      <Check size={10} className={plan.featured ? "text-rose" : "text-green-500"} />
                    </div>
                    <span className="text-xs text-plum">{feature.text}</span>
                  </div>
                ))}
              </div>

              <button
                className={`w-full mt-5 py-3 rounded-2xl text-sm font-medium transition-all duration-200 active:scale-[0.97] ${
                  plan.current
                    ? "bg-plum/5 text-plum-light cursor-default"
                    : plan.featured
                    ? "bg-gradient-to-r from-rose to-rose-dark text-white shadow-md hover:shadow-lg"
                    : "glass-card text-rose hover:bg-rose/5"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          );
        })}
      </div>

      {/* Bottom Note */}
      <div className="text-center pt-2">
        <p className="text-[11px] text-plum-light">
          {t("plan.trialNote")}
        </p>
        <p className="text-[11px] text-plum-light mt-1">
          {t("plan.customPlan")} <span className="text-rose font-medium">{t("plan.contactUs")}</span>
        </p>
      </div>
    </div>
  );
}
