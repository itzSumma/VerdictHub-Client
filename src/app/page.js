import LawyerCard from "@/components/LawyerCard";
import Reveal from "@/components/Reveal";
import { ArrowRight, Building2, HeartHandshake, Scale } from "lucide-react";
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
    <div className="pb-16">
      <Reveal className="relative mt-6 overflow-hidden rounded-3xl bg-slate-950 px-6 py-20 text-white md:px-14 md:py-28">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl" />
        <p className="relative text-sm font-bold uppercase tracking-[0.25em] text-amber-300">Legal clarity, when it matters</p>
        <h1 className="relative mt-5 max-w-3xl text-4xl font-extrabold leading-tight md:text-6xl">Find & Hire Expert Legal Counsel</h1>
        <p className="relative mt-6 max-w-2xl text-lg leading-8 text-slate-300">VerdictHub connects you with experienced lawyers across every major area of law — transparent expertise, straightforward hiring.</p>
        <Link href="/lawyers" className="relative mt-9 inline-flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-amber-300">
          Browse Lawyers <ArrowRight size={18} />
        </Link>
      </Reveal>

      <section className="mt-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-amber-700">Professionals you can trust</p>
            <h2 className="mt-2 text-3xl font-bold">Featured lawyers</h2>
          </div>
          <Link href="/lawyers" className="font-semibold text-amber-800">View all →</Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((lawyer, index) => <Reveal key={lawyer._id} delay={index * 0.05}><LawyerCard lawyer={lawyer} /></Reveal>)}
        </div>
        {!featured.length && <p className="mt-8 rounded-2xl border border-dashed p-10 text-center text-slate-500">New verified lawyers will appear here shortly.</p>}
      </section>

      <Reveal className="mt-20 grid gap-6 rounded-3xl bg-amber-50 p-8 md:grid-cols-3">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-amber-700">How VerdictHub helps</p>
          <h2 className="mt-3 text-3xl font-bold">Legal help without the runaround.</h2>
        </div>
        <Info icon={<Scale />} title="Verified expertise" text="Explore clear legal profiles, specialties, and consultation rates." />
        <Info icon={<HeartHandshake />} title="Simple hiring" text="Send a hiring request and pay only once your lawyer accepts." />
      </Reveal>

      <section className="mt-20">
        <p className="text-sm font-bold uppercase tracking-widest text-amber-700">Most trusted this month</p>
        <h2 className="mt-2 text-3xl font-bold">Top legal experts</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {top.map((lawyer, index) => <Reveal key={lawyer._id} delay={index * 0.06}><LawyerCard lawyer={lawyer} /></Reveal>)}
        </div>
      </section>

      <section className="mt-20">
        <p className="text-sm font-bold uppercase tracking-widest text-amber-700">Find the right specialty</p>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {["Criminal", "Corporate", "Family", "Property", "Immigration", "Employment", "Tax", "Cyber Law"].map((name) => (
            <Link key={name} href={`/lawyers?specialization=${encodeURIComponent(name)}`} className="rounded-2xl border bg-white p-5 font-bold transition hover:border-amber-400 hover:bg-amber-50">
              <Building2 className="mb-3 text-amber-700" />{name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function Info({ icon, title, text }) {
  return <div className="rounded-2xl bg-white p-6"><div className="w-fit rounded-xl bg-slate-950 p-3 text-amber-300">{icon}</div><h3 className="mt-4 font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></div>;
}
