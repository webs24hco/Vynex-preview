"use client";

import { ArrowLeft, Phone, Mail, MessageCircle, Heart, Calendar, DollarSign, Edit3 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { clients } from "@/lib/mockData";

export default function ClientDetailPage() {
  const { t } = useLanguage();
  const params = useParams();
  const client = clients.find((c) => c.id === params.id) || clients[0];

  const visitHistory = [
    { date: "May 24, 2026", service: "Balayage + Cut", price: 180 },
    { date: "Apr 28, 2026", service: client.favoriteService, price: 95 },
    { date: "Mar 15, 2026", service: "Blowout", price: 25 },
  ];

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
          {client.name.split(" ").map((n) => n[0]).join("")}
        </div>
        <h2 className="font-bold text-lg text-plum">{client.name}</h2>
        <p className="text-xs text-plum-light mt-1">
          {t("clientDetail.visits", { count: client.totalVisits })}
        </p>
        <p className="text-xs text-plum-light">{client.email}</p>

        {/* Quick Actions */}
        <div className="flex justify-center gap-4 mt-4">
          <button className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
              <Phone size={16} />
            </div>
            <span className="text-[10px] text-plum-light">{t("clientDetail.call")}</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Mail size={16} />
            </div>
            <span className="text-[10px] text-plum-light">{t("clientDetail.email")}</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
              <MessageCircle size={16} />
            </div>
            <span className="text-[10px] text-plum-light">{t("clientDetail.whatsapp")}</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-rose/10 flex items-center justify-center text-rose">
              <Heart size={16} />
            </div>
            <span className="text-[10px] text-plum-light">{t("clientDetail.favorite")}</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card-solid rounded-2xl p-4 premium-shadow">
          <div className="flex items-center gap-2 mb-1">
            <Calendar size={14} className="text-rose" />
            <span className="text-xs text-plum-light">{t("clientDetail.lastVisit")}</span>
          </div>
          <p className="text-sm font-semibold text-plum">{client.lastVisit}</p>
        </div>
        <div className="glass-card-solid rounded-2xl p-4 premium-shadow">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign size={14} className="text-rose" />
            <span className="text-xs text-plum-light">{t("clientDetail.pendingBalance")}</span>
          </div>
          <p className={`text-sm font-semibold ${client.pendingBalance > 0 ? "text-amber-600" : "text-green-600"}`}>
            €{client.pendingBalance}
          </p>
        </div>
      </div>

      {/* WhatsApp Reminder */}
      <div className="glass-card-solid rounded-2xl p-4 premium-shadow border border-green-200/30 bg-gradient-to-br from-green-50/30 to-transparent">
        <p className="text-xs font-semibold text-plum mb-2">{t("clientDetail.whatsappReminder")}</p>
        <p className="text-xs text-plum-light leading-relaxed">
          {t("clientDetail.reminderMsg", { name: client.name.split(" ")[0] })}
        </p>
        <button className="mt-3 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-500 text-white text-xs font-medium active:scale-95 transition-all">
          <MessageCircle size={12} />
          {t("clientDetail.sendWhatsApp")}
        </button>
      </div>

      {/* Notes */}
      <div className="glass-card-solid rounded-2xl p-4 premium-shadow">
        <h3 className="text-xs font-semibold text-plum-light uppercase tracking-wider mb-2">{t("clientDetail.notes")}</h3>
        <p className="text-sm text-plum">{client.notes}</p>
      </div>

      {/* Visit History */}
      <div>
        <h3 className="text-xs font-semibold text-plum-light uppercase tracking-wider mb-3">{t("clientDetail.visitHistory")}</h3>
        <div className="space-y-2">
          {visitHistory.map((visit, i) => (
            <div key={i} className="glass-card rounded-xl px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-plum">{visit.service}</p>
                <p className="text-xs text-plum-light">{visit.date}</p>
              </div>
              <span className="text-sm font-bold text-rose">€{visit.price}</span>
            </div>
          ))}
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
          className="flex-1 flex items-center justify-center py-3 rounded-xl glass-card-solid border border-rose/20 text-rose font-semibold text-xs tap-scale"
        >
          {t("clientDetail.recordPayment")}
        </Link>
      </div>
    </div>
  );
}
