"use client";

import { OpenFeatureProvider } from "@openfeature/react-sdk";
import { OpenFeature, InMemoryProvider } from "@openfeature/web-sdk";
import { useEffect } from "react";
import { defaultFlags } from "@/lib/flags";

// Initialise OpenFeature once on the client
OpenFeature.setProvider(new InMemoryProvider(defaultFlags));

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <OpenFeatureProvider>
      {children}
    </OpenFeatureProvider>
  );
}
