"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Calendar, Scale, Send } from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

const api = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export default function LawyerDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hiring, setHiring] = useState(false);

  useEffect(() => { fetch(`${api}/lawyers/${id}`).then((r) => r.ok ? r.json() : null).then(setLawyer).finally(() => setLoading(false)); }, [id]);
  const hire = async () => {
    if (!session) return router.push(`/signin?redirect=/lawyers/${id}`);
    setHiring(true);
    try {
      const { data } = await authClient.token();
      const response = await fetch(`${api}/hires`, { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${data?.token}` }, body: JSON.stringify({ lawyerId: id }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message);
      toast.success("Hiring request sent to this lawyer.");
    } catch (error) { toast.error(error.message || "Could not send the hiring request."); }
    finally { setHiring(false); }
  };
  if (loading) return <div className="py-20 text-center">Loading lawyer profile…</div>;
  if (!lawyer) return <div className="py-20 text-center"><h1 className="text-2xl font-bold">Lawyer not found</h1></div>;
  return <div className="py-10"><div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr]"><img src={lawyer.image} alt={lawyer.name} className="h-full min-h-96 w-full rounded-3xl object-cover"/><div><span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-800">{lawyer.specialization}</span><h1 className="mt-5 text-4xl font-extrabold">{lawyer.name}</h1><p className="mt-4 text-lg leading-8 text-slate-600">{lawyer.bio}</p><div className="mt-8 grid grid-cols-2 gap-4"><Fact icon={<Scale/>} label="Consultation fee" value={`$${lawyer.hourlyRate}/hour`}/><Fact icon={<Calendar/>} label="Availability" value={lawyer.availability || 'Available'}/></div><div className="mt-8 rounded-2xl bg-slate-950 p-6 text-white"><p className="text-sm text-slate-300">Ready to get legal help?</p><button disabled={hiring || lawyer.availability === 'busy'} onClick={hire} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 font-bold text-slate-950 disabled:opacity-50"><Send size={17}/>{hiring ? 'Sending request…' : 'Hire this lawyer'}</button></div></div></div></div>;
}
function Fact({ icon, label, value }) { return <div className="rounded-2xl border p-4"><div className="text-amber-700">{icon}</div><p className="mt-3 text-sm text-slate-500">{label}</p><p className="mt-1 font-bold capitalize">{value}</p></div>; }
