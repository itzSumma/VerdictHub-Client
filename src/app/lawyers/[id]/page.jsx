"use client";

import { api, authorizedFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { BadgeCheck, Calendar, MessageSquare, Scale, Send, Star } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function LawyerDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [lawyer, setLawyer] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hiring, setHiring] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`${api}/lawyers/${id}`).then((r) => r.ok ? r.json() : null),
      fetch(`${api}/comments/${id}`).then((r) => r.ok ? r.json() : []),
    ]).then(([profile, feedback]) => {
      setLawyer(profile);
      setComments(feedback);
    }).finally(() => setLoading(false));
  }, [id]);

  const hire = async () => {
    if (!session) return router.push(`/signin?redirect=/lawyers/${id}`);
    setHiring(true);
    try {
      const { data } = await authClient.token();
      const response = await authorizedFetch("/hires", data?.token, {
        method: "POST",
        body: JSON.stringify({ lawyerId: id }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message);
      toast.success("Hiring request sent to this lawyer.");
      setConfirmOpen(false);
    } catch (error) {
      toast.error(error.message || "Could not send the hiring request.");
    } finally {
      setHiring(false);
    }
  };

  const submitComment = async (event) => {
    event.preventDefault();
    if (!session) return router.push(`/signin?redirect=/lawyers/${id}`);
    const form = new FormData(event.currentTarget);
    const { data } = await authClient.token();
    const response = await authorizedFetch("/comments", data?.token, {
      method: "POST",
      body: JSON.stringify({ lawyerId: id, text: form.get("text"), rating: form.get("rating") }),
    });
    const payload = await response.json();
    if (!response.ok) return toast.error(payload.message || "Hire this lawyer before commenting.");
    toast.success("Comment posted.");
    setComments((items) => [{ _id: payload.insertedId, text: form.get("text"), rating: form.get("rating"), userEmail: session.user.email, createdAt: new Date() }, ...items]);
    event.currentTarget.reset();
  };

  if (loading) return <div className="py-20 text-center"><div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-amber-400" /><p className="mt-4 font-bold text-slate-500">Loading lawyer profile...</p></div>;
  if (!lawyer) return <div className="py-20 text-center"><h1 className="text-2xl font-black">Lawyer not found</h1></div>;

  return (
    <div className="py-10">
      <section className="premium-card overflow-hidden rounded-[2rem]">
        <div className="grid lg:grid-cols-[.9fr_1.1fr]">
          <div className="relative min-h-[34rem] overflow-hidden bg-slate-950">
            <img src={lawyer.image} alt={lawyer.name} className="h-full min-h-[34rem] w-full object-cover opacity-95" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <span className="absolute left-6 top-6 rounded-full bg-white/90 px-4 py-2 text-xs font-black text-amber-800 backdrop-blur">{lawyer.specialization}</span>
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <p className="flex items-center gap-2 text-sm font-bold text-amber-200"><BadgeCheck size={17} /> Verified VerdictHub counsel</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">{lawyer.name}</h1>
            </div>
          </div>

          <div className="p-6 md:p-10">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`rounded-full px-4 py-2 text-xs font-black ${lawyer.availability === "busy" ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}>{lawyer.availability === "busy" ? "Busy" : "Available now"}</span>
              <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black text-slate-600">{lawyer.hireCount || 0} successful hires</span>
            </div>
            <p className="mt-6 text-lg leading-8 text-slate-600">{lawyer.bio}</p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <Fact icon={<Scale />} label="Consultation fee" value={`$${lawyer.hourlyRate}/hour`} />
              <Fact icon={<Calendar />} label="Availability" value={lawyer.availability || "Available"} />
              <Fact icon={<Calendar />} label="Date joined" value={new Date(lawyer.createdAt).toLocaleDateString()} />
              <Fact icon={<MessageSquare />} label="Reviews" value={comments.length} />
            </div>
            <div className="mt-8 rounded-[1.5rem] bg-slate-950 p-6 text-white shadow-xl shadow-slate-950/15">
              <p className="text-sm font-semibold text-slate-300">Ready to get legal help?</p>
              <button disabled={lawyer.availability === "busy"} onClick={() => setConfirmOpen(true)} className="gold-gradient mt-4 inline-flex items-center gap-2 rounded-full px-6 py-3 font-black text-slate-950 shadow-lg shadow-amber-500/20 disabled:opacity-50">
                <Send size={17} /> Hire this lawyer
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12 grid gap-7 lg:grid-cols-[1fr_.7fr]">
        <div>
          <h2 className="text-3xl font-black tracking-tight">Client comments</h2>
          <div className="mt-5 space-y-4">
            {comments.length ? comments.map((comment) => (
              <article key={comment._id} className="premium-card rounded-[1.5rem] p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-black">{comment.userEmail}</p>
                  <p className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-sm font-black text-amber-700"><Star size={14} /> {comment.rating}/5</p>
                </div>
                <p className="mt-3 leading-7 text-slate-600">{comment.text}</p>
              </article>
            )) : <p className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white/70 p-8 text-slate-500">No comments yet.</p>}
          </div>
        </div>
        <form onSubmit={submitComment} className="premium-card h-fit rounded-[1.5rem] p-6">
          <h2 className="text-xl font-black">Leave a comment</h2>
          <p className="mt-2 text-sm text-slate-500">Only clients who hired this lawyer can post feedback.</p>
          <textarea name="text" required placeholder="Share your experience after hiring..." className="mt-5 min-h-32 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100" />
          <select name="rating" className="mt-3 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100" defaultValue="5">
            {[5, 4, 3, 2, 1].map((item) => <option key={item} value={item}>{item} stars</option>)}
          </select>
          <button className="mt-4 rounded-full bg-slate-950 px-6 py-3 font-black text-white shadow-lg shadow-slate-950/10">Post comment</button>
        </form>
      </section>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="max-w-md rounded-[1.75rem] bg-white p-7 shadow-2xl">
            <h2 className="text-2xl font-black">Confirm hiring request</h2>
            <p className="mt-3 leading-7 text-slate-600">Send a hiring request to {lawyer.name}? You will pay only after the lawyer accepts.</p>
            <div className="mt-7 flex gap-3">
              <button disabled={hiring} onClick={hire} className="gold-gradient rounded-full px-6 py-3 font-black text-slate-950 disabled:opacity-50">{hiring ? "Sending..." : "Confirm"}</button>
              <button onClick={() => setConfirmOpen(false)} className="rounded-full border px-6 py-3 font-black">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Fact({ icon, label, value }) {
  return <div className="rounded-[1.25rem] border border-slate-200 bg-white p-4 shadow-sm"><div className="text-amber-700">{icon}</div><p className="mt-3 text-sm font-bold text-slate-500">{label}</p><p className="mt-1 font-black capitalize">{value}</p></div>;
}
