import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Download, Loader2, LogOut, Search, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "HR Recruitment Dashboard | Classify Enterprises" },
      { name: "description", content: "Internal recruitment dashboard for reviewing CSR applications." },
      { property: "og:title", content: "HR Recruitment Dashboard | Classify Enterprises" },
      { property: "og:description", content: "Internal recruitment dashboard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type App = Tables<"applications">;
const STATUSES = ["New", "Reviewed", "Shortlisted", "Interview Scheduled", "Selected", "Rejected"];
const statusCls: Record<string, string> = {
  New: "bg-royal/10 text-royal", Reviewed: "bg-muted text-navy", Shortlisted: "bg-gold/20 text-navy",
  "Interview Scheduled": "bg-royal/15 text-navy", Selected: "bg-emerald-100 text-emerald-800", Rejected: "bg-destructive/10 text-destructive",
};

function AdminPage() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [fStatus, setFStatus] = useState("");
  const [fShift, setFShift] = useState("");
  const [fExp, setFExp] = useState("");
  const [fQual, setFQual] = useState("");
  const [fCity, setFCity] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest" | "name" | "status">("newest");
  const [sel, setSel] = useState<App | null>(null);

  useEffect(() => {
    supabase.rpc("has_role", { _user_id: user.id, _role: "admin" }).then(({ data }) => setIsAdmin(!!data));
  }, [user.id]);

  useEffect(() => {
    if (!isAdmin) return;
    supabase.from("applications").select("*").order("created_at", { ascending: false }).then(({ data, error }) => {
      if (error) toast.error("Could not load applications");
      setApps(data ?? []); setLoading(false);
    });
    const ch = supabase.channel("applications-live").on("postgres_changes", { event: "*", schema: "public", table: "applications" }, (p) => {
      if (p.eventType === "INSERT") { setApps((a) => [p.new as App, ...a]); toast.success(`New application: ${(p.new as App).first_name} ${(p.new as App).last_name}`); }
      if (p.eventType === "UPDATE") setApps((a) => a.map((x) => (x.id === (p.new as App).id ? (p.new as App) : x)));
    }).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [isAdmin]);

  const cities = useMemo(() => [...new Set(apps.map((a) => a.city))].sort(), [apps]);
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    const r = apps.filter((a) =>
      (!s || [a.first_name + " " + a.last_name, a.email, a.phone, a.city, a.application_id].some((v) => v.toLowerCase().includes(s))) &&
      (!fStatus || a.application_status === fStatus) && (!fShift || a.preferred_shift === fShift) &&
      (!fExp || a.total_experience === fExp) && (!fQual || a.highest_qualification === fQual) && (!fCity || a.city === fCity) &&
      (!from || a.created_at >= from) && (!to || a.created_at.slice(0, 10) <= to));
    return r.sort((a, b) =>
      sort === "newest" ? b.created_at.localeCompare(a.created_at) : sort === "oldest" ? a.created_at.localeCompare(b.created_at)
      : sort === "name" ? (a.first_name + a.last_name).localeCompare(b.first_name + b.last_name) : STATUSES.indexOf(a.application_status) - STATUSES.indexOf(b.application_status));
  }, [apps, q, fStatus, fShift, fExp, fQual, fCity, from, to, sort]);

  async function signOut() { await supabase.auth.signOut(); navigate({ to: "/auth" }); }

  if (isAdmin === null) return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin text-royal" /></div>;
  if (!isAdmin) return (
    <div className="grid min-h-screen place-items-center px-4 text-center">
      <div><h1 className="font-display text-2xl font-bold text-navy">Access restricted</h1>
        <p className="mt-2 text-slate-700">Your account ({user.email}) does not have HR access yet. Please contact an administrator.</p>
        <button onClick={signOut} className="mt-6 rounded-full bg-royal px-5 py-2.5 text-sm font-semibold text-white">Sign out</button></div>
    </div>
  );

  const sc = "rounded-lg border border-input bg-white px-3 py-2 text-sm text-navy";
  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-4">
          <div className="flex items-center gap-4"><Link to="/"><img src="/logo.png" alt="Classify Enterprises" className="h-9 w-auto" /></Link><span className="hidden font-display font-bold text-navy sm:inline">HR Dashboard</span></div>
          <button onClick={signOut} className="inline-flex items-center gap-2 text-sm font-semibold text-navy hover:text-royal"><LogOut className="h-4 w-4" /> Sign out</button>
        </div>
      </header>
      <main className="mx-auto max-w-[1400px] px-5 py-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
          <Stat label="Total" v={apps.length} />
          {STATUSES.slice(0, 5).map((s) => <Stat key={s} label={s} v={apps.filter((a) => a.application_status === s).length} />)}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-white p-4">
          <div className="relative min-w-[220px] flex-1"><Search className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" /><input placeholder="Search name, email, phone, city, ID" className={`${sc} w-full pl-9`} value={q} onChange={(e) => setQ(e.target.value)} /></div>
          <Filter v={fStatus} set={setFStatus} label="All statuses" opts={STATUSES} />
          <Filter v={fShift} set={setFShift} label="All shifts" opts={["Morning", "Evening", "Night", "Rotational", "Flexible"]} />
          <Filter v={fExp} set={setFExp} label="All experience" opts={["No Experience", "Less than 1 Year", "1–2 Years", "2–3 Years", "3+ Years"]} />
          <Filter v={fQual} set={setFQual} label="All qualifications" opts={["Matric", "Intermediate", "Bachelor's", "Master's", "Other"]} />
          <Filter v={fCity} set={setFCity} label="All cities" opts={cities} />
          <input type="date" className={sc} value={from} onChange={(e) => setFrom(e.target.value)} aria-label="From date" />
          <input type="date" className={sc} value={to} onChange={(e) => setTo(e.target.value)} aria-label="To date" />
          <select className={sc} value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
            <option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="name">Name A–Z</option><option value="status">By status</option>
          </select>
        </div>

        <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-white">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead className="bg-muted text-xs font-semibold tracking-wide text-slate-700 uppercase">
              <tr>{["App ID", "Name", "Phone", "Email", "City", "Qualification", "Experience", "Shift", "Salary", "Submitted", "Status"].map((h) => <th key={h} className="px-4 py-3">{h}</th>)}</tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={11} className="p-10 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin text-royal" /></td></tr>
                : list.length === 0 ? <tr><td colSpan={11} className="p-10 text-center text-slate-600">No applications found.</td></tr>
                : list.map((a) => (
                  <tr key={a.id} onClick={() => setSel(a)} className="cursor-pointer border-t border-border hover:bg-royal/5">
                    <td className="px-4 py-3 font-mono text-xs text-navy">{a.application_id}</td>
                    <td className="px-4 py-3 font-semibold text-navy">{a.first_name} {a.last_name}</td>
                    <td className="px-4 py-3">{a.phone}</td><td className="px-4 py-3">{a.email}</td><td className="px-4 py-3">{a.city}</td>
                    <td className="px-4 py-3">{a.highest_qualification}</td><td className="px-4 py-3">{a.total_experience}</td><td className="px-4 py-3">{a.preferred_shift}</td>
                    <td className="px-4 py-3">{a.expected_salary.toLocaleString()}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{new Date(a.created_at).toLocaleString()}</td>
                    <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${statusCls[a.application_status]}`}>{a.application_status}</span></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </main>
      {sel && <Detail app={apps.find((a) => a.id === sel.id) ?? sel} onClose={() => setSel(null)} onSaved={(u) => setApps((xs) => xs.map((x) => (x.id === u.id ? u : x)))} />}
    </div>
  );
}

function Stat({ label, v }: { label: string; v: number }) {
  return <div className="rounded-2xl border border-border bg-white p-4"><div className="text-xs font-semibold text-slate-600">{label}</div><div className="mt-1 font-display text-2xl font-bold text-navy">{v}</div></div>;
}
function Filter({ v, set, label, opts }: { v: string; set: (s: string) => void; label: string; opts: string[] }) {
  return <select className="rounded-lg border border-input bg-white px-3 py-2 text-sm text-navy" value={v} onChange={(e) => set(e.target.value)}><option value="">{label}</option>{opts.map((o) => <option key={o}>{o}</option>)}</select>;
}

function Detail({ app, onClose, onSaved }: { app: App; onClose: () => void; onSaved: (a: App) => void }) {
  const [status, setStatus] = useState(app.application_status);
  const [notes, setNotes] = useState(app.hr_notes ?? "");
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    const { data, error } = await supabase.from("applications").update({ application_status: status, hr_notes: notes.slice(0, 5000) }).eq("id", app.id).select().single();
    setSaving(false);
    if (error) return toast.error("Could not save changes");
    onSaved(data); toast.success("Application updated");
  }
  async function download() {
    const { data, error } = await supabase.storage.from("resumes").createSignedUrl(app.resume_url, 120, { download: app.resume_filename ?? true });
    if (error || !data) return toast.error("Could not download CV");
    window.open(data.signedUrl, "_blank", "noopener");
  }
  const rows: [string, string | null | undefined][] = [
    ["Date of Birth", app.date_of_birth], ["Gender", app.gender], ["Phone", app.phone], ["Email", app.email], ["City", app.city], ["CNIC", app.cnic],
    ["Qualification", app.highest_qualification], ["Field of Study", app.field_of_study], ["Institution", app.institution_name],
    ["Work Experience", app.has_work_experience ? "Yes" : "No"], ["Total Experience", app.total_experience], ["Previous Job Title", app.previous_job_title], ["Previous Company", app.previous_company],
    ["Preferred Shift", app.preferred_shift], ["Expected Salary (PKR)", app.expected_salary.toLocaleString()], ["Notice Period", app.notice_period], ["Vacancy Source", app.vacancy_source], ["Referral", app.referral_name],
    ["Submitted", new Date(app.created_at).toLocaleString()],
  ];
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-navy/40" onClick={onClose}>
      <aside className="h-full w-full max-w-2xl overflow-y-auto bg-white p-6 shadow-elegant md:p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div><div className="font-mono text-xs text-slate-600">{app.application_id}</div><h2 className="font-display text-2xl font-bold text-navy">{app.first_name} {app.last_name}</h2></div>
          <button onClick={onClose} aria-label="Close" className="rounded-full p-2 hover:bg-muted"><X className="h-5 w-5" /></button>
        </div>
        <button onClick={download} className="mt-4 inline-flex items-center gap-2 rounded-full bg-royal px-4 py-2 text-sm font-semibold text-white hover:bg-navy"><Download className="h-4 w-4" /> Download CV</button>
        <dl className="mt-6 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
          {rows.map(([k, v]) => <div key={k}><dt className="text-xs font-semibold text-slate-600">{k}</dt><dd className="text-sm text-navy">{v || "—"}</dd></div>)}
        </dl>
        {[["Key Responsibilities", app.key_responsibilities], ["Why interested in this role", app.interest_reason], ["Career goals", app.career_goals]].map(([k, v]) => (
          <div key={k} className="mt-5"><div className="text-xs font-semibold text-slate-600">{k}</div><p className="mt-1 text-sm whitespace-pre-wrap text-navy">{v || "—"}</p></div>
        ))}
        <div className="mt-8 rounded-2xl border border-border bg-surface p-5">
          <label className="block text-sm font-semibold text-navy">Status
            <select className="mt-1 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
          </label>
          <label className="mt-4 block text-sm font-semibold text-navy">Internal HR notes
            <textarea rows={4} maxLength={5000} className="mt-1 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </label>
          <button onClick={save} disabled={saving} className="mt-4 inline-flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-royal disabled:opacity-60">{saving && <Loader2 className="h-4 w-4 animate-spin" />}Save changes</button>
        </div>
      </aside>
    </div>
  );
}
