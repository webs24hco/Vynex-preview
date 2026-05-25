"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, User, Scissors, Calendar, Clock, FileText, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { usePlan } from "@/context/PlanContext";

interface ClientData {
  id: string;
  name: string;
  phone: string | null;
}

interface ServiceData {
  id: string;
  name: string;
  duration: number;
  price: number;
  category: string | null;
}

interface TeamMemberData {
  id: string;
  name: string;
  role: string;
  isActive: boolean;
}

export default function NewAppointmentPage() {
  const { t } = useLanguage();
  const { isStudio } = usePlan();
  const router = useRouter();
  const [clientId, setClientId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [teamMemberId, setTeamMemberId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const [clients, setClients] = useState<ClientData[]>([]);
  const [services, setServices] = useState<ServiceData[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMemberData[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [clientsRes, servicesRes] = await Promise.all([
          fetch("/api/clients"),
          fetch("/api/services"),
        ]);
        if (clientsRes.ok) {
          const data = await clientsRes.json();
          setClients(data.clients || []);
        }
        if (servicesRes.ok) {
          const data = await servicesRes.json();
          setServices(data.services || []);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (isStudio) {
      async function fetchTeam() {
        try {
          const res = await fetch("/api/team");
          if (res.ok) {
            const data = await res.json();
            setTeamMembers((data.teamMembers || []).filter((m: TeamMemberData) => m.isActive));
          }
        } catch (error) {
          console.error("Failed to fetch team members:", error);
        }
      }
      fetchTeam();
    }
  }, [isStudio]);

  const handleSave = async () => {
    if (!clientId || !serviceId || !date || !time) return;

    setSaving(true);
    const selectedService = services.find((s) => s.id === serviceId);
    if (!selectedService) return;

    // Calculate end time based on service duration
    const [hours, minutes] = time.split(":").map(Number);
    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + selectedService.duration;
    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    const endTime = `${endHours.toString().padStart(2, "0")}:${endMins.toString().padStart(2, "0")}`;

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          teamMemberId: teamMemberId || null,
          date,
          startTime: time,
          endTime,
          notes: notes || null,
          serviceIds: [{ serviceId: selectedService.id, price: selectedService.price }],
        }),
      });

      if (res.ok) {
        router.push("/appointments");
      }
    } catch (error) {
      console.error("Failed to create appointment:", error);
    } finally {
      setSaving(false);
    }
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
                {service.name} — €{service.price} ({service.duration}min)
              </option>
            ))}
          </select>
        </div>

        {/* Team Member Selection (Studio plan only) */}
        {isStudio && teamMembers.length > 0 && (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-plum-light uppercase tracking-wider flex items-center gap-1.5">
              <Users size={12} />
              {t("appt.assignTeamMember") || "Assign Team Member"}
            </label>
            <select
              value={teamMemberId}
              onChange={(e) => setTeamMemberId(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl bg-white/80 backdrop-blur-md border border-white/50 text-sm text-plum focus:outline-none focus:border-rose/40 focus:ring-2 focus:ring-rose/10 transition-all duration-200 shadow-sm appearance-none"
            >
              <option value="">{t("appt.noTeamMember") || "No team member (optional)"}</option>
              {teamMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} — {member.role}
                </option>
              ))}
            </select>
          </div>
        )}

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
          disabled={saving || !clientId || !serviceId || !date || !time}
          className="w-full py-4 bg-gradient-to-r from-rose to-rose-dark text-white text-sm font-semibold rounded-2xl hover:shadow-lg transition-all duration-200 active:scale-[0.97] shadow-md disabled:opacity-50"
        >
          {saving ? "Saving..." : t("appt.saveAppointment")}
        </button>
      </div>
    </div>
  );
}
