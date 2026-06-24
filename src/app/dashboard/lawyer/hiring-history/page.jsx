"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

const api = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
export default function LawyerHiringHistoryPage() {
  const [hires, setHires] = useState([]); const [token, setToken] = useState();
  useEffect(() => { (async () => { const { data } = await authClient.token(); setToken(data?.token); const response = await fetch(`${api}/hires/lawyer`, { headers: { authorization: `Bearer ${data?.token}` } }); if (response.ok) setHires(await response.json()); })(); }, []);
  const decide = async (id, status) => { const response = await fetch(`${api}/hires/${id}/status`, { method: 'PATCH', headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` }, body: JSON.stringify({ status }) }); if (!response.ok) return toast.error('Could not update this request.'); setHires((items) => items.map((item) => item._id === id ? { ...item, status } : item)); toast.success(`Request ${status}.`); };
  return <section className="py-10"><h1 className="text-3xl font-extrabold">Hiring requests</h1><div className="mt-6 space-y-4">{hires.length ? hires.map((hire) => <article key={hire._id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-white p-5"><div><h2 className="font-bold">{hire.clientEmail}</h2><p className="mt-1 text-sm text-slate-500">Requested {new Date(hire.requestedAt).toLocaleDateString()} · {hire.status}</p></div>{hire.status === 'pending' && <div className="flex gap-3"><button onClick={() => decide(hire._id, 'accepted')} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white">Accept</button><button onClick={() => decide(hire._id, 'rejected')} className="rounded-lg border px-4 py-2 text-sm font-bold">Reject</button></div>}</article>) : <p className="rounded-2xl border border-dashed p-10 text-center text-slate-500">No hiring requests yet.</p>}</div></section>;
}
