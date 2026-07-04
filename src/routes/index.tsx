import { createFileRoute } from "@tanstack/react-router";
import { motion, useInView, useMotionValue, useSpring, type Variants } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Headphones,
  PhoneCall,
  HeartPulse,
  Sun,
  Code2,
  ShieldCheck,
  BarChart3,
  UserCog,
  Users2,
  Wallet,
  Sparkles,
  Menu,
  X,
  Linkedin,
  Facebook,
  Twitter,
  Instagram,
  Building2,
  Stethoscope,
  ShieldHalf,
  Radio,
  ShoppingBag,
  Store,
  Cpu,
  Briefcase,
  Quote,
  Star,
} from "lucide-react";
import heroImg from "@/assets/hero-callcenter.jpg";
import ceoImg from "@/assets/ceo-portrait.jpg";
import heroBg from "@/assets/hero-bg.jpg";

export const Route = createFileRoute("/")({
  component: HomePage,
});

/* ---------- Small helpers ---------- */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay: i * 0.06 },
  }),
};

function Section({
  id,
  className = "",
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`py-20 md:py-28 ${className}`}>
      <div className="container-x">{children}</div>
    </section>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-royal/20 bg-royal/5 px-3 py-1 text-xs font-medium tracking-wider text-royal uppercase">
      <Sparkles className="h-3.5 w-3.5" />
      {children}
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  align?: "center" | "left";
}) {
  return (
    <div
      className={`mb-14 ${align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}`}
    >
      {eyebrow && (
        <div className={`mb-4 ${align === "center" ? "flex justify-center" : ""}`}>
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
      )}
      <motion.h2
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeUp}
        className="font-display text-3xl font-bold text-navy sm:text-4xl md:text-5xl"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          custom={1}
          className="mt-4 text-base text-muted-foreground md:text-lg"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}

/* ---------- Header ---------- */

const nav = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Industries", href: "#industries" },
  { label: "Contact", href: "#contact" },
];

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "glass shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container-x grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-4">
        <a href="#top" className="flex min-w-0 items-center gap-2.5">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-navy to-royal text-white shadow-elegant">
            <Headphones className="h-5 w-5" />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-display text-base font-bold leading-tight text-navy">
              Classify Enterprises
            </span>
            <span className="hidden text-[10px] font-medium tracking-widest text-muted-foreground uppercase sm:block">
              BPO • Call Center
            </span>
          </span>
        </a>
        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-1 lg:flex">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="rounded-full px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-royal/10 hover:text-royal"
              >
                {n.label}
              </a>
            ))}
          </nav>
          <a
            href="#contact"
            className="hidden shrink-0 items-center gap-2 rounded-full bg-royal px-5 py-2.5 text-sm font-semibold text-white shadow-elegant transition-all hover:-translate-y-0.5 hover:bg-navy hover:shadow-glow md:inline-flex"
          >
            Get Started <ArrowRight className="h-4 w-4" />
          </a>
          <button
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full border border-navy/10 bg-white text-navy lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-black/5 bg-white lg:hidden">
          <div className="container-x flex flex-col py-3">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-navy hover:bg-muted"
              >
                {n.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

/* ---------- Hero ---------- */

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden gradient-hero pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-royal/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
      <div className="container-x relative grid gap-14 lg:grid-cols-[1.05fr_1fr] lg:items-center">
        <div>
          <motion.div initial="hidden" animate="show" variants={fadeUp}>
            <span className="inline-flex items-center gap-2 rounded-full border border-royal/20 bg-white/80 px-3 py-1 text-xs font-semibold tracking-wider text-royal uppercase shadow-sm backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              Enterprise BPO Solutions
            </span>
          </motion.div>
          <motion.h1
            initial="hidden"
            animate="show"
            variants={fadeUp}
            custom={1}
            className="mt-6 font-display text-4xl leading-[1.05] font-bold text-navy sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Connecting People. <br />
            <span className="text-gradient-gold">Delivering Excellence.</span>
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="show"
            variants={fadeUp}
            custom={2}
            className="mt-6 max-w-xl text-base leading-relaxed text-slate-700 md:text-lg"
          >
            Professional BPO and customer support solutions helping businesses scale with highly
            trained teams, transparent reporting and exceptional customer experiences.
          </motion.p>
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            custom={3}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full bg-royal px-6 py-3.5 text-sm font-semibold text-white shadow-elegant transition-all hover:-translate-y-0.5 hover:bg-navy"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-navy/15 bg-white px-6 py-3.5 text-sm font-semibold text-navy shadow-sm transition-all hover:-translate-y-0.5 hover:border-royal hover:text-royal"
            >
              Contact Us
            </a>
          </motion.div>
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            custom={4}
            className="mt-10 grid max-w-md grid-cols-3 gap-6"
          >
            {[
              { k: "99%", v: "Satisfaction" },
              { k: "24/7", v: "Support" },
              { k: "100%", v: "Quality Focus" },
            ].map((s) => (
              <div key={s.v}>
                <div className="font-display text-2xl font-bold text-navy md:text-3xl">{s.k}</div>
                <div className="text-xs text-slate-600 uppercase tracking-wider mt-1 font-medium">{s.v}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] as const, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-tr from-royal/15 to-gold/15 blur-2xl" />
          <div className="relative overflow-hidden rounded-[1.75rem] border border-white bg-white shadow-elegant">
            <img
              src={heroImg}
              alt="Professional call center team at work"
              width={1280}
              height={1024}
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl bg-white/95 px-4 py-3 shadow-lg backdrop-blur">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-royal text-white">
                  <PhoneCall className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-sm font-semibold text-navy">Live agents online</div>
                  <div className="text-xs text-slate-600">Average response · 20s</div>
                </div>
              </div>
              <div className="flex -space-x-2">
                {["#D4AF37", "#2563EB", "#93C5FD"].map((c) => (
                  <span
                    key={c}
                    className="h-8 w-8 rounded-full border-2 border-white"
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- Trusted By ---------- */

function TrustedBy() {
  const logos = ["NORTHWIND", "ACME CORP", "GLOBEX", "UMBRELLA", "STARK & CO", "INITECH", "SOYLENT"];
  return (
    <section className="border-y border-black/5 bg-white py-10">
      <div className="container-x">
        <p className="text-center text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Trusted by international businesses
        </p>
        <div className="mt-6 grid grid-cols-2 items-center gap-x-8 gap-y-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {logos.map((l) => (
            <div
              key={l}
              className="text-center font-display text-sm font-bold tracking-widest text-navy/40 transition-colors hover:text-navy/70"
            >
              {l}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- About ---------- */

function About() {
  return (
    <Section id="about" className="bg-white">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <Eyebrow>About</Eyebrow>
          <motion.h2
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mt-4 font-display text-3xl font-bold text-navy sm:text-4xl md:text-5xl"
          >
            About Classify Enterprises
          </motion.h2>
          <div className="mt-6 space-y-5 text-muted-foreground md:text-lg">
            <p>
              Classify Enterprises is a Pakistan-based BPO and Call Center company providing
              inbound support, outbound campaigns, Medicare support and Solar customer service.
            </p>
            <p>
              We help businesses outsource customer interactions with professionally trained agents
              while maintaining quality assurance and transparent reporting.
            </p>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {[
            {
              title: "Our Mission",
              icon: <ShieldCheck className="h-5 w-5" />,
              body: "To deliver dependable, high-quality customer support that helps our clients grow while creating career opportunities for our people.",
            },
            {
              title: "Our Vision",
              icon: <Sparkles className="h-5 w-5" />,
              body: "To become one of Pakistan's most trusted outsourcing companies by combining exceptional people with disciplined processes.",
            },
          ].map((c, i) => (
            <motion.div
              key={c.title}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="group relative rounded-2xl border border-black/5 bg-gradient-to-b from-white to-surface p-7 shadow-[0_1px_0_rgba(0,0,0,0.04)] transition-all hover:-translate-y-1 hover:shadow-elegant"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-navy text-gold">
                {c.icon}
              </span>
              <h3 className="mt-5 font-display text-xl font-bold text-navy">{c.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
              <span className="absolute inset-x-7 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ---------- Services ---------- */

const services = [
  {
    icon: <Headphones className="h-6 w-6" />,
    title: "Inbound Customer Support",
    items: ["Customer Care", "Help Desk", "Complaint Resolution", "Order Tracking", "Technical Support"],
  },
  {
    icon: <PhoneCall className="h-6 w-6" />,
    title: "Outbound Customer Support",
    items: ["Telemarketing", "Lead Generation", "Appointment Setting", "Follow-up Campaigns", "Customer Surveys"],
  },
  {
    icon: <HeartPulse className="h-6 w-6" />,
    title: "Medicare Support",
    items: ["Enrollment Assistance", "Customer Queries", "Verification Calls", "Plan Support"],
  },
  {
    icon: <Sun className="h-6 w-6" />,
    title: "Solar Customer Support",
    items: ["Lead Qualification", "Appointment Booking", "Customer Assistance", "CRM Reporting"],
  },
  {
    icon: <Code2 className="h-6 w-6" />,
    title: "Software Development",
    items: ["Business websites, custom software and digital solutions."],
    badge: "Coming Soon",
  },
];

function Services() {
  return (
    <Section id="services" className="bg-surface">
      <SectionHeading
        eyebrow="Services"
        title={
          <>
            Solutions built for <span className="text-royal">global operations</span>
          </>
        }
        subtitle="End-to-end customer support and campaign management delivered by trained agents and mature processes."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <motion.article
            key={s.title}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            custom={i}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white p-7 shadow-[0_1px_0_rgba(0,0,0,0.04)] transition-all hover:-translate-y-1 hover:shadow-elegant"
          >
            <div className="flex items-start justify-between">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-navy to-royal text-white shadow-elegant">
                {s.icon}
              </span>
              {s.badge && (
                <span className="rounded-full bg-gold/15 px-3 py-1 text-[10px] font-semibold tracking-wider text-gold-foreground uppercase">
                  {s.badge}
                </span>
              )}
            </div>
            <h3 className="mt-6 font-display text-xl font-bold text-navy">{s.title}</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              {s.items.map((it) => (
                <li key={it} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-royal" />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
            <span className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-royal/10 opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
          </motion.article>
        ))}
      </div>
    </Section>
  );
}

/* ---------- Why Choose Us ---------- */

const reasons = [
  { icon: <Users2 className="h-5 w-5" />, title: "Trained Professionals" },
  { icon: <ShieldCheck className="h-5 w-5" />, title: "Quality Assurance" },
  { icon: <BarChart3 className="h-5 w-5" />, title: "Transparent Reporting" },
  { icon: <UserCog className="h-5 w-5" />, title: "Founder-led Management" },
  { icon: <Sparkles className="h-5 w-5" />, title: "Flexible Team Scaling" },
  { icon: <Wallet className="h-5 w-5" />, title: "Cost-effective Outsourcing" },
];

function WhyUs() {
  return (
    <Section className="bg-white">
      <SectionHeading
        eyebrow="Why Choose Us"
        title={<>A partner that <span className="text-royal">operates like your team</span></>}
        subtitle="Six reasons enterprises trust Classify to represent their brand every day."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reasons.map((r, i) => (
          <motion.div
            key={r.title}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={i}
            className="flex items-center gap-4 rounded-2xl border border-black/5 bg-gradient-to-r from-surface to-white p-5 transition-all hover:-translate-y-0.5 hover:border-royal/20 hover:shadow-elegant"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy text-gold">
              {r.icon}
            </span>
            <div className="min-w-0">
              <div className="font-display font-semibold text-navy">{r.title}</div>
            </div>
            <CheckCircle2 className="ml-auto h-5 w-5 shrink-0 text-royal" />
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ---------- Process Timeline ---------- */

const process = [
  { n: "01", title: "Consultation", body: "Discovery call to understand goals, volumes and success metrics." },
  { n: "02", title: "Proposal & SLA", body: "A tailored proposal with pricing, KPIs and service-level agreement." },
  { n: "03", title: "Hiring & Training", body: "Recruit, screen and train agents on your product and voice." },
  { n: "04", title: "Launch & Reporting", body: "Go-live, monitor performance and deliver transparent reports." },
];

function Process() {
  return (
    <Section id="process" className="relative overflow-hidden bg-gradient-to-b from-white to-[#EFF6FF]">
      <div className="relative">
        <SectionHeading
          eyebrow="Our Process"
          title={<>From first call to <span className="text-royal">full performance</span></>}
          subtitle="A four-step engagement designed for a clean launch and measurable outcomes."
        />
        <div className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="pointer-events-none absolute left-0 right-0 top-14 hidden h-px bg-gradient-to-r from-transparent via-royal/30 to-transparent lg:block" />
          {process.map((p, i) => (
            <motion.div
              key={p.n}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-elegant"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-royal font-display font-bold text-white shadow-sm">
                  {p.n}
                </span>
                <span className="h-px flex-1 bg-slate-200" />
              </div>
              <h3 className="mt-5 font-display text-xl font-bold text-navy">{p.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{p.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ---------- Industries ---------- */

const industries = [
  { icon: <Stethoscope className="h-5 w-5" />, name: "Healthcare" },
  { icon: <ShieldHalf className="h-5 w-5" />, name: "Insurance" },
  { icon: <Sun className="h-5 w-5" />, name: "Solar Energy" },
  { icon: <Radio className="h-5 w-5" />, name: "Telecommunications" },
  { icon: <ShoppingBag className="h-5 w-5" />, name: "E-commerce" },
  { icon: <Store className="h-5 w-5" />, name: "Retail" },
  { icon: <Cpu className="h-5 w-5" />, name: "Technology" },
  { icon: <Briefcase className="h-5 w-5" />, name: "Professional Services" },
];

function Industries() {
  return (
    <Section id="industries" className="bg-surface">
      <SectionHeading
        eyebrow="Industries We Serve"
        title={<>Experience across <span className="text-royal">regulated and consumer</span> sectors</>}
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {industries.map((it, i) => (
          <motion.div
            key={it.name}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={i}
            className="group flex flex-col items-start gap-4 rounded-2xl border border-black/5 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-elegant"
          >
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-royal/10 text-royal transition-colors group-hover:bg-navy group-hover:text-gold">
              {it.icon}
            </span>
            <div className="font-display font-semibold text-navy">{it.name}</div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ---------- Stats with animated counters ---------- */

function Counter({ to, suffix = "", plain }: { to?: number; suffix?: string; plain?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { damping: 20, stiffness: 60 });
  const [display, setDisplay] = useState("0");
  useEffect(() => {
    if (!inView || to === undefined) return;
    mv.set(to);
    const unsub = spring.on("change", (v) => setDisplay(Math.round(v).toString()));
    return () => unsub();
  }, [inView, mv, spring, to]);
  return (
    <span ref={ref}>
      {plain ?? display}
      {suffix}
    </span>
  );
}

const stats = [
  { label: "Client Satisfaction", to: 99, suffix: "%" },
  { label: "Support", plain: "24/7" },
  { label: "Quality Focus", to: 100, suffix: "%" },
  { label: "Scalable Teams", plain: "Fast" },
];

function Stats() {
  return (
    <Section className="bg-white">
      <div className="rounded-3xl bg-gradient-to-br from-navy via-navy to-[oklch(0.16_0.05_265)] p-8 text-white shadow-elegant md:p-14">
        <div className="grid gap-8 md:grid-cols-4 md:gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="text-center md:text-left"
            >
              <div className="font-display text-5xl font-bold text-gradient-gold md:text-6xl">
                <Counter to={s.to} suffix={s.suffix} plain={s.plain} />
              </div>
              <div className="mt-2 text-sm text-white/70 uppercase tracking-widest">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ---------- Testimonials ---------- */

const testimonials = [
  {
    name: "Jonathan Reeves",
    role: "COO, Northwind Health",
    quote:
      "Classify built us a dedicated Medicare team in weeks. Response times dropped and CSAT climbed. A truly reliable partner.",
  },
  {
    name: "Amelia Carter",
    role: "VP Customer Success, Solaris Energy",
    quote:
      "Their agents feel like part of our company. Lead quality, reporting and speed have all exceeded expectations.",
  },
  {
    name: "David Thompson",
    role: "Founder, Retail Circle",
    quote:
      "Transparent, disciplined and easy to work with. Classify scaled our support seamlessly through peak season.",
  },
];

function Testimonials() {
  return (
    <Section className="bg-surface">
      <SectionHeading
        eyebrow="Testimonials"
        title={<>What our clients <span className="text-royal">say about us</span></>}
      />
      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <motion.figure
            key={t.name}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={i}
            className="relative flex flex-col rounded-2xl border border-black/5 bg-white p-7 shadow-[0_1px_0_rgba(0,0,0,0.04)] transition-all hover:-translate-y-1 hover:shadow-elegant"
          >
            <Quote className="h-8 w-8 text-royal/25" />
            <blockquote className="mt-4 grow text-[15px] leading-relaxed text-navy/85">
              "{t.quote}"
            </blockquote>
            <div className="mt-6 flex items-center gap-3 border-t border-black/5 pt-5">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-navy to-royal font-display font-bold text-white">
                {t.name.split(" ").map((n) => n[0]).join("")}
              </span>
              <div className="min-w-0">
                <figcaption className="truncate font-semibold text-navy">{t.name}</figcaption>
                <div className="truncate text-xs text-muted-foreground">{t.role}</div>
              </div>
              <div className="ml-auto flex gap-0.5 text-gold">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
            </div>
          </motion.figure>
        ))}
      </div>
    </Section>
  );
}

/* ---------- CEO ---------- */

function CEO() {
  return (
    <Section className="bg-white">
      <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
          className="relative"
        >
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-royal/25 to-gold/25 blur-2xl" />
          <div className="relative overflow-hidden rounded-[1.75rem] border border-black/5 shadow-elegant">
            <img
              src={ceoImg}
              alt="Ahmad Saleem, Founder & CEO"
              width={896}
              height={1120}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-5 left-6 rounded-2xl bg-navy px-5 py-3 text-white shadow-elegant">
            <div className="text-[10px] font-medium tracking-widest text-gold uppercase">Founder & CEO</div>
            <div className="font-display text-lg font-bold">Ahmad Saleem</div>
          </div>
        </motion.div>
        <div>
          <Eyebrow>Leadership</Eyebrow>
          <h2 className="mt-4 font-display text-3xl font-bold text-navy sm:text-4xl md:text-5xl">
            A message from our <span className="text-royal">Founder</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            "At Classify Enterprises, our commitment is simple — treat every client's customer
            like our own. We combine disciplined operations with a culture of care so that
            excellence isn't an event, it's a habit. Thank you for trusting us with your
            customer relationships."
          </p>
          <div className="mt-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-black/10" />
            <span className="font-display text-xl font-semibold text-navy">— Ahmad Saleem</span>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ---------- CTA ---------- */

function CTA() {
  return (
    <Section className="bg-surface">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy to-[oklch(0.16_0.05_265)] p-10 text-center text-white shadow-elegant md:p-16">
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-royal/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
        <div className="relative mx-auto max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wider text-white uppercase backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            Get in touch
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            Ready to outsource your <span className="text-gradient-gold">customer support</span>?
          </h2>
          <p className="mt-4 text-white/85 md:text-lg">
            Let's build a team that grows your business.
          </p>
          <a
            href="#contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-semibold text-navy shadow-elegant transition-all hover:-translate-y-0.5 hover:bg-gold"
          >
            Schedule Consultation <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </Section>
  );
}

/* ---------- Contact ---------- */

function Contact() {
  return (
    <Section id="contact" className="bg-white">
      <SectionHeading
        eyebrow="Contact"
        title={<>Talk to our <span className="text-royal">team</span></>}
        subtitle="Share a few details and we'll respond within one business day."
      />
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5">
          {[
            {
              icon: <MapPin className="h-5 w-5" />,
              title: "Office",
              body: "GigaMall World Trade Center, Floor 3, Office 305, Islamabad, Pakistan",
            },
            { icon: <Phone className="h-5 w-5" />, title: "Phone", body: "+92 333 1509191" },
            {
              icon: <Mail className="h-5 w-5" />,
              title: "Email",
              body: "classifyenterprises.services@gmail.com",
            },
            { icon: <Building2 className="h-5 w-5" />, title: "Hours", body: "24 / 7 Support Operations" },
          ].map((c) => (
            <div
              key={c.title}
              className="flex items-start gap-4 rounded-2xl border border-black/5 bg-surface p-5"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy text-gold">
                {c.icon}
              </span>
              <div className="min-w-0">
                <div className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                  {c.title}
                </div>
                <div className="mt-1 break-words font-medium text-navy">{c.body}</div>
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="rounded-3xl border border-black/5 bg-gradient-to-b from-white to-surface p-6 shadow-elegant md:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Name" placeholder="Your full name" />
            <Field label="Company" placeholder="Company name" />
            <Field label="Email" type="email" placeholder="you@company.com" />
            <Field label="Phone" placeholder="+1 555 000 0000" />
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold tracking-wider text-navy/70 uppercase">
                Service Required
              </label>
              <select className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-navy shadow-sm focus:border-royal focus:outline-none focus:ring-4 focus:ring-royal/15">
                <option>Inbound Customer Support</option>
                <option>Outbound Customer Support</option>
                <option>Medicare Support</option>
                <option>Solar Customer Support</option>
                <option>Software Development</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold tracking-wider text-navy/70 uppercase">
                Message
              </label>
              <textarea
                rows={5}
                placeholder="Tell us about your project..."
                className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-navy shadow-sm focus:border-royal focus:outline-none focus:ring-4 focus:ring-royal/15"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3.5 text-sm font-semibold text-white shadow-elegant transition-transform hover:-translate-y-0.5 hover:bg-royal"
          >
            Send Message <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </Section>
  );
}

function Field({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold tracking-wider text-navy/70 uppercase">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-navy shadow-sm focus:border-royal focus:outline-none focus:ring-4 focus:ring-royal/15"
      />
    </div>
  );
}

/* ---------- Footer ---------- */

function Footer() {
  return (
    <footer className="bg-navy text-white/80">
      <div className="container-x grid gap-10 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold text-navy">
              <Headphones className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-bold text-white">Classify Enterprises</span>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
            Connecting People. Delivering Excellence. Premium BPO and customer support solutions
            for international businesses.
          </p>
          <div className="mt-6 flex gap-3">
            {[Linkedin, Twitter, Facebook, Instagram].map((Ic, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social link"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-colors hover:border-gold hover:bg-gold hover:text-navy"
              >
                <Ic className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <div className="font-display text-sm font-semibold tracking-widest text-white uppercase">
            Quick Links
          </div>
          <ul className="mt-5 space-y-3 text-sm">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="text-white/60 transition-colors hover:text-gold">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="font-display text-sm font-semibold tracking-widest text-white uppercase">
            Reach Us
          </div>
          <ul className="mt-5 space-y-3 text-sm text-white/60">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span>Islamabad, Pakistan</span>
            </li>
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span>+92 333 1509191</span>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span className="break-all">classifyenterprises.services@gmail.com</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/50 md:flex-row">
          <span>© 2026 Classify Enterprises. All rights reserved.</span>
          <span>Connecting People. Delivering Excellence.</span>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Page ---------- */

function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <TrustedBy />
        <About />
        <Services />
        <WhyUs />
        <Process />
        <Industries />
        <Stats />
        <Testimonials />
        <CEO />
        <CTA />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
