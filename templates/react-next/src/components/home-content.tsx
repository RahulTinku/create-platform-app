"use client";

import { useBooleanFlagValue } from "@openfeature/react-sdk";
import { FLAGS } from "@/lib/flags";
import type { Session } from "next-auth";

interface HomeContentProps {
  session: Session | null;
}

export function HomeContent({ session }: HomeContentProps) {
  const showNewDashboard = useBooleanFlagValue(FLAGS.newDashboard, false);

  return (
    <main style={{ maxWidth: 640, margin: "4rem auto", padding: "0 1.5rem" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1rem" }}>
        {{projectName}}
      </h1>
      <p style={{ color: "#888", marginBottom: "2rem" }}>
        Scaffolded with <strong>create-platform-app</strong> 🚀
      </p>

      {session ? (
        <div style={{ padding: "1rem", border: "1px solid #333", borderRadius: 8 }}>
          <p>✅ Signed in as <strong>{session.user?.name ?? session.user?.email}</strong></p>
          <a href="/auth/sign-out" style={{ color: "#888", fontSize: "0.875rem" }}>Sign out</a>
        </div>
      ) : (
        <a
          href="/auth/sign-in"
          style={{
            display: "inline-block",
            padding: "0.6rem 1.4rem",
            background: "#fff",
            color: "#000",
            borderRadius: 6,
            fontWeight: 600,
          }}
        >
          Sign in with GitHub
        </a>
      )}

      {showNewDashboard && (
        <div style={{ marginTop: "2rem", padding: "1rem", border: "1px solid #444", borderRadius: 8 }}>
          <p style={{ color: "#0f0" }}>🚩 <strong>new-dashboard</strong> flag is ON</p>
          <p style={{ color: "#888", fontSize: "0.875rem" }}>
            Edit <code>src/lib/flags.ts</code> to manage feature flags.
          </p>
        </div>
      )}
    </main>
  );
}
