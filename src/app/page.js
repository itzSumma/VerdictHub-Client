import LawyerCard from "@/components/LawyerCard";
import Reveal from "@/components/Reveal";
import { ArrowRight, BadgeCheck, Building2, HeartHandshake, Scale, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

const api = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

async function getLawyers(path) {
  try {
    const response = await fetch(`${api}${path}`, { cache: "no-store" });
    return response.ok ? response.json() : [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const [featured, top] = await Promise.all([
    getLawyers("/lawyers/featured"),
    getLawyers("/lawyers/top"),
  ]);

  return (
    <div className="pb-20">
      <Reveal className="relative mt-8 overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-16 text-white shadow-2xl shadow-slate-950/20 md:px-14 lg:py-24">
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(251,191,36,.18),transparent_35%,rgba(255,255,255,.05)_70%)]" />
        <div className="absolute -right-24 top-0 h-80 w-80 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="absolute -bottom-28 left-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="relative grid gap-12 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-amber-200">
              <Sparkles size={15} /> Premium legal hiring
            </span>
            <h1 className="mt-7 max-w-4xl text-5xl font-black leading-[1.03] tracking-tight md:text-7xl">Find & Hire Expert Legal Counsel</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">VerdictHub connects clients with verified lawyers through polished profiles, secure payments, and role-based dashboards built for real legal workflows.</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link href="/lawyers" className="gold-gradient inline-flex items-center gap-2 rounded-full px-7 py-4 font-black text-slate-950 shadow-xl shadow-amber-500/20 transition hover:-translate-y-1">
                Browse Lawyers <ArrowRight size={18} />
              </Link>
              <Link href="/signup" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-7 py-4 font-black text-white backdrop-blur transition hover:bg-white/15">
                Join VerdictHub
              </Link>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <Stat value="8+" label="Legal categories" />
              <Stat value="24/7" label="Online access" />
              <Stat value="Stripe" label="Secure payments" />
            </div>
          </div>

          <div className="premium-card relative rounded-[2rem] p-5 text-slate-950">
            <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white">
              <p className="text-sm font-bold text-amber-200">Trusted expert preview</p>
              <div className="mt-5 space-y-4">
                {(top.length ? top : featured).slice(0, 3).map((lawyer) => (
                  <Link key={lawyer._id} href={`/lawyers/${lawyer._id}`} className="flex items-center gap-4 rounded-2xl bg-white/10 p-3 transition hover:bg-white/15">
                    <img src={lawyer.image} alt={lawyer.name} className="h-16 w-16 rounded-2xl object-cover" />
                    <div className="min-w-0">
                      <p className="truncate font-black">{lawyer.name}</p>
                      <p className="text-sm text-slate-300">{lawyer.specialization} • ${lawyer.hourlyRate}/hr</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <Mini icon={<ShieldCheck />} title="Verified profiles" />
              <Mini icon={<BadgeCheck />} title="Role dashboards" />
            </div>
          </div>
        </div>
      </Reveal>

      <SectionTitle eyebrow="Professionals you can trust" title="Featured lawyers" href="/lawyers" />
      <div className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((lawyer, index) => <Reveal key={lawyer._id} delay={index * 0.05}><LawyerCard lawyer={lawyer} /></Reveal>)}
      </div>
      {!featured.length && <EmptyState text="New verified lawyers will appear here shortly." />}

      <Reveal className="mt-24 grid gap-6 rounded-[2rem] border border-amber-200/50 bg-amber-50/80 p-8 shadow-xl shadow-amber-900/5 md:grid-cols-3">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-amber-700">How VerdictHub helps</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight">Legal help without the runaround.</h2>
        </div>
        <Info icon={<Scale />} title="Verified expertise" text="Explore clear legal profiles, specialties, fees, and availability before hiring." />
        <Info icon={<HeartHandshake />} title="Simple hiring" text="Send a request, wait for acceptance, then pay securely from your dashboard." />
      </Reveal>

      <SectionTitle eyebrow="Most trusted this month" title="Top legal experts" />
      <div className="mt-8 grid gap-7 md:grid-cols-3">
        {top.map((lawyer, index) => <Reveal key={lawyer._id} delay={index * 0.06}><LawyerCard lawyer={lawyer} /></Reveal>)}
      </div>

      <section className="mt-24">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-amber-700">Find the right specialty</p>
        <h2 className="mt-3 text-4xl font-black tracking-tight">Legal categories</h2>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {["Criminal", "Corporate", "Family", "Property", "Immigration", "Employment", "Tax", "Cyber Law"].map((name) => (
            <Link key={name} href={`/lawyers?specialization=${encodeURIComponent(name)}`} className="group rounded-[1.5rem] border border-white/80 bg-white p-5 font-black shadow-lg shadow-slate-900/5 transition hover:-translate-y-1 hover:border-amber-300 hover:shadow-xl">
              <Building2 className="mb-4 text-amber-700 transition group-hover:scale-110" />{name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function SectionTitle({ eyebrow, title, href }) {
  return (
    <section className="mt-24 flex items-end justify-between gap-4">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.22em] text-amber-700">{eyebrow}</p>
        <h2 className="mt-2 text-4xl font-black tracking-tight">{title}</h2>
      </div>
      {href && <Link href={href} className="hidden rounded-full bg-white px-5 py-3 text-sm font-black text-amber-800 shadow-sm ring-1 ring-slate-200 transition hover:bg-amber-50 sm:inline-flex">View all →</Link>}
    </section>
  );
}

function Stat({ value, label }) {
  return <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur"><p className="text-2xl font-black text-amber-200">{value}</p><p className="mt-1 text-sm text-slate-300">{label}</p></div>;
}

function Mini({ icon, title }) {
  return <div className="rounded-2xl bg-amber-50 p-4 text-slate-950"><div className="text-amber-700">{icon}</div><p className="mt-3 text-sm font-black">{title}</p></div>;
}

function Info({ icon, title, text }) {
  return <div className="rounded-[1.5rem] bg-white p-6 shadow-sm"><div className="w-fit rounded-2xl bg-slate-950 p-3 text-amber-300">{icon}</div><h3 className="mt-5 text-lg font-black">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></div>;
}

function EmptyState({ text }) {
  return <p className="mt-8 rounded-[1.5rem] border border-dashed border-slate-300 bg-white/70 p-10 text-center text-slate-500">{text}</p>;
}
