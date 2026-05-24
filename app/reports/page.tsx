"use client";

import { useState } from "react";
import { ArrowLeft, TrendingUp, Users, Scissors, Lock, DollarSign, UserPlus, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { usePlan } from "@/context/PlanContext";
import { monthlyRevenue, topServicesData, clientRetentionData } from "@/lib/mockData";

type ReportTab = "revenue" | "clients" | "services";
type TimeRange = "daily" | "weekly" | "monthly";

export default function ReportsPage() {
  const { t } = useLanguage();
  const { isStudio } = usePlan();
  const [activeTab, setActiveTab] = useState<ReportTab>("revenue");
  const [timeRange, setTimeRange] = useState<TimeRange>("monthly");

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
          <h1 className="text-lg font-bold text-plum">{t("reports.title")}</h1>
        </div>

        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mb-4">
            <Lock size={28} className="text-blue-600" />
          </div>
          <h2 className="text-lg font-bold text-plum mb-2">{t("reports.studioRequired")}</h2>
          <p className="text-sm text-plum-light mb-6 max-w-xs">
            Advanced financial and client retention reports are available on the Studio plan.
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

  const tabs = [
    { key: "revenue" as ReportTab, label: t("reports.revenue"), icon: TrendingUp },
    { key: "clients" as ReportTab, label: t("reports.clients"), icon: Users },
    { key: "services" as ReportTab, label: t("reports.services"), icon: Scissors },
  ];

  const timeRanges = [
    { key: "daily" as TimeRange, label: t("reports.daily") },
    { key: "weekly" as TimeRange, label: t("reports.weekly") },
    { key: "monthly" as TimeRange, label: t("reports.monthly") },
  ];

  return (
    <div className="min-h-screen px-5 pt-6 pb-28 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/settings"
          className="w-10 h-10 rounded-full bg-white/70 backdrop-blur-md border border-white/40 shadow-sm flex items-center justify-center text-plum-light hover:text-plum transition-all active:scale-90"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-plum tracking-tight">{t("reports.title")}</h1>
          <p className="text-xs text-plum-light">{t("reports.subtitle")}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium transition-all tap-scale ${
                activeTab === tab.key
                  ? "bg-rose text-white shadow-sm"
                  : "glass-card text-plum-light hover:text-rose"
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Time Range */}
      <div className="flex gap-2 justify-center">
        {timeRanges.map((tr) => (
          <button
            key={tr.key}
            onClick={() => setTimeRange(tr.key)}
            className={`px-3.5 py-1.5 rounded-full text-[11px] font-medium transition-all tap-scale ${
              timeRange === tr.key
                ? "bg-plum text-white"
                : "text-plum-light hover:text-plum"
            }`}
          >
            {tr.label}
          </button>
        ))}
      </div>

      {/* Revenue Tab */}
      {activeTab === "revenue" && (
        <div className="space-y-4 animate-fade-in-up">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-card-solid rounded-2xl p-4 premium-shadow">
              <div className="w-8 h-8 rounded-xl bg-rose/10 flex items-center justify-center mb-2">
                <DollarSign size={16} className="text-rose" />
              </div>
              <p className="text-xs text-plum-light">{t("reports.totalRevenue")}</p>
              <p className="text-xl font-bold text-plum">€48,800</p>
              <span className="text-[10px] text-green-600 font-medium">↑ 12% vs last month</span>
            </div>
            <div className="glass-card-solid rounded-2xl p-4 premium-shadow">
              <div className="w-8 h-8 rounded-xl bg-gold/30 flex items-center justify-center mb-2">
                <Users size={16} className="text-plum" />
              </div>
              <p className="text-xs text-plum-light">{t("reports.avgPerClient")}</p>
              <p className="text-xl font-bold text-plum">€112</p>
              <span className="text-[10px] text-green-600 font-medium">↑ 5% vs last month</span>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="glass-card-solid rounded-2xl p-4 premium-shadow">
            <h3 className="text-xs font-semibold text-plum-light uppercase tracking-wider mb-4">Monthly Revenue</h3>
            <div className="flex items-end justify-between gap-3 h-32">
              {monthlyRevenue.map((m) => {
                const maxRev = Math.max(...monthlyRevenue.map((d) => d.revenue));
                const height = (m.revenue / maxRev) * 100;
                const isLast = m.month === "May";
                return (
                  <div key={m.month} className="flex flex-col items-center gap-1 flex-1">
                    <span className="text-[9px] font-medium text-plum-light">€{(m.revenue / 1000).toFixed(1)}k</span>
                    <div className="w-full flex flex-col items-center justify-end h-20">
                      <div
                        className={`w-full max-w-[24px] rounded-lg transition-all ${
                          isLast ? "bg-gradient-to-t from-rose to-rose-light" : "bg-rose-light/40"
                        }`}
                        style={{ height: `${height}%` }}
                      />
                    </div>
                    <span className={`text-[10px] font-medium ${isLast ? "text-rose" : "text-plum-light"}`}>
                      {m.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Clients Tab */}
      {activeTab === "clients" && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-card-solid rounded-2xl p-4 premium-shadow">
              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center mb-2">
                <UserPlus size={16} className="text-blue-600" />
              </div>
              <p className="text-xs text-plum-light">{t("reports.newClients")}</p>
              <p className="text-xl font-bold text-plum">{clientRetentionData.newThisMonth}</p>
              <span className="text-[10px] text-green-600 font-medium">This month</span>
            </div>
            <div className="glass-card-solid rounded-2xl p-4 premium-shadow">
              <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center mb-2">
                <RefreshCw size={16} className="text-green-600" />
              </div>
              <p className="text-xs text-plum-light">{t("reports.returnRate")}</p>
              <p className="text-xl font-bold text-plum">{clientRetentionData.returnRate}%</p>
              <span className="text-[10px] text-green-600 font-medium">↑ 3% vs last month</span>
            </div>
          </div>

          <div className="glass-card-solid rounded-2xl p-4 premium-shadow">
            <h3 className="text-xs font-semibold text-plum-light uppercase tracking-wider mb-3">Client Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-plum">Total Clients</span>
                <span className="font-bold text-plum">{clientRetentionData.totalClients}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-plum">Avg. Visits per Client</span>
                <span className="font-bold text-plum">{clientRetentionData.avgVisitsPerClient}</span>
              </div>
              <div className="w-full h-2 bg-rose-light/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose to-rose-dark rounded-full"
                  style={{ width: `${clientRetentionData.returnRate}%` }}
                />
              </div>
              <p className="text-[10px] text-plum-light text-center">
                {clientRetentionData.returnRate}% of clients return within 30 days
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Services Tab */}
      {activeTab === "services" && (
        <div className="space-y-3 animate-fade-in-up">
          <div className="glass-card-solid rounded-2xl p-4 premium-shadow">
            <h3 className="text-xs font-semibold text-plum-light uppercase tracking-wider mb-4">Top Performing Services</h3>
            <div className="space-y-3">
              {topServicesData.map((service, index) => {
                const maxRevenue = Math.max(...topServicesData.map((s) => s.revenue));
                const width = (service.revenue / maxRevenue) * 100;
                return (
                  <div key={service.name} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-plum-light w-4">{index + 1}</span>
                        <span className="text-sm font-medium text-plum">{service.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-rose">€{service.revenue.toLocaleString()}</span>
                        <span className="text-[10px] text-plum-light ml-1.5">{service.count} bookings</span>
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-rose-light/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-rose to-rose-dark rounded-full transition-all duration-500"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
