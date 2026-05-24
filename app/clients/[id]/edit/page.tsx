"use client";

import { useState } from "react";
import { ArrowLeft, User, Phone, Mail, Heart, Calendar, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { clients, services } from "@/lib/mockData";

export default function EditClientPage() {
  const { t } = useLanguage();
  const params = useParams();
  const client = clients.find((c) => c.id === params.id) || clients[0];
  const [firstName, lastName] = client.name.split(" ");

  const [formData, setFormData] = useState({
    firstName: firstName || "",
    lastName: lastName || "",
    phone: client.phone,
    email: client.email,
    birthday: "",
    preferredService: client.favoriteService,
    notes: client.notes,
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen px-5 pt-6 pb-28 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={`/clients/${params.id}`}
            className="w-10 h-10 rounded-full bg-white/70 backdrop-blur-md border border-white/40 shadow-sm flex items-center justify-center text-plum-light hover:text-plum transition-all active:scale-90"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-plum tracking-tight">{t("clients.editClient")}</h1>
            <p className="text-xs text-plum-light">{client.name}</p>
          </div>
        </div>
        <button className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-100 transition-all active:scale-90">
          <Trash2 size={16} />
        </button>
      </div>

      {/* Avatar */}
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose/30 to-rose-light/40 flex items-center justify-center text-rose-dark font-bold text-xl shadow-md">
          {client.name.split(" ").map((n) => n[0]).join("")}
        </div>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-plum-light uppercase tracking-wider mb-1.5 block">
              {t("clients.firstName")}
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
              className="w-full px-4 py-3 rounded-xl glass-card-solid border border-white/50 text-sm text-plum focus:outline-none focus:ring-2 focus:ring-rose/30 transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-plum-light uppercase tracking-wider mb-1.5 block">
              {t("clients.lastName")}
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
              className="w-full px-4 py-3 rounded-xl glass-card-solid border border-white/50 text-sm text-plum focus:outline-none focus:ring-2 focus:ring-rose/30 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-plum-light uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Phone size={12} /> {t("clients.phone")}
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            className="w-full px-4 py-3 rounded-xl glass-card-solid border border-white/50 text-sm text-plum focus:outline-none focus:ring-2 focus:ring-rose/30 transition-all"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-plum-light uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Mail size={12} /> {t("clients.email")}
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => updateField("email", e.target.value)}
            className="w-full px-4 py-3 rounded-xl glass-card-solid border border-white/50 text-sm text-plum focus:outline-none focus:ring-2 focus:ring-rose/30 transition-all"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-plum-light uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Calendar size={12} /> {t("clients.birthday")}
          </label>
          <input
            type="date"
            value={formData.birthday}
            onChange={(e) => updateField("birthday", e.target.value)}
            className="w-full px-4 py-3 rounded-xl glass-card-solid border border-white/50 text-sm text-plum focus:outline-none focus:ring-2 focus:ring-rose/30 transition-all"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-plum-light uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Heart size={12} /> {t("clients.preferredService")}
          </label>
          <select
            value={formData.preferredService}
            onChange={(e) => updateField("preferredService", e.target.value)}
            className="w-full px-4 py-3 rounded-xl glass-card-solid border border-white/50 text-sm text-plum focus:outline-none focus:ring-2 focus:ring-rose/30 transition-all appearance-none"
          >
            <option value="">Select service...</option>
            {services.map((s) => (
              <option key={s.id} value={s.name}>{s.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-plum-light uppercase tracking-wider mb-1.5 block">
            {t("clients.notes")}
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => updateField("notes", e.target.value)}
            placeholder={t("clients.notesPlaceholder")}
            rows={3}
            className="w-full px-4 py-3 rounded-xl glass-card-solid border border-white/50 text-sm text-plum placeholder:text-plum-light/50 focus:outline-none focus:ring-2 focus:ring-rose/30 transition-all resize-none"
          />
        </div>

        <Link
          href={`/clients/${params.id}`}
          className="w-full flex items-center justify-center py-3.5 rounded-xl bg-gradient-to-r from-rose to-rose-dark text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
        >
          {t("clients.save")}
        </Link>
      </div>
    </div>
  );
}
