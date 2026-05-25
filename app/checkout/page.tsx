"use client";

import { useState, useEffect, Suspense } from "react";
import { ArrowLeft, Banknote, CreditCard, Building2, Check, Receipt, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { usePlan } from "@/context/PlanContext";

type PaymentMethod = "Cash" | "Card" | "Transfer";

interface AppointmentService {
  id: string;
  priceAtTimeOfBooking: number;
  service: {
    id: string;
    name: string;
    duration: number;
  };
}

interface AppointmentData {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  totalAmount: number;
  notes: string | null;
  client: {
    id: string;
    name: string;
    phone: string | null;
    email: string | null;
  };
  services: AppointmentService[];
  teamMember: {
    id: string;
    name: string;
    role: string;
  } | null;
}

function CheckoutContent() {
  const { t } = useLanguage();
  const { isPro } = usePlan();
  const searchParams = useSearchParams();
  const router = useRouter();
  const appointmentId = searchParams.get("appointmentId");

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [appointment, setAppointment] = useState<AppointmentData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch appointment details
  useEffect(() => {
    if (!appointmentId) {
      setError("No appointment ID provided");
      setIsLoading(false);
      return;
    }

    async function fetchAppointment() {
      try {
        const response = await fetch(`/api/appointments/${appointmentId}`);
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to fetch appointment");
        }
        const data = await response.json();
        setAppointment(data.appointment);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load appointment");
      } finally {
        setIsLoading(false);
      }
    }

    fetchAppointment();
  }, [appointmentId]);

  // Handle payment submission
  async function handlePayment() {
    if (!selectedMethod || !appointment) return;

    setIsProcessing(true);
    try {
      const response = await fetch(`/api/appointments/${appointment.id}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethod: selectedMethod,
          amountPaid: appointment.totalAmount,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Payment failed");
      }

      setIsPaid(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setIsProcessing(false);
    }
  }

  const methods = [
    { key: "Cash" as PaymentMethod, icon: Banknote, label: t("checkout.cash"), color: "text-green-600 bg-green-50" },
    { key: "Card" as PaymentMethod, icon: CreditCard, label: t("checkout.card"), color: "text-blue-600 bg-blue-50" },
    { key: "Transfer" as PaymentMethod, icon: Building2, label: t("checkout.transfer"), color: "text-purple-600 bg-purple-50" },
  ];

  // Success state
  if (isPaid && appointment) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="animate-scale-in text-center">
          <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-green-50 flex items-center justify-center">
            <Check size={40} className="text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-plum mb-2">{t("checkout.success")}</h1>
          <p className="text-plum-light text-sm mb-1">
            €{appointment.totalAmount.toFixed(2)} received via {selectedMethod}
          </p>
          <p className="text-xs text-plum-light">
            {appointment.client.name} · {appointment.services.map((s) => s.service.name).join(", ")}
          </p>

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

  // Pro plan gate
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

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-rose" />
      </div>
    );
  }

  // Error state
  if (error || !appointment) {
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
          <p className="text-sm text-red-500 mb-4">{error || "Appointment not found"}</p>
          <Link
            href="/appointments"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose to-rose-dark text-white font-semibold text-sm shadow-lg"
          >
            Back to Appointments
          </Link>
        </div>
      </div>
    );
  }

  const total = appointment.totalAmount;

  return (
    <div className="min-h-screen px-5 pt-6 pb-28 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href={`/appointments/${appointment.id}`}
          className="w-10 h-10 rounded-full bg-white/70 backdrop-blur-md border border-white/40 shadow-sm flex items-center justify-center text-plum-light hover:text-plum transition-all active:scale-90"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-plum tracking-tight">{t("checkout.title")}</h1>
          <p className="text-xs text-plum-light">
            {appointment.client.name} · {appointment.services.map((s) => s.service.name).join(", ")}
          </p>
        </div>
      </div>

      {/* Order Summary */}
      <div className="glass-card-solid rounded-2xl p-5 premium-shadow">
        <div className="space-y-3">
          {appointment.services.map((as) => (
            <div key={as.id} className="flex justify-between items-center">
              <span className="text-sm text-plum">
                {as.service.name} ({as.service.duration}min)
              </span>
              <span className="text-sm font-medium text-plum">€{as.priceAtTimeOfBooking.toFixed(2)}</span>
            </div>
          ))}
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

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-500 text-center">{error}</p>
      )}

      {/* Pay Button */}
      <button
        onClick={handlePayment}
        disabled={!selectedMethod || isProcessing}
        className={`w-full py-4 rounded-xl font-bold text-sm shadow-lg transition-all active:scale-[0.98] ${
          selectedMethod && !isProcessing
            ? "bg-gradient-to-r from-rose to-rose-dark text-white hover:shadow-xl"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        {isProcessing ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 size={16} className="animate-spin" />
            Processing...
          </span>
        ) : (
          `${t("checkout.payNow")} · €${total.toFixed(2)}`
        )}
      </button>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-rose" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
