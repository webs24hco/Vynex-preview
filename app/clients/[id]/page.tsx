"use client";

import { use } from "react";
import { clients } from "@/lib/mockData";
import {
  ArrowLeft,
  Phone,
  Mail,
  MessageCircle,
  CalendarPlus,
  CreditCard,
  Star,
  Clock,
  FileText,
} from "lucide-react";
import Link from "next/link";

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const client = clients.find((c) => c.id === id);

  if (!client) {
    return (
      <div className="px-5 pt-6">
        <p className="text-plum-light">Client not found</p>
      </div>
    );
  }

  const mockHistory = [
    { date: "May 24, 2026", service: "Balayage + Cut", price: 180 },
    { date: "Apr 28, 2026", service: "Root Touch-up", price: 90 },
    { date: "Mar 15, 2026", service: "Balayage", price: 150 },
  ];

  return (
    <div className="px-5 pt-6 space-y-5 pb-4">
      {/* Back + Header */}
      <div className="flex items-center gap-3">
        <Link href="/clients" className="w-8 h-8 rounded-full bg-white border border-rose-light/30 flex items-center justify-center text-plum-light hover:text-plum transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <h1 className="text-lg font-bold text-plum">Client Profile</h1>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-rose-light/20 text-center">
        <div className="w-16 h-16 rounded-full bg-rose/15 flex items-center justify-center text-rose-dark font-bold text-xl mx-auto">
          {client.name.split(" ").map((n) => n[0]).join("")}
        </div>
        <h2 className="font-bold text-lg text-plum mt-3">{client.name}</h2>
        <p className="text-xs text-plum-light mt-1">{client.totalVisits} visits · Client since 2024</p>

        <div className="flex items-center justify-center gap-4 mt-4">
          <a href={`tel:${client.phone}`} className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Phone size={16} />
            </div>
            <span className="text-[10px] text-plum-light">Call</span>
          </a>
          <a href={`mailto:${client.email}`} className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-rose/10 flex items-center justify-center text-rose">
              <Mail size={16} />
            </div>
            <span className="text-[10px] text-plum-light">Email</span>
          </a>
          <button className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
              <MessageCircle size={16} />
            </div>
            <span className="text-[10px] text-plum-light">WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-3 shadow-sm border border-rose-light/20">
          <Star size={14} className="text-gold-dark mb-1" />
          <p className="text-[10px] text-plum-light">Favorite</p>
          <p className="text-xs font-semibold text-plum">{client.favoriteService}</p>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm border border-rose-light/20">
          <Clock size={14} className="text-rose mb-1" />
          <p className="text-[10px] text-plum-light">Last Visit</p>
          <p className="text-xs font-semibold text-plum">{client.lastVisit}</p>
        </div>
      </div>

      {/* Pending Balance */}
      {client.pendingBalance > 0 && (
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-amber-800">Pending Balance</p>
              <p className="text-lg font-bold text-amber-900">€{client.pendingBalance}</p>
            </div>
            <button className="px-3 py-1.5 bg-amber-600 text-white text-xs font-medium rounded-lg hover:bg-amber-700 transition-colors">
              Mark as Paid
            </button>
          </div>
        </div>
      )}

      {/* WhatsApp Message Preview */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-rose-light/20">
        <h3 className="text-xs font-semibold text-plum-light uppercase tracking-wide mb-3">WhatsApp Reminder</h3>
        <div className="bg-green-50 rounded-xl p-3 border border-green-200/50">
          <p className="text-xs text-green-900 leading-relaxed">
            Hi {client.name.split(" ")[0]}! 👋 Just a friendly reminder about your upcoming appointment at our salon. 
            Looking forward to seeing you! 💅✨
          </p>
        </div>
        <button className="w-full mt-3 py-2 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-1.5">
          <MessageCircle size={14} />
          Send via WhatsApp
        </button>
      </div>

      {/* Notes */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-rose-light/20">
        <div className="flex items-center gap-1.5 mb-2">
          <FileText size={14} className="text-plum-light" />
          <h3 className="text-xs font-semibold text-plum-light uppercase tracking-wide">Notes</h3>
        </div>
        <p className="text-sm text-plum leading-relaxed">{client.notes}</p>
      </div>

      {/* Appointment History */}
      <div>
        <h3 className="text-xs font-semibold text-plum-light uppercase tracking-wide mb-3">Visit History</h3>
        <div className="space-y-2">
          {mockHistory.map((visit, i) => (
            <div key={i} className="flex items-center justify-between bg-white rounded-xl px-4 py-3 shadow-sm border border-rose-light/20">
              <div>
                <p className="text-sm font-medium text-plum">{visit.service}</p>
                <p className="text-[11px] text-plum-light">{visit.date}</p>
              </div>
              <span className="text-sm font-semibold text-rose">€{visit.price}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button className="flex-1 py-2.5 bg-rose text-white text-xs font-medium rounded-xl hover:bg-rose-dark transition-colors flex items-center justify-center gap-1.5">
          <CalendarPlus size={14} />
          Schedule Again
        </button>
        <button className="flex-1 py-2.5 bg-white text-plum border border-rose-light/30 text-xs font-medium rounded-xl hover:border-rose transition-colors flex items-center justify-center gap-1.5">
          <CreditCard size={14} />
          Record Payment
        </button>
      </div>
    </div>
  );
}
