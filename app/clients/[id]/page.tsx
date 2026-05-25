"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Phone, Mail, MessageCircle, Heart, Calendar, DollarSign, Edit3, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function ClientDetailPage() {
  const { t } = useLanguage();
  const params = useParams();
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClient() {
      try {
        const res = await fetch(`/api/clients/${params.id}`);
        const data = await res.json();
        if (data.client) {
          setClient(data.client);
        }
      } catch (error) {
        console.error("Error fetching client:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchClient();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-rose" size={32} />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-5 text-center bg-white">
        <h2 className="text-xl font-bold text-plum mb-2">Cliente no encontrado</h2>
        <Link href="/clients" className="text-rose font-medium underline">Volver a la lista</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-5 pt-6 pb-28 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/clients"
            className="w-10 h-10 rounded-full bg-white/70 backdrop-blur-md border border-white/40 shadow-sm flex items-center justify-center text-plum-light hover:text-plum transition-all active:scale-90"
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-lg font-bold text-plum tracking-tight">{t("clientDetail.title")}</h1>
        </div>
        <Link
          href={`/clients/${params.id}/edit`}
          className="w-9 h-9 rounded-full bg-white/70 backdrop-blur-md border border-white/40 shadow-sm flex items-center justify-center text-plum-light hover:text-rose transition-all active:scale-90"
        >
          <Edit3 size={16} />
        </Link>
      </div>

      {/* Client Card */}
      <div className="glass-card-solid rounded-2xl p-5 premium-shadow text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-rose/30 to-rose-light/40 flex items-center justify-center text-rose-dark font-bold text-xl shadow-md mb-3">
          {client.name.split(" ").map((n: string) => n[0]).join("")}
        </div>
        <h2 className="font-bold text-lg text-plum">{client.name}</h2>
        <p className="text-xs text-plum-light mt-1">
          {t("clientDetail.visits", { count: client.appointments?.length || 0 })}
        </p>
        <p className="text-xs text-plum-light">{client.email || "No email"}</p>

        {/* Quick Actions */}
        <div className="flex justify-center gap-4 mt-4">
          <button className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 shadow-sm">
              <Phone size={16} />
            </div>
            <span className="text-[10px] text-plum-light font-medium">{t("clientDetail.call")}</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm">
              <Mail size={16} />
            </div>
            <span className="text-[10px] text-plum-light font-medium">{t("clientDetail.email")}</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 shadow-sm">
              <MessageCircle size={16} />
            </div>
            <span className="text-[10px] text-plum-light font-medium">{t("clientDetail.whatsapp")}</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-rose/10 flex items-center justify-center text-rose shadow-sm">
              <Heart size={16} />
            </div>
            <span className="text-[10px] text-plum-light font-medium">{t("clientDetail.favorite")}</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card-solid rounded-2xl p-4 premium-shadow">
          <div className="flex items-center gap-2 mb-1">
            <Calendar size={14} className="text-rose" />
            <span className="text-xs text-plum-light font-medium">{t("clientDetail.lastVisit")}</span>
          </div>
          <p className="text-sm font-semibold text-plum">
            {client.appointments?.[0] ? new Date(client.appointments[0].date).toLocaleDateString() : "--"}
          </p>
        </div>
        <div className="glass-card-solid rounded-2xl p-4 premium-shadow">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign size={14} className="text-rose" />
            <span className="text-xs text-plum-light font-medium">{t("clientDetail.pendingBalance")}</span>
          </div>
          <p className={`text-sm font-semibold ${client.pendingBalance > 0 ? "text-amber-600" : "text-green-600"}`}>
            €{client.pendingBalance || 0}
          </p>
        </div>
      </div>

      {/* WhatsApp Reminder */}
      <div className="glass-card-solid rounded-2xl p-4 premium-shadow border border-green-200/30 bg-gradient-to-br from-green-50/30 to-transparent">
        <p className="text-xs font-semibold text-plum mb-2">{t("clientDetail.whatsappReminder")}</p>
        <p className="text-xs text-plum-light leading-relaxed">
          {t("clientDetail.reminderMsg", { name: client.name.split(" ")[0] })}
        </p>
        <button className="mt-3 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-500 text-white text-xs font-medium active:scale-95 transition-all shadow-md">
          <MessageCircle size={12} />
          {t("clientDetail.sendWhatsApp")}
        </button>
      </div>

      {/* Notes */}
      <div className="glass-card-solid rounded-2xl p-4 premium-shadow">
        <h3 className="text-xs font-semibold text-plum-light uppercase tracking-wider mb-2">{t("clientDetail.notes")}</h3>
        <p className="text-sm text-plum">{client.notes || "Sin notas registradas"}</p>
      </div>

      {/* Visit History */}
      <div>
        <h3 className="text-xs font-semibold text-plum-light uppercase tracking-wider mb-3">{t("clientDetail.visitHistory")}</h3>
        <div className="space-y-2">
          {client.appointments?.map((appt: any, i: number) => (
            <div key={i} className="glass-card rounded-xl px-4 py-3 flex items-center justify-between shadow-sm">
              <div>
                <p className="text-sm font-medium text-plum">
                  {appt.services.map((s: any) => s.service.name).join(", ")}
                </p>
                <p className="text-xs text-plum-light">{new Date(appt.date).toLocaleDateString()}</p>
              </div>
              <span className="text-sm font-bold text-rose">€{appt.totalAmount}</span>
            </div>
          ))}
          {(!client.appointments || client.appointments.length === 0) && (
            <p className="text-sm text-plum-light text-center py-6 glass-card rounded-xl">Aún no hay historial de visitas</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Link
          href="/appointments/new"
          className="flex-1 flex items-center justify-center py-3 rounded-xl bg-gradient-to-r from-rose to-rose-dark text-white font-semibold text-xs shadow-lg active:scale-[0.98] transition-all"
        >
          {t("clientDetail.scheduleAgain")}
        </Link>
        <Link
          href="/checkout"
          className="flex-1 flex items-center justify-center py-3 rounded-xl glass-card-solid border border-rose/20 text-rose font-semibold text-xs tap-scale shadow-sm"
        >
          {t("clientDetail.recordPayment")}
        </Link>
      </div>
    </div>
  );
}
