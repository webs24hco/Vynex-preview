"use client";

import { useState } from "react";
import { ArrowLeft, Plus, Lock, Users, Calendar, MoreVertical, Check } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { usePlan } from "@/context/PlanContext";
import { teamMembers } from "@/lib/mockData";

const roles = [
  { key: "barber", labelKey: "team.barber" },
  { key: "nailArtist", labelKey: "team.nailArtist" },
  { key: "lashTech", labelKey: "team.lashTech" },
  { key: "stylist", labelKey: "team.stylist" },
  { key: "esthetician", labelKey: "team.esthetician" },
];

export default function TeamPage() {
  const { t } = useLanguage();
  const { isStudio } = usePlan();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("stylist");

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
              onClick={() => setShowAddForm(false)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-rose to-rose-dark text-white font-semibold text-sm shadow-lg active:scale-[0.98] transition-all"
            >
              {t("team.addMember")}
            </button>
          </div>
        </div>
      )}

      {/* Team Members */}
      <div className="space-y-3">
        {teamMembers.map((member, index) => (
          <div
            key={member.id}
            className="glass-card-solid rounded-2xl p-4 premium-shadow tap-scale animate-fade-in-up"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md"
                  style={{ backgroundColor: member.color }}
                >
                  {member.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-plum text-sm">{member.name}</p>
                  <p className="text-xs text-plum-light capitalize">
                    {t(`team.${member.role}`)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                  member.active
                    ? "bg-green-50 text-green-700 border border-green-200/50"
                    : "bg-gray-50 text-gray-500 border border-gray-200/50"
                }`}>
                  {member.active && <Check size={8} />}
                  {member.active ? t("team.active") : "Inactive"}
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
                  {member.active ? "Today: 3 appointments · Next: 11:30 AM" : "No schedule"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
