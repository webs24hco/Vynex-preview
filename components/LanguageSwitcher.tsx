"use client";

import { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Locale } from "@/lib/i18n/translations";

const languages: { code: Locale; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
];

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent | TouchEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    // Use both mousedown and touchstart for cross-platform support
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative z-[100]" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        onTouchEnd={(e) => {
          e.preventDefault();
          setOpen(!open);
        }}
        className="relative z-[101] w-9 h-9 rounded-full bg-white/70 backdrop-blur-md border border-white/40 shadow-sm flex items-center justify-center text-plum-light hover:text-rose hover:border-rose/30 transition-all duration-200 active:scale-95 cursor-pointer touch-manipulation"
        aria-label="Change language"
      >
        <Globe size={16} strokeWidth={1.8} />
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-[102] w-40 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {languages.map((lang) => (
            <button
              type="button"
              key={lang.code}
              onClick={() => {
                setLocale(lang.code);
                setOpen(false);
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                setLocale(lang.code);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors cursor-pointer touch-manipulation ${
                locale === lang.code
                  ? "bg-rose/10 text-rose font-medium"
                  : "text-plum hover:bg-rose/5"
              }`}
            >
              <span className="text-base">{lang.flag}</span>
              <span>{lang.label}</span>
              {locale === lang.code && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-rose" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
