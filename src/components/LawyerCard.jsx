import { BadgeCheck, BriefcaseBusiness, Scale, Star } from "lucide-react";
import Link from "next/link";

export default function LawyerCard({ lawyer }) {
  const busy = lawyer.availability === "busy";

  return (
    <Link href={`/lawyers/${lawyer._id}`} className="group block h-full overflow-hidden rounded-[1.75rem] border border-white/70 bg-white shadow-xl shadow-slate-900/7 ring-1 ring-slate-900/5 transition duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-900/10">
      <div className="relative h-60 overflow-hidden bg-slate-200">
        <img src={lawyer.image} alt={lawyer.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/5 to-transparent" />
        <span className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-black shadow-lg ${busy ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}>
          {busy ? "Busy" : "Available"}
        </span>
        <div className="absolute bottom-4 left-4 right-4">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-amber-800 backdrop-blur">
            <Scale size={13} /> {lawyer.specialization}
          </span>
          <h3 className="mt-3 text-2xl font-black text-white">{lawyer.name}</h3>
        </div>
      </div>

      <div className="p-5">
        <p className="line-clamp-2 min-h-12 text-sm leading-6 text-slate-600">{lawyer.bio}</p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="flex items-center gap-1 text-xs font-bold text-slate-500"><BriefcaseBusiness size={14} /> Hires</p>
            <p className="mt-1 text-lg font-black text-slate-950">{lawyer.hireCount || 0}</p>
          </div>
          <div className="rounded-2xl bg-amber-50 p-3">
            <p className="flex items-center gap-1 text-xs font-bold text-amber-700"><Star size={14} /> Fee</p>
            <p className="mt-1 text-lg font-black text-slate-950">${lawyer.hourlyRate}/hr</p>
          </div>
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
          <span className="flex items-center gap-1 text-sm font-bold text-emerald-700"><BadgeCheck size={16} /> Verified</span>
          <span className="text-sm font-black text-slate-950 transition group-hover:text-amber-700">View profile →</span>
        </div>
      </div>
    </Link>
  );
}
