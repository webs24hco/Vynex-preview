"use client";

import { useState } from "react";
import { clients } from "@/lib/mockData";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function ClientsPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-5 pt-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-plum tracking-tight">{t("clients.title")}</h1>
          <p className="text-xs text-plum-light mt-0.5">
            {t("clients.totalClients", { count: clients.length })}
          </p>
        </div>
        <Link
          href="/clients/new"
          className="w-9 h-9 rounded-full bg-gradient-to-br from-rose to-rose-dark flex items-center justify-center text-white shadow-md active:scale-90 transition-all"
        >
          <Plus size={16} />
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-plum-light/50" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("clients.search")}
          className="w-full pl-10 pr-4 py-3 rounded-xl glass-card-solid border border-white/50 text-sm text-plum placeholder:text-plum-light/50 focus:outline-none focus:ring-2 focus:ring-rose/30 transition-all"
        />
      </div>

      {/* Client List */}
      <div className="space-y-3 pb-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-plum-light">{t("clients.noResults")}</p>
          </div>
        ) : (
          filtered.map((client, index) => (
            <Link
              key={client.id}
              href={`/clients/${client.id}`}
              className="block animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="glass-card-solid rounded-2xl p-4 premium-shadow tap-scale">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-rose/25 to-rose-light/35 flex items-center justify-center text-rose-dark font-bold text-sm shadow-sm">
                    {client.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-plum">{client.name}</p>
                    <p className="text-xs text-plum-light truncate">
                      {client.favoriteService} · {t("clients.lastVisit")} {client.lastVisit}
                    </p>
                  </div>
                  {client.pendingBalance > 0 && (
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                      €{client.pendingBalance}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
