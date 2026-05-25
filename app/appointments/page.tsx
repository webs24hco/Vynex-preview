"use client";

import { useState, useEffect } from "react";
import { Plus, MessageCircle, Filter, Phone, Users } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { usePlan } from "@/context/PlanContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

interface AppointmentService {
  id: string;
  serviceId: string;
  priceAtTimeOfBooking: number;
  service: {
    name: string;
    duration: number;
  };
}

interface TeamMemberInfo {
  id: string;
  name: string;
  role: string;
  isActive: boolean;
}

interface AppointmentData {
  id: string;
  businessId: string;
  clientId: string;
  teamMemberId: string | null;
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
  };
  teamMember: TeamMemberInfo | null;
  services: AppointmentService[];
  createdAt: string;
  updatedAt: string;
}

export default function AppointmentsPage() {
  const { t } = useLanguage();
  const { isStudio } = usePlan();
  const [filter, setFilter] = useState<string>("all");
  const [teamFilter, setTeamFilter] = useState<string>("all");
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMemberInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const res = await fetch("/api/appointments");
        if (res.ok) {
          const data = await res.json();
          setAppointments(data.appointments || []);
        }
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAppointments();
  }, []);

  useEffect(() => {
    if (isStudio) {
      async function fetchTeam() {
        try {
          const res = await fetch("/api/team");
          if (res.ok) {
            const data = await res.json();
            setTeamMembers((data.teamMembers || []).filter((m: TeamMemberInfo) => m.isActive));
          }
        } catch (error) {
          console.error("Failed to fetch team members:", error);
        }
      }
      fetchTeam();
    }
  }, [isStudio]);

  let filtered =
    filter === "all"
      ? appointments
      : appointments.filter((a) => a.status.toLowerCase() === filter);

  if (teamFilter !== "all" && isStudio) {
    filtered = filtered.filter((a) => a.teamMemberId === teamFilter);
  }

  const filterTabs = [
    { key: "all", label: t("appt.all") },
    { key: "confirmed", label: t("appt.confirmed") },
    { key: "pending", label: t("appt.pending") },
    { key: "completed", label: t("appt.completed") },
  ];

  const memberColors = ["#DCAE96", "#7BA68C", "#C9A0DC", "#F0C27B", "#E8D5B7", "#A0C4DC", "#DC96B5"];

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

      {/* Team Filter (Studio only) */}
      {isStudio && (
        <div className="glass-card-solid rounded-xl p-3 premium-shadow">
          <div className="flex items-center gap-2 mb-2">
            <Users size={12} className="text-rose" />
            <span className="text-[10px] font-semibold text-plum-light uppercase tracking-wider">{t("appt.teamFilter")}</span>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setTeamFilter("all")}
              className={`px-3 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap transition-all tap-scale ${
                teamFilter === "all"
                  ? "bg-rose text-white shadow-sm"
                  : "bg-white/70 text-plum-light border border-white/50"
              }`}
            >
              {t("appt.allTeam")}
            </button>
            {teamMembers.map((member, index) => (
              <button
                key={member.id}
                onClick={() => setTeamFilter(member.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap transition-all tap-scale ${
                  teamFilter === member.id
                    ? "bg-rose text-white shadow-sm"
                    : "bg-white/70 text-plum-light border border-white/50"
                }`}
              >
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[8px] font-bold"
                  style={{ backgroundColor: memberColors[index % memberColors.length] }}
                >
                  {member.name[0]}
                </div>
                {member.name}
              </button>
            ))}
          </div>
        </div>
      )}

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
        {loading ? (
          <div className="text-center py-8 text-plum-light text-sm">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-8 text-plum-light text-sm">No appointments found</div>
        ) : (
          filtered.map((appt, index) => (
            <div key={appt.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 60}ms` }}>
              <AppointmentCard appointment={appt} isStudio={isStudio} />
            </div>
          ))
        )}
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

function AppointmentCard({ appointment, isStudio }: { appointment: AppointmentData; isStudio: boolean }) {
  const statusLower = appointment.status.toLowerCase() as "confirmed" | "pending" | "completed" | "cancelled";
  const serviceName = appointment.services.map((s) => s.service.name).join(", ");
  const totalDuration = appointment.services.reduce((sum, s) => sum + s.service.duration, 0);
  const durationStr = totalDuration >= 60
    ? `${Math.floor(totalDuration / 60)}h ${totalDuration % 60 > 0 ? `${totalDuration % 60}min` : ""}`
    : `${totalDuration}min`;

  const statusStyles = {
    confirmed: "border-l-green-400",
    pending: "border-l-amber-400",
    completed: "border-l-plum-light/40",
    cancelled: "border-l-red-400",
  };

  const statusBadge = {
    confirmed: "bg-green-50/80 text-green-700 border border-green-200/50",
    pending: "bg-amber-50/80 text-amber-700 border border-amber-200/50",
    completed: "bg-gray-50/80 text-gray-600 border border-gray-200/50",
    cancelled: "bg-red-50/80 text-red-600 border border-red-200/50",
  };

  return (
    <Link href={`/appointments/${appointment.id}`}>
      <div
        className={`glass-card-solid rounded-2xl p-4 premium-shadow border-l-4 tap-scale ${statusStyles[statusLower] || "border-l-gray-300"}`}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose/25 to-rose-light/35 flex items-center justify-center text-rose-dark font-bold text-xs shadow-sm">
              {appointment.client.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div>
              <p className="font-semibold text-sm text-plum">{appointment.client.name}</p>
              <p className="text-xs text-plum-light">{serviceName}</p>
              {isStudio && appointment.teamMember && (
                <p className="text-[10px] text-purple-600 font-medium mt-0.5 flex items-center gap-1">
                  <Users size={9} />
                  {appointment.teamMember.name}
                </p>
              )}
            </div>
          </div>
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusBadge[statusLower] || "bg-gray-50/80 text-gray-600"}`}>
            {statusLower}
          </span>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-rose-light/15">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-semibold text-plum">{appointment.startTime}</span>
            <span className="text-xs text-plum-light">{durationStr}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-rose">€{appointment.totalAmount}</span>
            {statusLower !== "completed" && (
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
    </Link>
  );
}
