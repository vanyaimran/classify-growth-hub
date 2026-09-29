import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState, type ReactNode } from "react";
import { z } from "zod";
import { ArrowLeft, ArrowRight, CheckCircle2, FileText, Loader2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Customer Support Representative (CSR) — Application Form | Classify Enterprises" },
      { name: "description", content: "Apply for the Customer Support Representative (CSR) role at Classify Enterprises. Complete the online application and upload your CV." },
      { property: "og:title", content: "Join Our Team — CSR Application | Classify Enterprises" },
      { property: "og:description", content: "Apply online for the Customer Support Representative role at Classify Enterprises." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CareersPage,
});

type Form = Record<string, string>;
const initial: Form = {
  first_name: "", last_name: "", date_of_birth: "", gender: "", phone: "", email: "", city: "", cnic: "",
  highest_qualification: "", field_of_study: "", institution_name: "",
  has_work_experience: "", total_experience: "", previous_job_title: "", previous_company: "", key_responsibilities: "",
  preferred_shift: "", expected_salary: "", notice_period: "", notice_other: "", vacancy_source: "", referral_name: "", source_other: "", interest_reason: "",
  career_goals: "", consent: "",
};

const steps = ["Personal", "Education", "Experience", "Preferences", "Additional"];
const req = (m = "This field is required") => z.string().trim().min(1, m);

const stepSchemas = [
  z.object({
    first_name: req().max(100), last_name: req().max(100),
    date_of_birth: req().refine((v) => { const d = new Date(v); const age = (Date.now() - d.getTime()) / 3.156e10; return age >= 16 && age <= 70; }, "Enter a valid date of birth (age 16–70)"),
    gender: req("Please select gender"),
    phone: req().transform((v) => v.replace(/[\s-]/g, "")).pipe(z.string().regex(/^(03\d{9}|\+923\d{9})$/, "Use 03XXXXXXXXX or +92XXXXXXXXXX")),
    email: req().email("Enter a valid email address").max(255),
    city: req().max(100),
    cnic: z.string().trim().refine((v) => v === "" || /^\d{5}-\d{7}-\d$/.test(v), "Use format XXXXX-XXXXXXX-X"),
  }),
  z.object({ highest_qualification: req("Please select qualification"), field_of_study: req().max(150), institution_name: req().max(200) }),
  z.object({ has_work_experience: req("Please select an option"), total_experience: req("Please select experience"), previous_job_title: z.string().max(150), previous_company: z.string().max(150), key_responsibilities: z.string().max(2000) }),
  z.object({
    preferred_shift: req("Please select a shift"),
    expected_salary: req().refine((v) => /^\d+$/.test(v) && +v >= 10000 && +v <= 1000000, "Enter a salary between 10,000 and 1,000,000 PKR"),
    notice_period: req("Please select notice period"), vacancy_source: req("Please select an option"),
    interest_reason: z.string().trim().min(30, "Please write at least 30 characters").max(2000),
  }),
  z.object({ career_goals: z.string().trim().min(20, "Please write at least 20 characters").max(2000), consent: z.literal("yes", { message: "You must confirm to submit" }) }),
];

const inputCls = "w-full rounded-xl border border-input bg-white px-4 py-3 text-sm text-navy placeholder:text-slate-400 outline-none transition focus:border-royal focus:ring-4 focus:ring-royal/10";

function Field({ label, required, error, children, full }: { label: string; required?: boolean; error?: string; children: ReactNode; full?: boolean }) {
  return (
    <label className={`block ${full ? "md:col-span-2" : ""}`}>
      <span className="mb-1.5 block text-sm font-semibold text-navy">{label}{required && <span className="text-destructive"> *</span>}</span>
      {children}
      {error && <span className="mt-1 block text-xs font-medium text-destructive">{error}</span>}
    </label>
  );
}

function CareersPage() {
  const [f, setF] = useState<Form>(initial);
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const lock = useRef(false);
  const topRef = useRef<HTMLDivElement>(null);

  const set = (k: string) => (e: { target: { value: string } }) => setF((p) => ({ ...p, [k]: e.target.value }));
  const noExp = f.has_work_experience === "No";

  function validate(i: number) {
    const errs: Record<string, string> = {};
    const r = stepSchemas[i].safeParse(f);
    if (!r.success) r.error.issues.forEach((iss) => { const k = String(iss.path[0]); if (!errs[k]) errs[k] = iss.message; });
    if (i === 2 && f.has_work_experience === "Yes") {
      if (!f.previous_job_title.trim()) errs.previous_job_title = "This field is required";
      if (!f.previous_company.trim()) errs.previous_company = "This field is required";
    }
    if (i === 3 && f.notice_period === "Other" && !f.notice_other.trim()) errs.notice_other = "Please specify notice period";
    if (i === 3 && f.vacancy_source === "Other" && !f.source_other.trim()) errs.source_other = "Please specify";
    if (i === 4) {
      if (!file) errs.resume = "Please upload your CV";
      else if (!/\.(pdf|docx?)$/i.test(file.name)) errs.resume = "Only PDF, DOC or DOCX files are allowed";
      else if (file.size > 5 * 1024 * 1024) errs.resume = "File must be 5 MB or smaller";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  const scrollTop = () => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  const next = () => { if (validate(step)) { setStep((s) => s + 1); scrollTop(); } };
  const back = () => { setErrors({}); setStep((s) => s - 1); scrollTop(); };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (lock.current) return;
    if (step < 4) return next();
    if (!validate(4) || !file) return;
    lock.current = true; setSubmitting(true); setFailed(false);
    try {
      const ext = file.name.split(".").pop()!.toLowerCase();
      const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${ext}`;
      const up = await supabase.storage.from("resumes").upload(path, file, { contentType: file.type || undefined, upsert: false });
      if (up.error) throw up.error;
      const payload = {
        ...f,
        phone: f.phone.replace(/[\s-]/g, ""),
        has_work_experience: f.has_work_experience === "Yes",
        notice_period: f.notice_period === "Other" ? `Other: ${f.notice_other.trim()}` : f.notice_period,
        vacancy_source: f.vacancy_source === "Other" ? `Other: ${f.source_other.trim()}` : f.vacancy_source,
        referral_name: f.vacancy_source === "Referral" ? f.referral_name : "",
        expected_salary: Number(f.expected_salary),
        resume_url: path,
        resume_filename: file.name,
      };
      const { data, error } = await supabase.rpc("submit_application", { payload });
      if (error) throw error;
      setDone(data as string);
      setF(initial); setFile(null); setStep(0);
      scrollTop();
    } catch (err) {
      console.error(err);
      setFailed(true);
    } finally {
      lock.current = false; setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen gradient-hero">
      <header className="border-b border-navy/5 bg-white/80 backdrop-blur">
        <div className="container-x flex items-center justify-between py-4">
          <Link to="/" aria-label="Classify Enterprises home"><img src="/logo.png" alt="Classify Enterprises" className="h-10 w-auto md:h-12" /></Link>
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-navy hover:text-royal"><ArrowLeft className="h-4 w-4" /> Back to website</Link>
        </div>
      </header>

      <main className="container-x py-12 md:py-16" ref={topRef}>
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <span className="inline-flex rounded-full border border-royal/20 bg-white px-3 py-1 text-xs font-semibold tracking-wider text-royal uppercase">Customer Support Representative (CSR)</span>
            <h1 className="mt-4 font-display text-4xl font-bold text-navy md:text-5xl">Join Our Team</h1>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-slate-700">Please complete the form below accurately and provide all required information. Only shortlisted candidates will be contacted for an interview.</p>
          </div>

          {done ? (
            <div className="mt-10 rounded-3xl border border-border bg-white p-8 text-center shadow-elegant md:p-12">
              <CheckCircle2 className="mx-auto h-14 w-14 text-royal" />
              <h2 className="mt-4 font-display text-2xl font-bold text-navy">Application Submitted</h2>
              <p className="mx-auto mt-3 max-w-lg text-slate-700">Thank you for applying to Classify Enterprises. Your application has been received successfully. Only shortlisted candidates will be contacted.</p>
              <div className="mx-auto mt-6 inline-block rounded-xl bg-muted px-5 py-3"><span className="text-sm text-slate-600">Your Application ID</span><div className="font-display text-xl font-bold text-navy">{done}</div></div>
              <div className="mt-8"><Link to="/" className="inline-flex items-center gap-2 rounded-full bg-royal px-6 py-3 text-sm font-semibold text-white hover:bg-navy">Return to website <ArrowRight className="h-4 w-4" /></Link></div>
            </div>
          ) : (
            <>
              <ol className="mt-10 grid grid-cols-5 gap-2">
                {steps.map((s, i) => (
                  <li key={s} className="text-center">
                    <div className={`h-1.5 rounded-full ${i <= step ? "bg-royal" : "bg-navy/10"}`} />
                    <span className={`mt-2 block text-[11px] font-semibold sm:text-xs ${i === step ? "text-royal" : i < step ? "text-navy" : "text-slate-500"}`}><span className="hidden sm:inline">{i + 1}. </span>{s}</span>
                  </li>
                ))}
              </ol>

              <form onSubmit={submit} noValidate className="mt-6 rounded-3xl border border-border bg-white p-6 shadow-elegant md:p-10">
                <h2 className="font-display text-xl font-bold text-navy">Section {step + 1} — {["Personal Information", "Education Details", "Work Experience", "Job Preferences", "Additional Information"][step]}</h2>
                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  {step === 0 && <>
                    <Field label="First Name" required error={errors.first_name}><input className={inputCls} placeholder="Enter your first name" value={f.first_name} onChange={set("first_name")} maxLength={100} /></Field>
                    <Field label="Last Name / Surname" required error={errors.last_name}><input className={inputCls} placeholder="Enter your last name" value={f.last_name} onChange={set("last_name")} maxLength={100} /></Field>
                    <Field label="Date of Birth (DD/MM/YYYY)" required error={errors.date_of_birth}><input type="date" className={inputCls} value={f.date_of_birth} onChange={set("date_of_birth")} max={new Date().toISOString().slice(0, 10)} /></Field>
                    <Field label="Gender" required error={errors.gender}><Sel value={f.gender} onChange={set("gender")} opts={["Male", "Female", "Other"]} /></Field>
                    <Field label="Phone Number" required error={errors.phone}><input type="tel" className={inputCls} placeholder="Enter your phone number" value={f.phone} onChange={set("phone")} maxLength={16} /></Field>
                    <Field label="Email Address" required error={errors.email}><input type="email" className={inputCls} placeholder="Enter your email address" value={f.email} onChange={set("email")} maxLength={255} /></Field>
                    <Field label="Current City" required error={errors.city}><input className={inputCls} placeholder="Enter your current city" value={f.city} onChange={set("city")} maxLength={100} /></Field>
                    <Field label="CNIC Number" error={errors.cnic}><input className={inputCls} placeholder="Enter your CNIC number" value={f.cnic} onChange={set("cnic")} maxLength={15} /></Field>
                  </>}
                  {step === 1 && <>
                    <Field label="Highest Qualification" required error={errors.highest_qualification}><Sel value={f.highest_qualification} onChange={set("highest_qualification")} opts={["Matric", "Intermediate", "Bachelor's", "Master's", "Other"]} /></Field>
                    <Field label="Field of Study / Major" required error={errors.field_of_study}><input className={inputCls} placeholder="Enter your field of study" value={f.field_of_study} onChange={set("field_of_study")} maxLength={150} /></Field>
                    <Field label="University / College Name" required error={errors.institution_name} full><input className={inputCls} placeholder="Enter institution name" value={f.institution_name} onChange={set("institution_name")} maxLength={200} /></Field>
                  </>}
                  {step === 2 && <>
                    <div className="md:col-span-2">
                      <span className="mb-2 block text-sm font-semibold text-navy">Do you have previous work experience?<span className="text-destructive"> *</span></span>
                      <div className="flex gap-3">
                        {["Yes", "No"].map((o) => (
                          <label key={o} className={`flex cursor-pointer items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold ${f.has_work_experience === o ? "border-royal bg-royal/5 text-royal" : "border-input text-navy"}`}>
                            <input type="radio" name="exp" className="accent-[var(--royal)]" checked={f.has_work_experience === o} onChange={() => setF((p) => ({ ...p, has_work_experience: o, total_experience: o === "No" ? "No Experience" : p.total_experience === "No Experience" ? "" : p.total_experience }))} /> {o}
                          </label>
                        ))}
                      </div>
                      {errors.has_work_experience && <span className="mt-1 block text-xs font-medium text-destructive">{errors.has_work_experience}</span>}
                    </div>
                    <Field label="Total Work Experience" required error={errors.total_experience}><Sel value={f.total_experience} onChange={set("total_experience")} opts={["No Experience", "Less than 1 Year", "1–2 Years", "2–3 Years", "3+ Years"]} /></Field>
                    {!noExp && <>
                      <Field label="Previous Job Title" required={f.has_work_experience === "Yes"} error={errors.previous_job_title}><input className={inputCls} placeholder="Enter your previous job title" value={f.previous_job_title} onChange={set("previous_job_title")} maxLength={150} /></Field>
                      <Field label="Previous Company Name" required={f.has_work_experience === "Yes"} error={errors.previous_company}><input className={inputCls} placeholder="Enter previous company name" value={f.previous_company} onChange={set("previous_company")} maxLength={150} /></Field>
                      <Field label="Key Responsibilities" error={errors.key_responsibilities} full><textarea rows={4} className={inputCls} placeholder="Briefly describe your previous responsibilities" value={f.key_responsibilities} onChange={set("key_responsibilities")} maxLength={2000} /></Field>
                    </>}
                  </>}
                  {step === 3 && <>
                    <Field label="Preferred Shift" required error={errors.preferred_shift}><Sel value={f.preferred_shift} onChange={set("preferred_shift")} opts={["Morning", "Evening", "Night", "Rotational", "Flexible"]} /></Field>
                    <Field label="Expected Salary (PKR)" required error={errors.expected_salary}><input inputMode="numeric" className={inputCls} placeholder="Enter expected salary" value={f.expected_salary} onChange={(e) => setF((p) => ({ ...p, expected_salary: e.target.value.replace(/\D/g, "").slice(0, 7) }))} /></Field>
                    <Field label="Notice Period" required error={errors.notice_period}><Sel value={f.notice_period} onChange={set("notice_period")} opts={["Immediate", "7 Days", "15 Days", "30 Days", "Other"]} /></Field>
                    {f.notice_period === "Other" ? <Field label="Please specify notice period" required error={errors.notice_other}><input className={inputCls} value={f.notice_other} onChange={set("notice_other")} maxLength={80} /></Field> : <div className="hidden md:block" />}
                    <Field label="How did you hear about this vacancy?" required error={errors.vacancy_source}><Sel value={f.vacancy_source} onChange={set("vacancy_source")} opts={["Facebook", "Instagram", "LinkedIn", "WhatsApp", "Referral", "Website", "Other"]} /></Field>
                    {f.vacancy_source === "Referral" && <Field label="Referral Name"><input className={inputCls} value={f.referral_name} onChange={set("referral_name")} maxLength={150} /></Field>}
                    {f.vacancy_source === "Other" && <Field label="Please specify" required error={errors.source_other}><input className={inputCls} value={f.source_other} onChange={set("source_other")} maxLength={80} /></Field>}
                    <Field label="Why are you interested in this role?" required error={errors.interest_reason} full><textarea rows={5} className={inputCls} value={f.interest_reason} onChange={set("interest_reason")} maxLength={2000} /></Field>
                  </>}
                  {step === 4 && <>
                    <Field label="What are your long-term career goals?" required error={errors.career_goals} full><textarea rows={5} className={inputCls} value={f.career_goals} onChange={set("career_goals")} maxLength={2000} /></Field>
                    <div className="md:col-span-2">
                      <span className="mb-1.5 block text-sm font-semibold text-navy">Upload Your Resume (CV)<span className="text-destructive"> *</span></span>
                      <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-royal/30 bg-muted/50 px-6 py-8 text-center transition hover:border-royal">
                        {file ? <FileText className="h-8 w-8 text-royal" /> : <Upload className="h-8 w-8 text-royal" />}
                        <span className="mt-2 text-sm font-semibold text-navy">{file ? file.name : "Click to choose a file"}</span>
                        <span className="mt-1 text-xs text-slate-600">PDF, DOC or DOCX — max 5 MB</span>
                        <input type="file" className="sr-only" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                      </label>
                      {errors.resume && <span className="mt-1 block text-xs font-medium text-destructive">{errors.resume}</span>}
                    </div>
                    <div className="md:col-span-2">
                      <label className="flex items-start gap-3 text-sm text-navy">
                        <input type="checkbox" className="mt-0.5 h-4 w-4 accent-[var(--royal)]" checked={f.consent === "yes"} onChange={(e) => setF((p) => ({ ...p, consent: e.target.checked ? "yes" : "" }))} />
                        <span>I confirm that the information provided in this application is accurate and complete.<span className="text-destructive"> *</span></span>
                      </label>
                      {errors.consent && <span className="mt-1 block text-xs font-medium text-destructive">{errors.consent}</span>}
                    </div>
                  </>}
                </div>

                {failed && <p role="alert" className="mt-6 rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">Something went wrong while submitting your application. Please try again.</p>}

                <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-6">
                  {step > 0 ? <button type="button" onClick={back} disabled={submitting} className="inline-flex items-center gap-2 rounded-full border border-navy/15 px-5 py-3 text-sm font-semibold text-navy hover:border-royal hover:text-royal disabled:opacity-50"><ArrowLeft className="h-4 w-4" /> Back</button> : <span />}
                  {step < 4 ? (
                    <button type="button" onClick={next} className="inline-flex items-center gap-2 rounded-full bg-royal px-6 py-3 text-sm font-semibold text-white hover:bg-navy">Next <ArrowRight className="h-4 w-4" /></button>
                  ) : (
                    <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 rounded-full bg-royal px-6 py-3 text-sm font-bold tracking-wide text-white hover:bg-navy disabled:cursor-not-allowed disabled:opacity-70">
                      {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting Application...</> : "SUBMIT APPLICATION"}
                    </button>
                  )}
                </div>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function Sel({ value, onChange, opts }: { value: string; onChange: (e: { target: { value: string } }) => void; opts: string[] }) {
  return (
    <select className={inputCls} value={value} onChange={onChange}>
      <option value="">Select an option</option>
      {opts.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}
