"use client";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

const api = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
export default function HiringHistoryPage() {
  const [hires, setHires] = useState([]); const [loading, setLoading] = useState(true);
  useEffect(() => { (async () => { const { data } = await authClient.token(); const response = await fetch(`${api}/hires/me`, { headers: { authorization: `Bearer ${data?.token}` } }); if (response.ok) setHires(await response.json()); setLoading(false); })(); }, []);
  return <section className="py-10"><h1 className="text-3xl font-extrabold">Hiring history</h1><div className="mt-6 overflow-x-auto rounded-2xl border bg-white"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-slate-500"><tr><th className="p-4">Lawyer</th><th className="p-4">Specialization</th><th className="p-4">Fee</th><th className="p-4">Date</th><th className="p-4">Status</th></tr></thead><tbody>{loading ? <tr><td className="p-4" colSpan="5">Loading…</td></tr> : hires.length ? hires.map((hire) => <tr key={hire._id} className="border-t"><td className="p-4 font-bold">{hire.lawyerName}</td><td className="p-4">{hire.lawyerSpecialization}</td><td className="p-4">${hire.fee}</td><td className="p-4">{new Date(hire.requestedAt).toLocaleDateString()}</td><td className="p-4 capitalize">{hire.status}</td></tr>) : <tr><td className="p-4" colSpan="5">You have no hiring requests yet.</td></tr>}</tbody></table></div></section>;
}
