"use client";

import { use } from "react";
import { clients } from "@/lib/mockData";
import {
  ArrowLeft,
  Phone,
  Mail,
  MessageCircle,
  CalendarPlus,
  CreditCard,
  Star,
  Clock,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t } = useLanguage();
  const client = clients.find((c) => c.id === id);

  if (!client) {
    return (
      <div className="px-5 pt-6">
        <p className="text-plum-light">Client not found</p>
      </div>
    );
  }

  const mockHistory = [
    { date: "May 24, 2026", service: "Balayage + Cut", price: 180 },
    { date: "Apr 28, 2026", service: "Root Touch-up", price: 90 },
    { date: "Mar 15, 2026", service: "Balayage", price: 150 },
  ];

  return (
    <div className="px-5 pt-6 space-y-5 pb-4">
      {/* Back + Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/clients" className="w-9 h-9 rounded-full bg-white/70 backdrop-blur-md border border-white/40 shadow-sm flex items-center justify-center text-plum-light hover:text-plum transition-all duration-200 active:scale-90">
            <ArrowLeft size={16} />
          </Link>
          <h1 className="text-lg font-bold text-plum tracking-tight">{t("clientDetail.title")}</h1>
        </div>
        <LanguageSwitcher />
      </div>

      {/* Profile Card */}
      <div className="glass-card-solid rounded-3xl p-6 premium-shadow-lg text-center">
        <div className="w-18 h-18 rounded-full bg-gradient-to-br from-rose/30 to-rose-light/40 flex items-center justify-center text-rose-dark font-bold text-xl mx-auto shadow-md" style={{ width: '4.5rem', height: '4.5rem' }}>
          {client.name.split(" ").map((n) => n[0]).join("")}
        </div>
        <h2 className="font-bold text-lg text-plum mt-3 tracking-tight">{client.name}</h2>
        <p className="text-xs text-plum-light mt-1">{t("clientDetail.visits", { count: client.totalVisits })}</p>

        <div className="flex items-center justify-center gap-5 mt-5">
          <a href={`tel:${client.phone}`} className="flex flex-col items-center gap-1.5 tap-scale">
            <div className="w-11 h-11 rounded-full bg-blue-50/80 backdrop-blur-sm border border-blue-100/50 flex items-center justify-center text-blue-600 shadow-sm">
              <Phone size={16} />
            </div>
            <span className="text-[10px] text-plum-light font-medium">{t("clientDetail.call")}</span>
          </a>
          <a href={`mailto:${client.email}`} className="flex flex-col items-center gap-1.5 tap-scale">
            <div className="w-11 h-11 rounded-full bg-rose/10 backdrop-blur-sm border border-rose-light/30 flex items-center justify-center text-rose shadow-sm">
              <Mail size={16} />
            </div>
            <span className="text-[10px] text-plum-light font-medium">{t("clientDetail.email")}</span>
          </a>
          <button className="flex flex-col items-center gap-1.5 tap-scale">
            <div className="w-11 h-11 rounded-full bg-green-50/80 backdrop-blur-sm border border-green-100/50 flex items-center justify-center text-green-600 shadow-sm">
              <MessageCircle size={16} />
            </div>
            <span className="text-[10px] text-plum-light font-medium">{t("clientDetail.whatsapp")}</span>
          </button>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card-solid rounded-2xl p-3.5 premium-shadow">
          <Star size={14} className="text-gold-dark mb-1.5" />
          <p className="text-[10px] text-plum-light font-medium">{t("clientDetail.favorite")}</p>
          <p className="text-xs font-semibold text-plum mt-0.5">{client.favoriteService}</p>
        </div>
        <div className="glass-card-solid rounded-2xl p-3.5 premium-shadow">
          <Clock size={14} className="text-rose mb-1.5" />
          <p className="text-[10px] text-plum-light font-medium">{t("clientDetail.lastVisit")}</p>
          <p className="text-xs font-semibold text-plum mt-0.5">{client.lastVisit}</p>
        </div>
      </div>

      {/* Pending Balance */}
      {client.pendingBalance > 0 && (
        <div className="bg-amber-50/80 backdrop-blur-sm rounded-2xl p-4 border border-amber-200/40 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-amber-800">{t("clientDetail.pendingBalance")}</p>
              <p className="text-lg font-bold text-amber-900">€{client.pendingBalance}</p>
            </div>
            <button className="px-3.5 py-2 bg-amber-600 text-white text-xs font-medium rounded-xl hover:bg-amber-700 transition-all duration-200 active:scale-95 shadow-sm">
              {t("clientDetail.markPaid")}
            </button>
          </div>
        </div>
      )}

      {/* WhatsApp Message Preview */}
      <div className="glass-card-solid rounded-2xl p-4 premium-shadow">
        <h3 className="text-xs font-semibold text-plum-light uppercase tracking-wider mb-3">{t("clientDetail.whatsappReminder")}</h3>
        <div className="bg-green-50/70 rounded-xl p-3.5 border border-green-200/40">
          <p className="text-xs text-green-900 leading-relaxed">
            {t("clientDetail.reminderMsg", { name: client.name.split(" ")[0] })}
          </p>
        </div>
        <button className="w-full mt-3 py-2.5 bg-green-600 text-white text-xs font-medium rounded-xl hover:bg-green-700 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-1.5 shadow-sm">
          <MessageCircle size={14} />
          {t("clientDetail.sendWhatsApp")}
        </button>
      </div>

      {/* Notes */}
      <div className="glass-card-solid rounded-2xl p-4 premium-shadow">
        <div className="flex items-center gap-1.5 mb-2">
          <FileText size={14} className="text-plum-light" />
          <h3 className="text-xs font-semibold text-plum-light uppercase tracking-wider">{t("clientDetail.notes")}</h3>
        </div>
        <p className="text-sm text-plum leading-relaxed">{client.notes}</p>
      </div>

      {/* Appointment History */}
      <div>
        <h3 className="text-xs font-semibold text-plum-light uppercase tracking-wider mb-3">{t("clientDetail.visitHistory")}</h3>
        <div className="space-y-2">
          {mockHistory.map((visit, i) => (
            <div key={i} className="flex items-center justify-between glass-card rounded-2xl px-4 py-3 tap-scale">
              <div>
                <p className="text-sm font-medium text-plum">{visit.service}</p>
                <p className="text-[11px] text-plum-light">{visit.date}</p>
              </div>
              <span className="text-sm font-semibold text-rose">€{visit.price}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button className="flex-1 py-3 bg-gradient-to-r from-rose to-rose-dark text-white text-xs font-medium rounded-2xl hover:shadow-lg transition-all duration-200 active:scale-[0.97] flex items-center justify-center gap-1.5 shadow-sm">
          <CalendarPlus size={14} />
          {t("clientDetail.scheduleAgain")}
        </button>
        <button className="flex-1 py-3 glass-card text-plum text-xs font-medium rounded-2xl hover:border-rose/30 transition-all duration-200 active:scale-[0.97] flex items-center justify-center gap-1.5">
          <CreditCard size={14} />
          {t("clientDetail.recordPayment")}
        </button>
      </div>
    </div>
  );
}
