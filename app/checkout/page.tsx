"use client";

import { useState } from "react";
import { ArrowLeft, Banknote, CreditCard, Building2, Check, Receipt, Sparkles } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { usePlan } from "@/context/PlanContext";

type PaymentMethod = "cash" | "card" | "transfer";

export default function CheckoutPage() {
  const { t } = useLanguage();
  const { isPro } = usePlan();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [isPaid, setIsPaid] = useState(false);

  const subtotal = 95.00;
  const tax = subtotal * 0.21;
  const total = subtotal + tax;

  const methods = [
    { key: "cash" as PaymentMethod, icon: Banknote, label: t("checkout.cash"), color: "text-green-600 bg-green-50" },
    { key: "card" as PaymentMethod, icon: CreditCard, label: t("checkout.card"), color: "text-blue-600 bg-blue-50" },
    { key: "transfer" as PaymentMethod, icon: Building2, label: t("checkout.transfer"), color: "text-purple-600 bg-purple-50" },
  ];

  if (isPaid) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="animate-scale-in text-center">
          <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-green-50 flex items-center justify-center">
            <Check size={40} className="text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-plum mb-2">{t("checkout.success")}</h1>
          <p className="text-plum-light text-sm mb-1">€{total.toFixed(2)} received via {selectedMethod}</p>
          <p className="text-xs text-plum-light">Sofía Torres · Facial Treatment</p>

          <div className="space-y-3 mt-8">
            <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl glass-card-solid border border-rose/20 text-rose font-semibold text-sm tap-scale">
              <Receipt size={16} />
              {t("checkout.receipt")}
            </button>
            <Link
              href="/appointments"
              className="w-full flex items-center justify-center py-3.5 rounded-xl bg-gradient-to-r from-rose to-rose-dark text-white font-semibold text-sm shadow-lg transition-all"
            >
              Back to Appointments
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!isPro) {
    return (
      <div className="min-h-screen px-5 pt-6 pb-28 space-y-5">
        <div className="flex items-center gap-3">
          <Link
            href="/appointments"
            className="w-10 h-10 rounded-full bg-white/70 backdrop-blur-md border border-white/40 shadow-sm flex items-center justify-center text-plum-light hover:text-plum transition-all active:scale-90"
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-lg font-bold text-plum">{t("checkout.title")}</h1>
        </div>

        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center mb-4">
            <Sparkles size={28} className="text-amber-600" />
          </div>
          <h2 className="text-lg font-bold text-plum mb-2">Pro Feature</h2>
          <p className="text-sm text-plum-light mb-6 max-w-xs">Payment processing is available on Pro and Studio plans.</p>
          <Link
            href="/plan"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose to-rose-dark text-white font-semibold text-sm shadow-lg"
          >
            {t("plan.upgradePro")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-5 pt-6 pb-28 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/appointments"
          className="w-10 h-10 rounded-full bg-white/70 backdrop-blur-md border border-white/40 shadow-sm flex items-center justify-center text-plum-light hover:text-plum transition-all active:scale-90"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-plum tracking-tight">{t("checkout.title")}</h1>
          <p className="text-xs text-plum-light">Sofía Torres · Facial Treatment</p>
        </div>
      </div>

      {/* Order Summary */}
      <div className="glass-card-solid rounded-2xl p-5 premium-shadow">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-plum">Facial Treatment (1h 15min)</span>
            <span className="text-sm font-medium text-plum">€{subtotal.toFixed(2)}</span>
          </div>
          <div className="border-t border-rose-light/15 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-plum-light">{t("checkout.subtotal")}</span>
              <span className="text-xs text-plum-light">€{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-plum-light">{t("checkout.tax")} (21%)</span>
              <span className="text-xs text-plum-light">€{tax.toFixed(2)}</span>
            </div>
          </div>
          <div className="border-t border-rose-light/15 pt-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-plum">{t("checkout.total")}</span>
              <span className="font-bold text-xl text-rose">€{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div>
        <p className="text-xs font-medium text-plum-light uppercase tracking-wider mb-3">{t("checkout.selectMethod")}</p>
        <div className="grid grid-cols-3 gap-3">
          {methods.map((m) => {
            const Icon = m.icon;
            const isSelected = selectedMethod === m.key;
            return (
              <button
                key={m.key}
                onClick={() => setSelectedMethod(m.key)}
                className={`flex flex-col items-center gap-2 py-4 rounded-2xl transition-all duration-200 tap-scale ${
                  isSelected
                    ? "glass-card-solid ring-2 ring-rose/40 border-rose/30 shadow-md"
                    : "glass-card hover:border-rose/20"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${m.color}`}>
                  <Icon size={20} />
                </div>
                <span className="text-xs font-medium text-plum">{m.label}</span>
                {isSelected && (
                  <div className="w-4 h-4 rounded-full bg-rose flex items-center justify-center">
                    <Check size={10} className="text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Pay Button */}
      <button
        onClick={() => selectedMethod && setIsPaid(true)}
        disabled={!selectedMethod}
        className={`w-full py-4 rounded-xl font-bold text-sm shadow-lg transition-all active:scale-[0.98] ${
          selectedMethod
            ? "bg-gradient-to-r from-rose to-rose-dark text-white hover:shadow-xl"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        {t("checkout.payNow")} · €{total.toFixed(2)}
      </button>
    </div>
  );
}
