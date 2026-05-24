"use client";

import { useState } from "react";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function LoginPage() {
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-12">
      {/* Logo / Brand */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-rose to-rose-dark flex items-center justify-center shadow-lg">
          <Sparkles size={28} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-plum tracking-tight">Vynex Agenda</h1>
        <p className="text-sm text-plum-light mt-1">{t("auth.welcomeDesc")}</p>
      </div>

      {/* Login Form */}
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-plum-light uppercase tracking-wider mb-1.5 block">
            {t("auth.email")}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="valentina@studio.com"
            className="w-full px-4 py-3.5 rounded-xl glass-card-solid border border-white/50 text-sm text-plum placeholder:text-plum-light/50 focus:outline-none focus:ring-2 focus:ring-rose/30 focus:border-rose/40 transition-all"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-plum-light uppercase tracking-wider mb-1.5 block">
            {t("auth.password")}
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3.5 rounded-xl glass-card-solid border border-white/50 text-sm text-plum placeholder:text-plum-light/50 focus:outline-none focus:ring-2 focus:ring-rose/30 focus:border-rose/40 transition-all pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-plum-light hover:text-rose transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="text-xs text-rose font-medium hover:underline">
            {t("auth.forgotPassword")}
          </button>
        </div>

        <Link
          href="/"
          className="w-full flex items-center justify-center py-3.5 rounded-xl bg-gradient-to-r from-rose to-rose-dark text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.98]"
        >
          {t("auth.signIn")}
        </Link>
      </div>

      {/* Register link */}
      <p className="text-center text-sm text-plum-light mt-8">
        {t("auth.noAccount")}{" "}
        <Link href="/register" className="text-rose font-semibold hover:underline">
          {t("auth.signUp")}
        </Link>
      </p>
    </div>
  );
}
