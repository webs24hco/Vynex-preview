"use client";

import { useState, useEffect } from "react";
import { todayAppointments as mockAppointments, weekOverview as mockWeekOverview } from "@/lib/mockData";
import {
  DollarSign,
  Clock,
  AlertCircle,
  CalendarPlus,
  MessageCircle,
  TrendingUp,
  ChevronRight,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

interface ReportsData {
  today: {
    revenue: number;
    appointmentsTotal: number;
    completedCount: number;
    pendingCount: number;
  };
  week: {
    revenue: number;
    overview: { day: string; appointments: number; revenue: number }[];
  };
}

export default function HomePage() {
  const { t } = useLanguage();
  const [reportsData, setReportsData] = useState<ReportsData | null>(null);
  const [businessName, setBusinessName] = useState("Valentina");
  const [currency, setCurrency] = useState("€");

  // Fetch real data from API on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const [reportsRes, businessRes] = await Promise.all([
          fetch("/api/reports"),
          fetch("/api/business"),
        ]);

        if (reportsRes.ok) {
          const data = await reportsRes.json();
          setReportsData(data);
        }

        if (businessRes.ok) {
          const biz = await businessRes.json();
          if (biz.businessName) setBusinessName(biz.businessName);
          if (biz.currency) {
            const currencySymbols: Record<string, string> = {
              USD: "$",
              EUR: "€",
              GBP: "£",
              MXN: "$",
            };
            setCurrency(currencySymbols[biz.currency] || biz.currency);
          }
        }
      } catch {
        // Silently fail - use fallback mock data
      }
    }
    fetchData();
  }, []);

  // Use real data if available, fallback to mock
  const totalRevenue = reportsData
    ? reportsData.today.revenue
    : mockAppointments.reduce((sum, a) => sum + a.price, 0);
  const completedCount = reportsData
    ? reportsData.today.completedCount
    : mockAppointments.filter((a) => a.status === "completed").length;
  const appointmentsTotal = reportsData
    ? reportsData.today.appointmentsTotal
    : mockAppointments.length;
  const pendingCount = reportsData
    ? reportsData.today.pendingCount
    : mockAppointments.filter((a) => a.status === "pending").length;
  const weekOverview = reportsData
    ? reportsData.week.overview
    : mockWeekOverview;
  const weekTotal = reportsData
    ? reportsData.week.revenue
    : mockWeekOverview.reduce((s, d) => s + d.revenue, 0);

  const nextAppointment = mockAppointments.find((a) => a.status === "confirmed");

  // Format today's date
  const todayFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="px-5 pt-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-plum-light font-medium">{todayFormatted}</p>
          <h1 className="text-2xl font-bold text-plum mt-1 tracking-tight">
            {t("home.greeting")} <span className="text-rose">{businessName}</span> ✨
          </h1>
          <p className="text-sm text-plum-light mt-1">
            {t("home.appointmentsToday", { count: appointmentsTotal })}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <Link
            href="/settings"
            className="w-9 h-9 rounded-full bg-white/70 backdrop-blur-md border border-white/40 shadow-sm flex items-center justify-center text-plum-light hover:text-rose hover:border-rose/30 transition-all duration-200 active:scale-95"
            aria-label="Settings"
          >
            <Settings size={16} strokeWidth={1.8} />
          </Link>
          <LanguageSwitcher />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={<DollarSign size={18} />}
          label={t("home.todaysRevenue")}
          value={`${currency}${totalRevenue}`}
          color="bg-rose/10 text-rose-dark"
        />
        <StatCard
          icon={<Clock size={18} />}
          label={t("home.completed")}
          value={`${completedCount}/${appointmentsTotal}`}
          color="bg-gold/30 text-plum"
        />
        <StatCard
          icon={<AlertCircle size={18} />}
          label={t("home.pending")}
          value={`${pendingCount} ${t("home.unconfirmed")}`}
          color="bg-rose-light/30 text-rose-dark"
        />
        <StatCard
          icon={<TrendingUp size={18} />}
          label={t("home.weekTotal")}
          value={`${currency}${weekTotal}`}
          color="bg-plum/5 text-plum"
        />
      </div>

      {/* Next Appointment */}
      {nextAppointment && (
        <div className="glass-card-solid rounded-2xl p-4 premium-shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-plum-light uppercase tracking-wider">{t("home.nextUp")}</h3>
            <span className="text-xs bg-rose/10 text-rose-dark px-2.5 py-0.5 rounded-full font-medium">
              {nextAppointment.time}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-rose/30 to-rose-light/40 flex items-center justify-center text-rose-dark font-bold text-sm shadow-sm">
              {nextAppointment.clientName.split(" ").map(n => n[0]).join("")}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-plum text-sm">{nextAppointment.clientName}</p>
              <p className="text-xs text-plum-light">{nextAppointment.service} · {nextAppointment.duration}</p>
            </div>
            <p className="font-bold text-rose text-sm">{currency}{nextAppointment.price}</p>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h3 className="text-xs font-semibold text-plum-light uppercase tracking-wider mb-3">{t("home.quickActions")}</h3>
        <div className="flex gap-3">
          <Link href="/appointments/new" className="flex-1 flex flex-col items-center gap-1.5 glass-card rounded-2xl py-3.5 tap-scale hover:border-rose/30 transition-all duration-200">
            <CalendarPlus size={20} className="text-rose" />
            <span className="text-[11px] font-medium text-plum">{t("home.newBooking")}</span>
          </Link>
          <Link href="/clients" className="flex-1 flex flex-col items-center gap-1.5 glass-card rounded-2xl py-3.5 tap-scale hover:border-rose/30 transition-all duration-200">
            <MessageCircle size={20} className="text-rose" />
            <span className="text-[11px] font-medium text-plum">{t("home.sendReminder")}</span>
          </Link>
          <Link href="/services" className="flex-1 flex flex-col items-center gap-1.5 glass-card rounded-2xl py-3.5 tap-scale hover:border-rose/30 transition-all duration-200">
            <DollarSign size={20} className="text-rose" />
            <span className="text-[11px] font-medium text-plum">{t("home.recordPayment")}</span>
          </Link>
        </div>
      </div>

      {/* Week Overview */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-plum-light uppercase tracking-wider">{t("home.weekOverview")}</h3>
          <Link href="/appointments" className="text-xs text-rose font-medium flex items-center gap-0.5">
            {t("home.viewAll")} <ChevronRight size={12} />
          </Link>
        </div>
        <div className="glass-card-solid rounded-2xl p-4 premium-shadow">
          <div className="flex items-end justify-between gap-2 h-24">
            {weekOverview.map((day) => {
              const maxRev = Math.max(...weekOverview.map(d => d.revenue));
              const height = maxRev > 0 ? (day.revenue / maxRev) * 100 : 0;
              const todayDay = new Date().toLocaleDateString("en-US", { weekday: "short" });
              const isToday = day.day === todayDay;
              return (
                <div key={day.day} className="flex flex-col items-center gap-1 flex-1">
                  <div className="w-full flex flex-col items-center justify-end h-16">
                    <div
                      className={`w-5 rounded-full transition-all ${isToday ? "bg-gradient-to-t from-rose to-rose-light" : "bg-rose-light/40"}`}
                      style={{ height: `${Math.max(height, 4)}%` }}
                    />
                  </div>
                  <span className={`text-[10px] font-medium ${isToday ? "text-rose" : "text-plum-light"}`}>
                    {day.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Today's Schedule Mini */}
      <div className="pb-4">
        <h3 className="text-xs font-semibold text-plum-light uppercase tracking-wider mb-3">{t("home.todaysSchedule")}</h3>
        <div className="space-y-2">
          {mockAppointments.map((appt, index) => (
            <div
              key={appt.id}
              className="flex items-center gap-3 glass-card rounded-2xl px-4 py-3 tap-scale animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="text-xs font-mono font-medium text-plum-light w-11">{appt.time}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-plum truncate">{appt.clientName}</p>
                <p className="text-xs text-plum-light truncate">{appt.service}</p>
              </div>
              <StatusBadge status={appt.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="glass-card-solid rounded-2xl p-3.5 premium-shadow tap-scale">
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${color} mb-2`}>
        {icon}
      </div>
      <p className="text-xs text-plum-light font-medium">{label}</p>
      <p className="text-base font-bold text-plum tracking-tight">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    confirmed: "bg-green-50/80 text-green-700 border border-green-200/50",
    pending: "bg-amber-50/80 text-amber-700 border border-amber-200/50",
    completed: "bg-plum/5 text-plum-light border border-plum/10",
  };
  return (
    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${styles[status as keyof typeof styles]}`}>
      {status}
    </span>
  );
}
