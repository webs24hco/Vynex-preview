"use client";

import { useState } from "react";
import { ArrowLeft, Clock, DollarSign, Tag, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { services } from "@/lib/mockData";

export default function NewServicePage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const categories = Array.from(new Set(services.map((s) => s.category)));

  const handleSave = () => {
    // In a real app, this would save to DB
    router.push("/services");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-4">
        <Link
          href="/services"
          className="w-10 h-10 rounded-full bg-white/70 backdrop-blur-md border border-white/40 shadow-sm flex items-center justify-center text-plum-light hover:text-plum transition-all duration-200 active:scale-90"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-plum tracking-tight">
            {t("services.newService")}
          </h1>
          <p className="text-xs text-plum-light">{t("services.newServiceDesc")}</p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 px-5 space-y-5 overflow-y-auto">
        {/* Service Name */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-plum-light uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles size={12} />
            {t("services.serviceName")}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("services.serviceNamePlaceholder")}
            className="w-full px-4 py-3.5 rounded-2xl bg-white/80 backdrop-blur-md border border-white/50 text-sm text-plum placeholder:text-plum-light/50 focus:outline-none focus:border-rose/40 focus:ring-2 focus:ring-rose/10 transition-all duration-200 shadow-sm"
          />
        </div>

        {/* Duration & Price Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-plum-light uppercase tracking-wider flex items-center gap-1.5">
              <Clock size={12} />
              {t("services.duration")}
            </label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="1h 30min"
              className="w-full px-4 py-3.5 rounded-2xl bg-white/80 backdrop-blur-md border border-white/50 text-sm text-plum placeholder:text-plum-light/50 focus:outline-none focus:border-rose/40 focus:ring-2 focus:ring-rose/10 transition-all duration-200 shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-plum-light uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign size={12} />
              {t("services.price")}
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-3.5 rounded-2xl bg-white/80 backdrop-blur-md border border-white/50 text-sm text-plum placeholder:text-plum-light/50 focus:outline-none focus:border-rose/40 focus:ring-2 focus:ring-rose/10 transition-all duration-200 shadow-sm"
            />
          </div>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-plum-light uppercase tracking-wider flex items-center gap-1.5">
            <Tag size={12} />
            {t("services.selectCategory")}
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3.5 rounded-2xl bg-white/80 backdrop-blur-md border border-white/50 text-sm text-plum focus:outline-none focus:border-rose/40 focus:ring-2 focus:ring-rose/10 transition-all duration-200 shadow-sm appearance-none"
          >
            <option value="">{t("services.selectCategory")}</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-plum-light uppercase tracking-wider">
            {t("services.descriptionLabel")}
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("services.descriptionPlaceholder")}
            rows={3}
            className="w-full px-4 py-3.5 rounded-2xl bg-white/80 backdrop-blur-md border border-white/50 text-sm text-plum placeholder:text-plum-light/50 focus:outline-none focus:border-rose/40 focus:ring-2 focus:ring-rose/10 transition-all duration-200 shadow-sm resize-none"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="px-5 py-5 pb-28">
        <button
          onClick={handleSave}
          className="w-full py-4 bg-gradient-to-r from-rose to-rose-dark text-white text-sm font-semibold rounded-2xl hover:shadow-lg transition-all duration-200 active:scale-[0.97] shadow-md"
        >
          {t("services.addService")}
        </button>
      </div>
    </div>
  );
}
