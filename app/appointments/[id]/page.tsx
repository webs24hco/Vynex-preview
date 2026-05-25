"use client";

import { ArrowLeft, Clock, DollarSign, User, Calendar, MessageCircle, Phone, CreditCard, RotateCcw, X } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { allAppointments, teamMembers } from "@/lib/mockData";

export default function AppointmentDetailPage() {
  const { t } = useLanguage();
  const params = useParams();
  const id = params.id as string;
  const appointment = allAppointments.find((a) => a.id === id) || allAppointments[0];
  const assignedMember = teamMembers.find((m) => m.id === appointment.assignedTo);

  const statusColors = {
    confirmed: "bg-green-50 text-green-700 border-green-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    completed: "bg-gray-50 text-gray-600 border-gray-200",
  };

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
          <h1 className="text-lg font-bold text-plum tracking-tight">{t("appt.detail")}</h1>
          <p className="text-xs text-plum-light">{appointment.time} · {appointment.duration}</p>
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex justify-center">
        <span className={`px-4 py-1.5 rounded-full text-sm font-medium border ${statusColors[appointment.status]}`}>
          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
        </span>
      </div>

      {/* Client Card */}
      <div className="glass-card-solid rounded-2xl p-5 premium-shadow">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-rose/25 to-rose-light/35 flex items-center justify-center text-rose-dark font-bold text-lg shadow-sm">
            {appointment.clientName.split(" ").map((n) => n[0]).join("")}
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-plum text-lg">{appointment.clientName}</h2>
            <p className="text-sm text-plum-light">{appointment.service}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-rose-light/15">
          <div className="text-center">
            <div className="w-10 h-10 mx-auto rounded-xl bg-rose/10 flex items-center justify-center mb-1">
              <Clock size={16} className="text-rose" />
            </div>
            <p className="text-xs text-plum-light">{appointment.duration}</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 mx-auto rounded-xl bg-rose/10 flex items-center justify-center mb-1">
              <DollarSign size={16} className="text-rose" />
            </div>
            <p className="text-xs font-semibold text-plum">€{appointment.price}</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 mx-auto rounded-xl bg-rose/10 flex items-center justify-center mb-1">
              <Calendar size={16} className="text-rose" />
            </div>
            <p className="text-xs text-plum-light">{appointment.time}</p>
          </div>
        </div>
      </div>

      {/* Assigned Team Member */}
      {assignedMember && (
        <div className="glass-card-solid rounded-2xl p-4 premium-shadow">
          <p className="text-xs font-medium text-plum-light uppercase tracking-wider mb-2">{t("appt.assignedTo")}</p>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: assignedMember.color }}
            >
              {assignedMember.name[0]}
            </div>
            <div>
              <p className="font-semibold text-plum text-sm">{assignedMember.name}</p>
              <p className="text-xs text-plum-light capitalize">{assignedMember.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Contact */}
      <div className="flex gap-3">
        <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl glass-card tap-scale hover:border-green-300 transition-all">
          <MessageCircle size={16} className="text-green-600" />
          <span className="text-xs font-medium text-plum">WhatsApp</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl glass-card tap-scale hover:border-blue-300 transition-all">
          <Phone size={16} className="text-blue-600" />
          <span className="text-xs font-medium text-plum">Call</span>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        {appointment.status !== "completed" && (
          <Link
            href={`/checkout?appointmentId=${id}`}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-rose to-rose-dark text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
          >
            <CreditCard size={16} />
            {t("appt.checkout")}
          </Link>
        )}

        <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl glass-card-solid border border-rose/20 text-rose font-semibold text-sm tap-scale hover:bg-rose/5 transition-all">
          <RotateCcw size={16} />
          {t("appt.reschedule")}
        </button>

        <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl glass-card text-red-500 font-medium text-sm tap-scale hover:bg-red-50/50 transition-all">
          <X size={16} />
          {t("appt.cancel")}
        </button>
      </div>
    </div>
  );
}
