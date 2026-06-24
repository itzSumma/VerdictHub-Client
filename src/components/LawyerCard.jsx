import Link from "next/link";
import { Scale, Star } from "lucide-react";

export default function LawyerCard({ lawyer }) {
  return (
    <Link href={`/lawyers/${lawyer._id}`} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <img src={lawyer.image} alt={lawyer.name} className="h-52 w-full object-cover" />
      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">{lawyer.specialization}</span>
          <span className={`text-xs font-semibold ${lawyer.availability === 'busy' ? 'text-rose-600' : 'text-emerald-600'}`}>{lawyer.availability || 'available'}</span>
        </div>
        <h3 className="mt-4 text-lg font-bold text-slate-900">{lawyer.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{lawyer.bio}</p>
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
          <span className="flex items-center gap-1 text-sm text-slate-500"><Scale size={15} /> Verified counsel</span>
          <strong className="text-slate-900">${lawyer.hourlyRate}/hr</strong>
        </div>
      </div>
    </Link>
  );
}
