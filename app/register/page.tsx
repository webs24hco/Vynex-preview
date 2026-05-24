"use client";

import { useState } from "react";
import { ArrowLeft, Check, Eye, EyeOff, Sparkles, Crown, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { createClient } from "@/utils/supabase/client";

export default function RegisterPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    selectedPlan: "Free",
    businessName: "",
    currency: "EUR",
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const plans = [
    { key: "Free", price: "€0", desc: t("plan.freeDesc"), features: [t("plan.feat.20clients"), t("plan.feat.basicScheduling"), t("plan.feat.1provider")] },
    { key: "Pro", price: "€19", desc: t("plan.proDesc"), features: [t("plan.feat.unlimitedClients"), t("plan.feat.whatsappReminders"), t("plan.feat.themeCustomizer")] },
    { key: "Studio", price: "€39", desc: t("plan.studioDesc"), features: [t("plan.feat.everythingPro"), t("plan.feat.5team"), t("plan.feat.customBranding")] },
  ];

  const currencies = [
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "MXN", symbol: "$", name: "Mexican Peso" },
    { code: "COP", symbol: "$", name: "Colombian Peso" },
  ];

  const handleSignUp = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
          business_name: formData.businessName,
          plan: formData.selectedPlan,
          currency: formData.currency,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // Redirect to home on success
    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        {step > 1 ? (
          <button
            onClick={() => setStep(step - 1)}
            className="w-10 h-10 rounded-full bg-white/70 backdrop-blur-md border border-white/40 shadow-sm flex items-center justify-center text-plum-light hover:text-plum transition-all active:scale-90"
          >
            <ArrowLeft size={18} />
          </button>
        ) : (
          <Link
            href="/login"
            className="w-10 h-10 rounded-full bg-white/70 backdrop-blur-md border border-white/40 shadow-sm flex items-center justify-center text-plum-light hover:text-plum transition-all active:scale-90"
          >
            <ArrowLeft size={18} />
          </Link>
        )}
        <div>
          <h1 className="text-lg font-bold text-plum">{t("auth.createTitle")}</h1>
          <p className="text-xs text-plum-light">
            {step === 1 ? t("auth.step1") : step === 2 ? t("auth.step2") : t("auth.step3")}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              s <= step ? "bg-gradient-to-r from-rose to-rose-dark" : "bg-rose-light/30"
            }`}
          />
        ))}
      </div>

      {/* Error display */}
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200/50 text-xs text-red-600 text-center">
          {error}
        </div>
      )}

      {/* Step 1: Account Details */}
      {step === 1 && (
        <div className="space-y-4 animate-fade-in-up">
          <div>
            <label className="text-xs font-medium text-plum-light uppercase tracking-wider mb-1.5 block">
              {t("auth.fullName")}
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => updateField("fullName", e.target.value)}
              placeholder="Valentina Studio"
              className="w-full px-4 py-3.5 rounded-xl glass-card-solid border border-white/50 text-sm text-plum placeholder:text-plum-light/50 focus:outline-none focus:ring-2 focus:ring-rose/30 transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-plum-light uppercase tracking-wider mb-1.5 block">
              {t("auth.email")}
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="valentina@studio.com"
              className="w-full px-4 py-3.5 rounded-xl glass-card-solid border border-white/50 text-sm text-plum placeholder:text-plum-light/50 focus:outline-none focus:ring-2 focus:ring-rose/30 transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-plum-light uppercase tracking-wider mb-1.5 block">
              {t("auth.password")}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => updateField("password", e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3.5 rounded-xl glass-card-solid border border-white/50 text-sm text-plum placeholder:text-plum-light/50 focus:outline-none focus:ring-2 focus:ring-rose/30 transition-all pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-plum-light hover:text-rose"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-plum-light uppercase tracking-wider mb-1.5 block">
              {t("auth.confirmPassword")}
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => updateField("confirmPassword", e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3.5 rounded-xl glass-card-solid border border-white/50 text-sm text-plum placeholder:text-plum-light/50 focus:outline-none focus:ring-2 focus:ring-rose/30 transition-all"
            />
          </div>

          <button
            onClick={() => setStep(2)}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose to-rose-dark text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all active:scale-[0.98] mt-6"
          >
            {t("auth.next")}
          </button>
        </div>
      )}

      {/* Step 2: Plan Selection */}
      {step === 2 && (
        <div className="space-y-3 animate-fade-in-up">
          {plans.map((plan) => (
            <button
              key={plan.key}
              onClick={() => updateField("selectedPlan", plan.key)}
              className={`w-full glass-card-solid rounded-2xl p-4 text-left transition-all duration-200 tap-scale ${
                formData.selectedPlan === plan.key
                  ? "ring-2 ring-rose/40 border-rose/30"
                  : "border border-white/50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-plum">{plan.key}</span>
                  {plan.key === "Pro" && (
                    <span className="text-[9px] font-bold bg-gradient-to-r from-rose to-rose-dark text-white px-2 py-0.5 rounded-full">
                      POPULAR
                    </span>
                  )}
                  {plan.key === "Studio" && (
                    <Crown size={14} className="text-amber-500" />
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold text-rose">{plan.price}</span>
                  <span className="text-xs text-plum-light">{t("plan.month")}</span>
                </div>
              </div>
              <p className="text-xs text-plum-light mb-2">{plan.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {plan.features.map((f, i) => (
                  <span key={i} className="text-[10px] bg-rose/5 text-plum px-2 py-0.5 rounded-full">
                    ✓ {f}
                  </span>
                ))}
              </div>
              {formData.selectedPlan === plan.key && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-rose flex items-center justify-center">
                  <Check size={12} className="text-white" />
                </div>
              )}
            </button>
          ))}

          <button
            onClick={() => setStep(3)}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose to-rose-dark text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all active:scale-[0.98] mt-4"
          >
            {t("auth.next")}
          </button>
        </div>
      )}

      {/* Step 3: Business Setup */}
      {step === 3 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-rose/20 to-gold/20 flex items-center justify-center">
              <Sparkles size={24} className="text-rose" />
            </div>
            <p className="text-sm text-plum-light">Almost there! Set up your business.</p>
          </div>

          <div>
            <label className="text-xs font-medium text-plum-light uppercase tracking-wider mb-1.5 block">
              {t("auth.businessName")}
            </label>
            <input
              type="text"
              value={formData.businessName}
              onChange={(e) => updateField("businessName", e.target.value)}
              placeholder={t("auth.businessNamePlaceholder")}
              className="w-full px-4 py-3.5 rounded-xl glass-card-solid border border-white/50 text-sm text-plum placeholder:text-plum-light/50 focus:outline-none focus:ring-2 focus:ring-rose/30 transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-plum-light uppercase tracking-wider mb-1.5 block">
              {t("auth.currency")}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {currencies.map((c) => (
                <button
                  key={c.code}
                  onClick={() => updateField("currency", c.code)}
                  className={`px-3 py-2.5 rounded-xl text-sm text-left transition-all tap-scale ${
                    formData.currency === c.code
                      ? "glass-card-solid ring-2 ring-rose/40 border-rose/30"
                      : "glass-card border border-white/50"
                  }`}
                >
                  <span className="font-semibold text-plum">{c.symbol} {c.code}</span>
                  <p className="text-[10px] text-plum-light">{c.name}</p>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSignUp}
            disabled={loading}
            className="w-full flex items-center justify-center py-3.5 rounded-xl bg-gradient-to-r from-rose to-rose-dark text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all active:scale-[0.98] mt-6 disabled:opacity-70 disabled:active:scale-100"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>{t("auth.getStarted")} ✨</>
            )}
          </button>
        </div>
      )}

      {/* Sign in link */}
      <p className="text-center text-sm text-plum-light mt-8">
        {t("auth.hasAccount")}{" "}
        <Link href="/login" className="text-rose font-semibold hover:underline">
          {t("auth.signIn")}
        </Link>
      </p>
    </div>
  );
}
