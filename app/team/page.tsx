"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Plus, Lock, Users, Calendar, MoreVertical, Check } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { usePlan } from "@/context/PlanContext";

interface TeamMemberData {
  id: string;
  businessId: string;
  name: string;
  role: string;
  email: string | null;
  phone: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const roles = [
  { key: "barber", labelKey: "team.barber" },
  { key: "nailArtist", labelKey: "team.nailArtist" },
  { key: "lashTech", labelKey: "team.lashTech" },
  { key: "stylist", labelKey: "team.stylist" },
  { key: "esthetician", labelKey: "team.esthetician" },
];

const memberColors = ["#DCAE96", "#7BA68C", "#C9A0DC", "#F0C27B", "#E8D5B7", "#A0C4DC", "#DC96B5"];

export default function TeamPage() {
  const { t } = useLanguage();
  const { isStudio } = usePlan();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("stylist");
  const [teamMembers, setTeamMembers] = useState<TeamMemberData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchTeamMembers = useCallback(async () => {
    try {
      const res = await fetch("/api/team");
      if (res.ok) {
        const data = await res.json();
        setTeamMembers(data.teamMembers || []);
      }
    } catch (error) {
      console.error("Failed to fetch team members:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isStudio) {
      fetchTeamMembers();
    }
  }, [isStudio, fetchTeamMembers]);

  const handleAddMember = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim(), role: newRole }),
      });
      if (res.ok) {
        setNewName("");
        setNewRole("stylist");
        setShowAddForm(false);
        await fetchTeamMembers();
      }
    } catch (error) {
      console.error("Failed to add team member:", error);
    } finally {
      setSaving(false);
    }
  };

  const getColorForMember = (index: number) => {
    return memberColors[index % memberColors.length];
  };

  if (!isStudio) {
    return (
      <div className="min-h-screen px-5 pt-6 pb-28 space-y-5">
        <div className="flex items-center gap-3">
          <Link
            href="/settings"
            className="w-10 h-10 rounded-full bg-white/70 backdrop-blur-md border border-white/40 shadow-sm flex items-center justify-center text-plum-light hover:text-plum transition-all active:scale-90"
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-lg font-bold text-plum">{t("team.title")}</h1>
        </div>

        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center mb-4">
            <Lock size={28} className="text-purple-600" />
          </div>
          <h2 className="text-lg font-bold text-plum mb-2">{t("team.studioRequired")}</h2>
          <p className="text-sm text-plum-light mb-6 max-w-xs">
            Team management is available on the Studio plan. Manage up to 5 collaborators.
          </p>
          <Link
            href="/plan"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose to-rose-dark text-white font-semibold text-sm shadow-lg"
          >
            {t("plan.upgradeStudio")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-5 pt-6 pb-28 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/settings"
            className="w-10 h-10 rounded-full bg-white/70 backdrop-blur-md border border-white/40 shadow-sm flex items-center justify-center text-plum-light hover:text-plum transition-all active:scale-90"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-plum tracking-tight">{t("team.title")}</h1>
            <p className="text-xs text-plum-light">{t("team.members", { count: teamMembers.length })}</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-9 h-9 rounded-full bg-gradient-to-br from-rose to-rose-dark flex items-center justify-center text-white shadow-md active:scale-90 transition-all"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Add Member Form */}
      {showAddForm && (
        <div className="glass-card-solid rounded-2xl p-4 premium-shadow border border-rose/20 animate-scale-in">
          <h3 className="text-sm font-semibold text-plum mb-3">{t("team.addMember")}</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={t("team.name")}
              className="w-full px-4 py-3 rounded-xl glass-card border border-white/50 text-sm text-plum placeholder:text-plum-light/50 focus:outline-none focus:ring-2 focus:ring-rose/30 transition-all"
            />
            <div>
              <label className="text-xs font-medium text-plum-light uppercase tracking-wider mb-1.5 block">
                {t("team.role")}
              </label>
              <div className="flex flex-wrap gap-2">
                {roles.map((r) => (
                  <button
                    key={r.key}
                    onClick={() => setNewRole(r.key)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all tap-scale ${
                      newRole === r.key
                        ? "bg-rose text-white shadow-sm"
                        : "glass-card text-plum-light hover:text-rose"
                    }`}
                  >
                    {t(r.labelKey)}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={handleAddMember}
              disabled={saving || !newName.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-rose to-rose-dark text-white font-semibold text-sm shadow-lg active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {saving ? "Saving..." : t("team.addMember")}
            </button>
          </div>
        </div>
      )}

      {/* Team Members */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8 text-plum-light text-sm">Loading...</div>
        ) : teamMembers.length === 0 ? (
          <div className="text-center py-8 text-plum-light text-sm">
            No team members yet. Add your first collaborator!
          </div>
        ) : (
          teamMembers.map((member, index) => (
            <div
              key={member.id}
              className="glass-card-solid rounded-2xl p-4 premium-shadow tap-scale animate-fade-in-up"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md"
                    style={{ backgroundColor: getColorForMember(index) }}
                  >
                    {member.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-plum text-sm">{member.name}</p>
                    <p className="text-xs text-plum-light capitalize">
                      {t(`team.${member.role}`) !== `team.${member.role}` ? t(`team.${member.role}`) : member.role}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    member.isActive
                      ? "bg-green-50 text-green-700 border border-green-200/50"
                      : "bg-gray-50 text-gray-500 border border-gray-200/50"
                  }`}>
                    {member.isActive && <Check size={8} />}
                    {member.isActive ? t("team.active") : "Inactive"}
                  </span>
                  <button className="w-7 h-7 rounded-full bg-white/70 flex items-center justify-center text-plum-light hover:text-rose transition-all active:scale-90">
                    <MoreVertical size={14} />
                  </button>
                </div>
              </div>

              {/* Mini schedule preview */}
              <div className="mt-3 pt-3 border-t border-rose-light/15">
                <div className="flex items-center gap-2">
                  <Calendar size={12} className="text-plum-light" />
                  <span className="text-[10px] text-plum-light">
                    {member.isActive ? "Today: 3 appointments · Next: 11:30 AM" : "No schedule"}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
