import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Staff Sign In | Classify Enterprises" },
      { name: "description", content: "Secure sign-in for Classify Enterprises recruitment staff." },
      { property: "og:title", content: "Staff Sign In | Classify Enterprises" },
      { property: "og:description", content: "Secure sign-in for Classify Enterprises recruitment staff." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setMsg(null);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return setMsg({ ok: false, text: error.message });
      navigate({ to: "/admin" });
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
      setBusy(false);
      if (error) return setMsg({ ok: false, text: error.message });
      setMsg({ ok: true, text: "Account created. Check your email to confirm, then ask an administrator to grant HR access." });
    }
  }

  const input = "w-full rounded-xl border border-input px-4 py-3 text-sm outline-none focus:border-royal focus:ring-4 focus:ring-royal/10";
  return (
    <div className="grid min-h-screen place-items-center gradient-hero px-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-white p-8 shadow-elegant">
        <Link to="/"><img src="/logo.png" alt="Classify Enterprises" className="mx-auto h-12 w-auto" /></Link>
        <h1 className="mt-6 text-center font-display text-2xl font-bold text-navy">{mode === "in" ? "Staff Sign In" : "Create Staff Account"}</h1>
        <p className="mt-2 text-center text-sm text-slate-600">Recruitment dashboard — authorized staff only</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <input type="email" required placeholder="Email" className={input} value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" required minLength={8} placeholder="Password" className={input} value={password} onChange={(e) => setPassword(e.target.value)} />
          {msg && <p className={`text-sm ${msg.ok ? "text-royal" : "text-destructive"}`}>{msg.text}</p>}
          <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-full bg-royal py-3 text-sm font-semibold text-white hover:bg-navy disabled:opacity-60">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}{mode === "in" ? "Sign In" : "Create Account"}
          </button>
        </form>
        <button onClick={() => { setMode(mode === "in" ? "up" : "in"); setMsg(null); }} className="mt-4 w-full text-center text-sm font-medium text-royal hover:underline">
          {mode === "in" ? "Need an account? Create one" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
