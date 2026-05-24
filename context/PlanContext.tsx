"use client";

import React, { createContext, useContext, useState } from "react";

export type PlanType = "Free" | "Pro" | "Studio";

interface PlanContextType {
  plan: PlanType;
  setPlan: (plan: PlanType) => void;
  isPro: boolean;
  isStudio: boolean;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const [plan, setPlan] = useState<PlanType>("Free");

  return (
    <PlanContext.Provider
      value={{
        plan,
        setPlan,
        isPro: plan === "Pro" || plan === "Studio",
        isStudio: plan === "Studio",
      }}
    >
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error("usePlan must be used within a PlanProvider");
  }
  return context;
}
