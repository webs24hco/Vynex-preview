"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Clock, DollarSign, User, Calendar, MessageCircle, Phone, CreditCard, RotateCcw, X, Loader2, Users } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { usePlan } from "@/context/PlanContext";

export default function AppointmentDetailPage() {
  const { t } = useLanguage();
  const { isStudio } = usePlan();
  const params = useParams();
  const id = params.id as string;
  
  const [appointment, setAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAppointment() {
      try {
        const res = await fetch(`/api/appointments/${id}`);
        if (!res.ok) throw new Error("Failed to fetch appointment");
        const data = await res.json();
        setAppointment(data.appointment);
      } catch (err) {
        console.error(err);
        setError("Cita no encontrada");
      } finally {
        setLoading(false);
      }
    }
    fetchAppointment();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-rose" size={32} />
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-5 text-center bg-white">
        <h2 className="text-xl font-bold text-plum mb-2">{error || "No se pudo cargar la cita"}</h2>
        <Link href="/appointments" className="text-rose font-medium underline">Volver a la agenda</Link>
      </div>
    );
  }

  const statusColors = {
    CONFIRMED: "bg-green-50 text-green-700 border-green-200",
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    COMPLETED: "bg-plum/5 text-plum-light border-plum/10",
    CANCELLED: "bg-rose-50 text-rose-700 border-rose-200",
  };

  const serviceNames = appointment.services.map((s: any) => s.service.name).join(", ");
  const totalDuration = appointment.services.reduce((sum: number, s: any) => sum + s.service.duration, 0);

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
          <p className="text-xs text-plum-light">{appointment.startTime} • {totalDuration}min</p>
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex justify-center">
        <span className={`px-4 py-1.5 rounded-full text-xs font-medium border ${statusColors[appointment.status as keyof typeof statusColors] || "bg-gray-50"}`}>
          {appointment.status.toLowerCase()}
        </span>
      </div>

      {/* Client Card */}
      <div className="glass-card-solid rounded-2xl p-5 premium-shadow">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-rose/25 to-rose-light/35 flex items-center justify-center text-rose-dark font-bold text-lg shadow-sm">
            {appointment.client.name.split(" ").map((n: string) => n[0]).join("")}
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-plum text-lg">{appointment.client.name}</h2>
            <p className="text-sm text-plum-light">{serviceNames}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-rose-light/15">
          <div className="text-center">
            <div className="w-10 h-10 mx-auto rounded-xl bg-rose/10 flex items-center justify-center mb-1">
              <Clock size={16} className="text-rose" />
            </div>
            <p className="text-xs text-plum-light">{totalDuration}min</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 mx-auto rounded-xl bg-rose/10 flex items-center justify-center mb-1">
              <DollarSign size={16} className="text-rose" />
            </div>
            <p className="text-xs font-semibold text-plum">€{appointment.totalAmount}</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 mx-auto rounded-xl bg-rose/10 flex items-center justify-center mb-1">
              <Calendar size={16} className="text-rose" />
            </div>
            <p className="text-xs text-plum-light">{new Date(appointment.date).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Assigned Team Member */}
      {appointment.teamMember && (
        <div className="glass-card-solid rounded-2xl p-4 premium-shadow">
          <p className="text-[10px] font-semibold text-plum-light uppercase tracking-wider mb-2">{t("appt.assignedTo")}</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-plum/10 flex items-center justify-center text-plum font-bold text-sm">
              {appointment.teamMember.name[0]}
            </div>
            <div>
              <p className="font-semibold text-plum text-sm">{appointment.teamMember.name}</p>
              <p className="text-xs text-plum-light capitalize">{appointment.teamMember.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Notes */}
      {appointment.notes && (
        <div className="glass-card-solid rounded-2xl p-4 premium-shadow">
          <p className="text-[10px] font-semibold text-plum-light uppercase tracking-wider mb-1">{t("appt.notes")}</p>
          <p className="text-sm text-plum">{appointment.notes}</p>
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
          <span className="text-xs font-medium text-plum">Llamar</span>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        {appointment.status !== "COMPLETED" && appointment.status !== "CANCELLED" && (
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

        {appointment.status !== "CANCELLED" && (
          <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl glass-card text-red-500 font-medium text-sm tap-scale hover:bg-red-50/50 transition-all">
            <X size={16} />
            {t("appt.cancel")}
          </button>
        )}
      </div>
    </div>
  );
}
