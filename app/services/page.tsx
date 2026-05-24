"use client";

import { useState } from "react";
import { services } from "@/lib/mockData";
import { Plus, Edit3, Clock, Tag } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function ServicesPage() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [editingId, setEditingId] = useState<string | null>(null);

  const categories = ["all", ...Array.from(new Set(services.map((s) => s.category)))];

  const filtered =
    selectedCategory === "all"
      ? services
      : services.filter((s) => s.category === selectedCategory);

  return (
    <div className="px-5 pt-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-plum tracking-tight">{t("services.title")}</h1>
          <p className="text-xs text-plum-light mt-0.5">{t("services.listed", { count: services.length })}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/services/new"
            className="w-9 h-9 rounded-full bg-gradient-to-br from-rose to-rose-dark flex items-center justify-center text-white shadow-sm hover:shadow-md transition-all duration-200 active:scale-90"
          >
            <Plus size={18} />
          </Link>
          <LanguageSwitcher />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 tap-scale ${
              selectedCategory === cat
                ? "bg-rose text-white shadow-sm"
                : "glass-card text-plum-light hover:text-rose"
            }`}
          >
            {cat === "all" ? t("services.all") : cat}
          </button>
        ))}
      </div>

      {/* Service Cards */}
      <div className="space-y-3 pb-4">
        {filtered.map((service, index) => (
          <div
            key={service.id}
            className={`glass-card-solid rounded-2xl p-4 premium-shadow transition-all duration-200 tap-scale animate-fade-in-up ${
              editingId === service.id ? "ring-2 ring-rose/20 border-rose/30" : ""
            }`}
            style={{ animationDelay: `${index * 40}ms` }}
          >
            {editingId === service.id ? (
              /* Edit State */
              <div className="space-y-2.5">
                <input
                  defaultValue={service.name}
                  className="w-full px-3 py-2 rounded-xl bg-ivory/60 border border-rose-light/30 text-sm font-medium text-plum focus:outline-none focus:border-rose/40 transition-all"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    defaultValue={service.duration}
                    className="px-3 py-2 rounded-xl bg-ivory/60 border border-rose-light/30 text-sm text-plum focus:outline-none focus:border-rose/40 transition-all"
                  />
                  <input
                    defaultValue={`€${service.price}`}
                    className="px-3 py-2 rounded-xl bg-ivory/60 border border-rose-light/30 text-sm text-plum focus:outline-none focus:border-rose/40 transition-all"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex-1 py-2 bg-rose text-white text-xs font-medium rounded-xl active:scale-95 transition-all"
                  >
                    {t("services.save")}
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex-1 py-2 bg-ivory/60 text-plum-light text-xs font-medium rounded-xl border border-rose-light/30 active:scale-95 transition-all"
                  >
                    {t("services.cancel")}
                  </button>
                </div>
              </div>
            ) : (
              /* View State */
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm text-plum">{service.name}</p>
                    <span className="text-[10px] bg-rose/10 text-rose-dark px-2 py-0.5 rounded-full font-medium">
                      {service.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="flex items-center gap-1 text-xs text-plum-light">
                      <Clock size={11} />
                      {service.duration}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-plum-light">
                      <Tag size={11} />
                      €{service.price}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-rose">€{service.price}</span>
                  <button
                    onClick={() => setEditingId(service.id)}
                    className="w-8 h-8 rounded-full bg-rose/10 backdrop-blur-sm flex items-center justify-center text-rose hover:bg-rose/20 transition-all duration-200 active:scale-90"
                  >
                    <Edit3 size={13} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
