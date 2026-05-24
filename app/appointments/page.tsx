"use client";

import { useState } from "react";
import { allAppointments, Appointment } from "@/lib/mockData";
import { Plus, MessageCircle, Filter, Phone } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function AppointmentsPage() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<string>("all");

  const filtered =
    filter === "all"
      ? allAppointments
      : allAppointments.filter((a) => a.status === filter);

  const filterTabs = [
    { key: "all", label: t("appt.all") },
    { key: "confirmed", label: t("appt.confirmed") },
    { key: "pending", label: t("appt.pending") },
    { key: "completed", label: t("appt.completed") },
  ];

  return (
    <div className="px-5 pt-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-plum tracking-tight">{t("appt.title")}</h1>
          <p className="text-xs text-plum-light mt-0.5">{t("appt.today")}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-full bg-white/70 backdrop-blur-md border border-white/40 shadow-sm flex items-center justify-center text-plum-light hover:text-rose transition-all duration-200 active:scale-95">
            <Filter size={16} />
          </button>
          <LanguageSwitcher />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {filterTabs.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap tap-scale ${
              filter === f.key
                ? "bg-rose text-white shadow-sm"
                : "glass-card text-plum-light hover:text-rose"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Appointment Cards */}
      <div className="space-y-3 pb-4">
        {filtered.map((appt, index) => (
          <div key={appt.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 60}ms` }}>
            <AppointmentCard appointment={appt} />
          </div>
        ))}
      </div>

      {/* FAB - links to new appointment page */}
      <Link
        href="/appointments/new"
        className="fixed bottom-24 right-1/2 translate-x-[calc(50%+7.5rem)] w-14 h-14 bg-gradient-to-br from-rose to-rose-dark rounded-full premium-shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-all duration-200 active:scale-90 z-40"
      >
        <Plus size={24} />
      </Link>
    </div>
  );
}

function AppointmentCard({ appointment }: { appointment: Appointment }) {
  const statusStyles = {
    confirmed: "border-l-green-400",
    pending: "border-l-amber-400",
    completed: "border-l-plum-light/40",
  };

  const statusBadge = {
    confirmed: "bg-green-50/80 text-green-700 border border-green-200/50",
    pending: "bg-amber-50/80 text-amber-700 border border-amber-200/50",
    completed: "bg-gray-50/80 text-gray-600 border border-gray-200/50",
  };

  return (
    <div
      className={`glass-card-solid rounded-2xl p-4 premium-shadow border-l-4 tap-scale ${statusStyles[appointment.status]}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose/25 to-rose-light/35 flex items-center justify-center text-rose-dark font-bold text-xs shadow-sm">
            {appointment.clientName.split(" ").map((n) => n[0]).join("")}
          </div>
          <div>
            <p className="font-semibold text-sm text-plum">{appointment.clientName}</p>
            <p className="text-xs text-plum-light">{appointment.service}</p>
          </div>
        </div>
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusBadge[appointment.status]}`}>
          {appointment.status}
        </span>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-rose-light/15">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-semibold text-plum">{appointment.time}</span>
          <span className="text-xs text-plum-light">{appointment.duration}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-rose">€{appointment.price}</span>
          {appointment.status !== "completed" && (
            <div className="flex gap-1.5">
              <button className="w-7 h-7 rounded-full bg-green-50/80 backdrop-blur-sm flex items-center justify-center text-green-600 hover:bg-green-100 transition-all duration-200 active:scale-90">
                <MessageCircle size={13} />
              </button>
              <button className="w-7 h-7 rounded-full bg-blue-50/80 backdrop-blur-sm flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-all duration-200 active:scale-90">
                <Phone size={13} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
