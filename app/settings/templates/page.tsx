"use client";

import { useState } from "react";
import { ArrowLeft, MessageCircle, Lock, Save, Eye, Sparkles } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { usePlan } from "@/context/PlanContext";

interface Template {
  id: string;
  nameKey: string;
  content: string;
  emoji: string;
}

const defaultTemplates: Template[] = [
  {
    id: "reminder",
    nameKey: "templates.reminder",
    content: "Hi {name}! 👋 Reminder: You have a {service} appointment on {date} at {time}. See you soon! ✨",
    emoji: "⏰",
  },
  {
    id: "confirmation",
    nameKey: "templates.confirmation",
    content: "Hi {name}! ✅ Your {service} appointment is confirmed for {date} at {time}. Looking forward to seeing you! 💅",
    emoji: "✅",
  },
  {
    id: "followUp",
    nameKey: "templates.followUp",
    content: "Hi {name}! 💕 Hope you loved your {service}! Would you like to book again? We'd love to see you! ✨",
    emoji: "💌",
  },
  {
    id: "thankYou",
    nameKey: "templates.thankYou",
    content: "Thank you {name}! 🙏 It was a pleasure serving you today. Hope you enjoy your {service}! See you next time! 💫",
    emoji: "🙏",
  },
];

export default function TemplatesPage() {
  const { t } = useLanguage();
  const { isPro } = usePlan();
  const [templates, setTemplates] = useState(defaultTemplates);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);

  const updateTemplate = (id: string, content: string) => {
    setTemplates((prev) => prev.map((tmpl) => tmpl.id === id ? { ...tmpl, content } : tmpl));
  };

  if (!isPro) {
    return (
      <div className="min-h-screen px-5 pt-6 pb-28 space-y-5">
        <div className="flex items-center gap-3">
          <Link
            href="/settings"
            className="w-10 h-10 rounded-full bg-white/70 backdrop-blur-md border border-white/40 shadow-sm flex items-center justify-center text-plum-light hover:text-plum transition-all active:scale-90"
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-lg font-bold text-plum">{t("templates.title")}</h1>
        </div>

        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center mb-4">
            <Lock size={28} className="text-amber-600" />
          </div>
          <h2 className="text-lg font-bold text-plum mb-2">{t("templates.proRequired")}</h2>
          <p className="text-sm text-plum-light mb-6 max-w-xs">
            WhatsApp message templates are available on Pro and Studio plans.
          </p>
          <Link
            href="/plan"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose to-rose-dark text-white font-semibold text-sm shadow-lg"
          >
            {t("plan.upgradePro")}
          </Link>
        </div>
      </div>
    );
  }

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
          <h1 className="text-lg font-bold text-plum tracking-tight">{t("templates.title")}</h1>
          <p className="text-xs text-plum-light">{t("templates.subtitle")}</p>
        </div>
      </div>

      {/* WhatsApp Icon */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-50/80 border border-green-200/50">
        <MessageCircle size={16} className="text-green-600" />
        <p className="text-xs text-green-700">{t("templates.variables")}</p>
      </div>

      {/* Templates */}
      <div className="space-y-3">
        {templates.map((tmpl) => {
          const isEditing = editingId === tmpl.id;
          const isPreviewing = previewId === tmpl.id;
          const previewContent = tmpl.content
            .replace("{name}", "María")
            .replace("{service}", "Balayage")
            .replace("{date}", "May 28")
            .replace("{time}", "10:00 AM");

          return (
            <div key={tmpl.id} className="glass-card-solid rounded-2xl p-4 premium-shadow animate-fade-in-up">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{tmpl.emoji}</span>
                  <span className="text-sm font-semibold text-plum">{t(tmpl.nameKey)}</span>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setPreviewId(isPreviewing ? null : tmpl.id)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all active:scale-90 ${
                      isPreviewing ? "bg-rose/10 text-rose" : "bg-white/70 text-plum-light hover:text-rose"
                    }`}
                  >
                    <Eye size={13} />
                  </button>
                  <button
                    onClick={() => setEditingId(isEditing ? null : tmpl.id)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all active:scale-90 ${
                      isEditing ? "bg-rose/10 text-rose" : "bg-white/70 text-plum-light hover:text-rose"
                    }`}
                  >
                    <Sparkles size={13} />
                  </button>
                </div>
              </div>

              {isPreviewing ? (
                <div className="bg-green-50/50 rounded-xl p-3 border border-green-200/30">
                  <p className="text-xs text-plum-light mb-1 font-medium">Preview:</p>
                  <p className="text-sm text-plum">{previewContent}</p>
                </div>
              ) : isEditing ? (
                <div className="space-y-2">
                  <textarea
                    value={tmpl.content}
                    onChange={(e) => updateTemplate(tmpl.id, e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-xl glass-card border border-white/50 text-sm text-plum focus:outline-none focus:ring-2 focus:ring-rose/30 transition-all resize-none"
                  />
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose/10 text-rose text-xs font-medium"
                  >
                    <Save size={12} /> {t("templates.save")}
                  </button>
                </div>
              ) : (
                <p className="text-xs text-plum-light leading-relaxed">{tmpl.content}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
