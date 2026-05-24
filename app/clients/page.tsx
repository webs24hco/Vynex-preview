"use client";

import { useState } from "react";
import { clients } from "@/lib/mockData";
import { Search, Star, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function ClientsPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-5 pt-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-plum tracking-tight">{t("clients.title")}</h1>
          <p className="text-xs text-plum-light mt-0.5">{t("clients.totalClients", { count: clients.length })}</p>
        </div>
        <LanguageSwitcher />
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-plum-light" />
        <input
          type="text"
          placeholder={t("clients.search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/80 backdrop-blur-md border border-white/50 text-sm text-plum placeholder:text-plum-light/60 focus:outline-none focus:border-rose/40 focus:ring-2 focus:ring-rose/10 transition-all duration-200 shadow-sm"
        />
      </div>

      {/* Client List */}
      <div className="space-y-3">
        {filtered.map((client, index) => (
          <Link key={client.id} href={`/clients/${client.id}`}>
            <div
              className="glass-card-solid rounded-2xl p-4 premium-shadow hover:border-rose/30 transition-all duration-200 tap-scale mb-3 animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-rose/25 to-rose-light/35 flex items-center justify-center text-rose-dark font-bold text-sm shrink-0 shadow-sm">
                  {client.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm text-plum">{client.name}</p>
                    {client.pendingBalance > 0 && (
                      <span className="flex items-center gap-0.5 text-[10px] font-medium text-amber-700 bg-amber-50/80 border border-amber-200/50 px-2 py-0.5 rounded-full">
                        <AlertCircle size={10} />
                        €{client.pendingBalance}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-0.5 text-[11px] text-plum-light">
                      <Star size={10} className="text-gold-dark" />
                      {client.favoriteService}
                    </span>
                  </div>
                  <p className="text-[11px] text-plum-light mt-1">{t("clients.lastVisit")} {client.lastVisit}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-plum-light">{t("clients.noResults")}</p>
        </div>
      )}
    </div>
  );
}
