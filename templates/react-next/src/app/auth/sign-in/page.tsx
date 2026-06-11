import { signIn } from "@/auth";

export default function SignInPage() {
  return (
    <main style={{ maxWidth: 400, margin: "4rem auto", padding: "0 1.5rem" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "2rem" }}>Sign in</h1>
      <form
        action={async () => {
          "use server";
          await signIn("github", { redirectTo: "/" });
        }}
      >
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "0.75rem",
            background: "#fff",
            color: "#000",
            fontWeight: 600,
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Sign in with GitHub
        </button>
      </form>
    </main>
  );
}
