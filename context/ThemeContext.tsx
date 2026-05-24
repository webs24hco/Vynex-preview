"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export type ThemeName = "default" | "roseGold" | "midnightGlamour" | "softSage" | "custom";

interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  accent: string;
  accentDark: string;
  text: string;
  textLight: string;
  bg: string;
  bgCard: string;
  bgGradient: string;
  navBg: string;
  borderColor: string;
}

export const themes: Record<Exclude<ThemeName, "custom">, ThemeColors> = {
  default: {
    primary: "#DCAE96",
    primaryLight: "#f0d4c4",
    primaryDark: "#c4947c",
    accent: "#F3E5AB",
    accentDark: "#d4c48a",
    text: "#4A3B3C",
    textLight: "#6b5a5b",
    bg: "#FDFBF7",
    bgCard: "#FFFFFF",
    bgGradient: "linear-gradient(180deg, #f5efe8 0%, #f0ebe3 50%, #ece5dc 100%)",
    navBg: "rgba(255, 255, 255, 0.85)",
    borderColor: "rgba(255, 255, 255, 0.6)",
  },
  roseGold: {
    primary: "#DCAE96",
    primaryLight: "#f0d4c4",
    primaryDark: "#c4947c",
    accent: "#F3E5AB",
    accentDark: "#d4c48a",
    text: "#4A3B3C",
    textLight: "#6b5a5b",
    bg: "#FDFBF7",
    bgCard: "#FFFFFF",
    bgGradient: "linear-gradient(180deg, #f5efe8 0%, #f0ebe3 50%, #ece5dc 100%)",
    navBg: "rgba(255, 255, 255, 0.85)",
    borderColor: "rgba(255, 255, 255, 0.6)",
  },
  midnightGlamour: {
    primary: "#C9A0DC",
    primaryLight: "#dfc4ec",
    primaryDark: "#a87dbf",
    accent: "#F0C27B",
    accentDark: "#d4a85a",
    text: "#F0EDF3",
    textLight: "#b8afc0",
    bg: "#1A1125",
    bgCard: "#2A1F35",
    bgGradient: "linear-gradient(180deg, #1A1125 0%, #1f1530 50%, #261a38 100%)",
    navBg: "rgba(42, 31, 53, 0.9)",
    borderColor: "rgba(201, 160, 220, 0.15)",
  },
  softSage: {
    primary: "#7BA68C",
    primaryLight: "#a8cdb6",
    primaryDark: "#5c8a6e",
    accent: "#E8D5B7",
    accentDark: "#c4b08a",
    text: "#2D3B33",
    textLight: "#5a6b60",
    bg: "#F5F9F6",
    bgCard: "#FFFFFF",
    bgGradient: "linear-gradient(180deg, #f0f7f2 0%, #e8f2eb 50%, #e0ebe3 100%)",
    navBg: "rgba(255, 255, 255, 0.88)",
    borderColor: "rgba(123, 166, 140, 0.2)",
  },
};

interface CustomBranding {
  accentColor: string;
  logoUrl: string | null;
}

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  colors: ThemeColors;
  customBranding: CustomBranding;
  setCustomBranding: (branding: CustomBranding) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>("default");
  const [customBranding, setCustomBranding] = useState<CustomBranding>({
    accentColor: "#DCAE96",
    logoUrl: null,
  });

  const getColors = useCallback((): ThemeColors => {
    if (theme === "custom") {
      return {
        ...themes.default,
        primary: customBranding.accentColor,
        primaryLight: customBranding.accentColor + "40",
        primaryDark: customBranding.accentColor,
      };
    }
    return themes[theme];
  }, [theme, customBranding]);

  const applyTheme = useCallback((colors: ThemeColors) => {
    const root = document.documentElement;
    root.style.setProperty("--color-ivory", colors.bg);
    root.style.setProperty("--color-rose", colors.primary);
    root.style.setProperty("--color-rose-light", colors.primaryLight);
    root.style.setProperty("--color-rose-dark", colors.primaryDark);
    root.style.setProperty("--color-gold", colors.accent);
    root.style.setProperty("--color-gold-dark", colors.accentDark);
    root.style.setProperty("--color-plum", colors.text);
    root.style.setProperty("--color-plum-light", colors.textLight);
    root.style.setProperty("--color-bg-card", colors.bgCard);
    root.style.setProperty("--theme-bg-gradient", colors.bgGradient);
    root.style.setProperty("--theme-nav-bg", colors.navBg);
    root.style.setProperty("--theme-border-color", colors.borderColor);
    document.body.style.background = colors.bgGradient;
    document.body.style.color = colors.text;
  }, []);

  useEffect(() => {
    applyTheme(getColors());
  }, [theme, customBranding, applyTheme, getColors]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colors: getColors(), customBranding, setCustomBranding }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
