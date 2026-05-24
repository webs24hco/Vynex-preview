"use client";

import { useState } from "react";
import { services } from "@/lib/mockData";
import { Plus, Edit3, Clock, Tag, X } from "lucide-react";

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showAdd, setShowAdd] = useState(false);
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
          <h1 className="text-xl font-bold text-plum">Services</h1>
          <p className="text-xs text-plum-light mt-0.5">{services.length} services listed</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="w-9 h-9 rounded-full bg-rose flex items-center justify-center text-white shadow-sm hover:bg-rose-dark transition-colors"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Add Service Form (visual state) */}
      {showAdd && (
        <div className="bg-white rounded-2xl p-4 shadow-md border border-rose/30 space-y-3 animate-in">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-plum">New Service</h3>
            <button onClick={() => setShowAdd(false)} className="text-plum-light hover:text-plum">
              <X size={16} />
            </button>
          </div>
          <input
            placeholder="Service name"
            className="w-full px-3 py-2 rounded-lg bg-ivory border border-rose-light/30 text-sm text-plum placeholder:text-plum-light/60 focus:outline-none focus:border-rose"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              placeholder="Duration (e.g. 1h)"
              className="px-3 py-2 rounded-lg bg-ivory border border-rose-light/30 text-sm text-plum placeholder:text-plum-light/60 focus:outline-none focus:border-rose"
            />
            <input
              placeholder="Price (€)"
              className="px-3 py-2 rounded-lg bg-ivory border border-rose-light/30 text-sm text-plum placeholder:text-plum-light/60 focus:outline-none focus:border-rose"
            />
          </div>
          <select className="w-full px-3 py-2 rounded-lg bg-ivory border border-rose-light/30 text-sm text-plum focus:outline-none focus:border-rose">
            <option value="">Select category</option>
            {categories.filter(c => c !== "all").map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button className="w-full py-2.5 bg-rose text-white text-sm font-medium rounded-xl hover:bg-rose-dark transition-colors">
            Add Service
          </button>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? "bg-rose text-white"
                : "bg-white text-plum-light border border-rose-light/30 hover:border-rose"
            }`}
          >
            {cat === "all" ? "All" : cat}
          </button>
        ))}
      </div>

      {/* Service Cards */}
      <div className="space-y-3">
        {filtered.map((service) => (
          <div
            key={service.id}
            className={`bg-white rounded-2xl p-4 shadow-sm border transition-all ${
              editingId === service.id ? "border-rose ring-1 ring-rose/20" : "border-rose-light/20"
            }`}
          >
            {editingId === service.id ? (
              /* Edit State */
              <div className="space-y-2">
                <input
                  defaultValue={service.name}
                  className="w-full px-3 py-1.5 rounded-lg bg-ivory border border-rose-light/30 text-sm font-medium text-plum focus:outline-none focus:border-rose"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    defaultValue={service.duration}
                    className="px-3 py-1.5 rounded-lg bg-ivory border border-rose-light/30 text-sm text-plum focus:outline-none focus:border-rose"
                  />
                  <input
                    defaultValue={`€${service.price}`}
                    className="px-3 py-1.5 rounded-lg bg-ivory border border-rose-light/30 text-sm text-plum focus:outline-none focus:border-rose"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex-1 py-2 bg-rose text-white text-xs font-medium rounded-lg"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex-1 py-2 bg-ivory text-plum-light text-xs font-medium rounded-lg border border-rose-light/30"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* View State */
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm text-plum">{service.name}</p>
                    <span className="text-[10px] bg-rose/10 text-rose-dark px-1.5 py-0.5 rounded-full">
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
                    className="w-8 h-8 rounded-full bg-rose/10 flex items-center justify-center text-rose hover:bg-rose/20 transition-colors"
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
