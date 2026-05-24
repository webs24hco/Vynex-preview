"use client";

import { Check, Crown, Sparkles, Zap } from "lucide-react";
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
        t("plan.feat.20clients"),
        t("plan.feat.basicScheduling"),
        t("plan.feat.manualReminders"),
        t("plan.feat.1provider"),
      ],
      cta: t("plan.currentPlan"),
      current: true,
      featured: false,
    },
    {
      name: t("plan.pro"),
      price: "€19",
      period: t("plan.month"),
      description: t("plan.proDesc"),
      icon: Sparkles,
      features: [
        t("plan.feat.unlimitedClients"),
        t("plan.feat.smartScheduling"),
        t("plan.feat.whatsappReminders"),
        t("plan.feat.revenueAnalytics"),
        t("plan.feat.clientNotes"),
        t("plan.feat.prioritySupport"),
      ],
      cta: t("plan.upgradePro"),
      current: false,
      featured: true,
    },
    {
      name: t("plan.studio"),
      price: "€49",
      period: t("plan.month"),
      description: t("plan.studioDesc"),
      icon: Crown,
      features: [
        t("plan.feat.everythingPro"),
        t("plan.feat.5team"),
        t("plan.feat.teamCalendar"),
        t("plan.feat.advancedAnalytics"),
        t("plan.feat.customBranding"),
        t("plan.feat.apiAccess"),
        t("plan.feat.accountManager"),
      ],
      cta: t("plan.upgradeStudio"),
      current: false,
      featured: false,
    },
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
                    <h3 className="font-bold text-plum">{plan.name}</h3>
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
                  <div key={feature} className="flex items-center gap-2.5">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${plan.featured ? "bg-rose/10" : "bg-green-50"}`}>
                      <Check size={10} className={plan.featured ? "text-rose" : "text-green-500"} />
                    </div>
                    <span className="text-xs text-plum">{feature}</span>
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
