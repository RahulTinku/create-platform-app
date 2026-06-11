/**
 * Feature flag definitions for {{projectName}}.
 * Using OpenFeature with an in-memory provider for local development.
 * Swap InMemoryProvider with your real provider (LaunchDarkly, Flagsmith, etc.)
 */
import { InMemoryProvider } from "@openfeature/web-sdk";

export const FLAGS = {
  /** Show the new dashboard UI */
  newDashboard: "new-dashboard",
  /** Enable beta features for opted-in users */
  betaFeatures: "beta-features",
} as const;

/** Default flag values — used by InMemoryProvider in development */
export const defaultFlags: ConstructorParameters<typeof InMemoryProvider>[0] = {
  [FLAGS.newDashboard]: {
    defaultVariant: "on",
    variants: { on: true, off: false },
    disabled: false,
  },
  [FLAGS.betaFeatures]: {
    defaultVariant: "off",
    variants: { on: true, off: false },
    disabled: false,
  },
};
