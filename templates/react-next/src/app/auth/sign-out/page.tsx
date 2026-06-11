import { signOut } from "@/auth";

export default function SignOutPage() {
  return (
    <main style={{ maxWidth: 400, margin: "4rem auto", padding: "0 1.5rem" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "2rem" }}>Sign out</h1>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "0.75rem",
            background: "#222",
            color: "#fff",
            fontWeight: 600,
            border: "1px solid #444",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Sign out
        </button>
      </form>
    </main>
  );
}
