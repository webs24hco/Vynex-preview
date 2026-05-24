"use client";

import { useState } from "react";
import { clients } from "@/lib/mockData";
import { Search, Star, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function ClientsPage() {
  const [search, setSearch] = useState("");

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-5 pt-6 space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-plum">Clients</h1>
        <p className="text-xs text-plum-light mt-0.5">{clients.length} total clients</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-plum-light" />
        <input
          type="text"
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-rose-light/30 text-sm text-plum placeholder:text-plum-light/60 focus:outline-none focus:border-rose focus:ring-1 focus:ring-rose/30 transition-colors"
        />
      </div>

      {/* Client List */}
      <div className="space-y-3">
        {filtered.map((client) => (
          <Link key={client.id} href={`/clients/${client.id}`}>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-rose-light/20 hover:border-rose/40 transition-colors mb-3">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-full bg-rose/15 flex items-center justify-center text-rose-dark font-bold text-sm shrink-0">
                  {client.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm text-plum">{client.name}</p>
                    {client.pendingBalance > 0 && (
                      <span className="flex items-center gap-0.5 text-[10px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
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
                  <p className="text-[11px] text-plum-light mt-1">Last visit: {client.lastVisit}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-plum-light">No clients found</p>
        </div>
      )}
    </div>
  );
}
