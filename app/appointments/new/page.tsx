"use client";

import { useState } from "react";
import { ArrowLeft, User, Scissors, Calendar, Clock, FileText } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { clients, services } from "@/lib/mockData";

export default function NewAppointmentPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [clientId, setClientId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  const handleSave = () => {
    // In a real app, save to DB
    router.push("/appointments");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-4">
        <Link
          href="/appointments"
          className="w-10 h-10 rounded-full bg-white/70 backdrop-blur-md border border-white/40 shadow-sm flex items-center justify-center text-plum-light hover:text-plum transition-all duration-200 active:scale-90"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-plum tracking-tight">
            {t("appt.newAppointment")}
          </h1>
          <p className="text-xs text-plum-light">{t("appt.newAppointmentDesc")}</p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 px-5 space-y-5 overflow-y-auto">
        {/* Client Selection */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-plum-light uppercase tracking-wider flex items-center gap-1.5">
            <User size={12} />
            {t("appt.selectClient")}
          </label>
          <select
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="w-full px-4 py-3.5 rounded-2xl bg-white/80 backdrop-blur-md border border-white/50 text-sm text-plum focus:outline-none focus:border-rose/40 focus:ring-2 focus:ring-rose/10 transition-all duration-200 shadow-sm appearance-none"
          >
            <option value="">{t("appt.selectClient")}</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>

        {/* Service Selection */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-plum-light uppercase tracking-wider flex items-center gap-1.5">
            <Scissors size={12} />
            {t("appt.selectService")}
          </label>
          <select
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            className="w-full px-4 py-3.5 rounded-2xl bg-white/80 backdrop-blur-md border border-white/50 text-sm text-plum focus:outline-none focus:border-rose/40 focus:ring-2 focus:ring-rose/10 transition-all duration-200 shadow-sm appearance-none"
          >
            <option value="">{t("appt.selectService")}</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} — €{service.price} ({service.duration})
              </option>
            ))}
          </select>
        </div>

        {/* Date & Time Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-plum-light uppercase tracking-wider flex items-center gap-1.5">
              <Calendar size={12} />
              {t("appt.date")}
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl bg-white/80 backdrop-blur-md border border-white/50 text-sm text-plum focus:outline-none focus:border-rose/40 focus:ring-2 focus:ring-rose/10 transition-all duration-200 shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-plum-light uppercase tracking-wider flex items-center gap-1.5">
              <Clock size={12} />
              {t("appt.time")}
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl bg-white/80 backdrop-blur-md border border-white/50 text-sm text-plum focus:outline-none focus:border-rose/40 focus:ring-2 focus:ring-rose/10 transition-all duration-200 shadow-sm"
            />
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-plum-light uppercase tracking-wider flex items-center gap-1.5">
            <FileText size={12} />
            {t("appt.notes")}
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t("appt.notesPlaceholder")}
            rows={3}
            className="w-full px-4 py-3.5 rounded-2xl bg-white/80 backdrop-blur-md border border-white/50 text-sm text-plum placeholder:text-plum-light/50 focus:outline-none focus:border-rose/40 focus:ring-2 focus:ring-rose/10 transition-all duration-200 shadow-sm resize-none"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="px-5 py-5 pb-28">
        <button
          onClick={handleSave}
          className="w-full py-4 bg-gradient-to-r from-rose to-rose-dark text-white text-sm font-semibold rounded-2xl hover:shadow-lg transition-all duration-200 active:scale-[0.97] shadow-md"
        >
          {t("appt.saveAppointment")}
        </button>
      </div>
    </div>
  );
}
