"use client";

import { useState } from "react";
import { allAppointments, Appointment } from "@/lib/mockData";
import { Plus, MessageCircle, Filter, Phone } from "lucide-react";

export default function AppointmentsPage() {
  const [filter, setFilter] = useState<string>("all");

  const filtered =
    filter === "all"
      ? allAppointments
      : allAppointments.filter((a) => a.status === filter);

  return (
    <div className="px-5 pt-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-plum">Appointments</h1>
          <p className="text-xs text-plum-light mt-0.5">Today · May 24, 2026</p>
        </div>
        <button className="w-9 h-9 rounded-full bg-rose/10 flex items-center justify-center text-rose">
          <Filter size={16} />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {["all", "confirmed", "pending", "completed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === f
                ? "bg-rose text-white"
                : "bg-white text-plum-light border border-rose-light/30 hover:border-rose"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Appointment Cards */}
      <div className="space-y-3">
        {filtered.map((appt) => (
          <AppointmentCard key={appt.id} appointment={appt} />
        ))}
      </div>

      {/* FAB */}
      <button className="fixed bottom-24 right-1/2 translate-x-[calc(50%+8rem)] w-14 h-14 bg-rose rounded-full shadow-lg flex items-center justify-center text-white hover:bg-rose-dark transition-colors z-40">
        <Plus size={24} />
      </button>
    </div>
  );
}

function AppointmentCard({ appointment }: { appointment: Appointment }) {
  const statusStyles = {
    confirmed: "border-l-green-400 bg-green-50/30",
    pending: "border-l-amber-400 bg-amber-50/30",
    completed: "border-l-plum-light/40 bg-plum/5",
  };

  const statusBadge = {
    confirmed: "bg-green-100 text-green-700",
    pending: "bg-amber-100 text-amber-700",
    completed: "bg-gray-100 text-gray-600",
  };

  return (
    <div
      className={`bg-white rounded-2xl p-4 shadow-sm border border-rose-light/20 border-l-4 ${statusStyles[appointment.status]}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-rose/15 flex items-center justify-center text-rose-dark font-bold text-xs">
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

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-rose-light/20">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-semibold text-plum">{appointment.time}</span>
          <span className="text-xs text-plum-light">{appointment.duration}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-rose">€{appointment.price}</span>
          {appointment.status !== "completed" && (
            <div className="flex gap-1.5">
              <button className="w-7 h-7 rounded-full bg-green-50 flex items-center justify-center text-green-600 hover:bg-green-100 transition-colors">
                <MessageCircle size={13} />
              </button>
              <button className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors">
                <Phone size={13} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
