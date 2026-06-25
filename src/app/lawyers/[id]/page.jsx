"use client";

import { api, authorizedFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { Calendar, MessageSquare, Scale, Send } from "lucide-react";
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

  if (loading) return <div className="py-20 text-center">Loading lawyer profile...</div>;
  if (!lawyer) return <div className="py-20 text-center"><h1 className="text-2xl font-bold">Lawyer not found</h1></div>;

  return (
    <div className="py-10">
      <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr]">
        <img src={lawyer.image} alt={lawyer.name} className="h-full min-h-96 w-full rounded-3xl object-cover" />
        <div>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-800">{lawyer.specialization}</span>
          <h1 className="mt-5 text-4xl font-extrabold">{lawyer.name}</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">{lawyer.bio}</p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <Fact icon={<Scale />} label="Consultation fee" value={`$${lawyer.hourlyRate}/hour`} />
            <Fact icon={<Calendar />} label="Availability" value={lawyer.availability || "Available"} />
            <Fact icon={<Calendar />} label="Date joined" value={new Date(lawyer.createdAt).toLocaleDateString()} />
            <Fact icon={<MessageSquare />} label="Reviews" value={comments.length} />
          </div>
          <div className="mt-8 rounded-2xl bg-slate-950 p-6 text-white">
            <p className="text-sm text-slate-300">Ready to get legal help?</p>
            <button disabled={lawyer.availability === "busy"} onClick={() => setConfirmOpen(true)} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 font-bold text-slate-950 disabled:opacity-50">
              <Send size={17} /> Hire this lawyer
            </button>
          </div>
        </div>
      </div>

      <section className="mt-12 grid gap-6 lg:grid-cols-[1fr_.7fr]">
        <div>
          <h2 className="text-2xl font-extrabold">Client comments</h2>
          <div className="mt-4 space-y-4">
            {comments.length ? comments.map((comment) => (
              <article key={comment._id} className="rounded-2xl border bg-white p-5">
                <p className="font-semibold">{comment.userEmail}</p>
                <p className="mt-2 text-slate-600">{comment.text}</p>
                <p className="mt-2 text-sm text-amber-700">Rating: {comment.rating}/5</p>
              </article>
            )) : <p className="rounded-2xl border border-dashed p-8 text-slate-500">No comments yet.</p>}
          </div>
        </div>
        <form onSubmit={submitComment} className="h-fit rounded-2xl border bg-white p-6">
          <h2 className="text-xl font-bold">Leave a comment</h2>
          <textarea name="text" required placeholder="Share your experience after hiring..." className="mt-4 min-h-28 w-full rounded-xl border px-4 py-3" />
          <select name="rating" className="mt-3 w-full rounded-xl border px-4 py-3" defaultValue="5">
            {[5, 4, 3, 2, 1].map((item) => <option key={item} value={item}>{item} stars</option>)}
          </select>
          <button className="mt-4 rounded-xl bg-slate-950 px-5 py-3 font-bold text-white">Post comment</button>
        </form>
      </section>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4">
          <div className="max-w-md rounded-2xl bg-white p-6">
            <h2 className="text-xl font-extrabold">Confirm hiring request</h2>
            <p className="mt-3 text-slate-600">Send a hiring request to {lawyer.name}? You will pay only after the lawyer accepts.</p>
            <div className="mt-6 flex gap-3">
              <button disabled={hiring} onClick={hire} className="rounded-xl bg-amber-400 px-5 py-3 font-bold text-slate-950 disabled:opacity-50">{hiring ? "Sending..." : "Confirm"}</button>
              <button onClick={() => setConfirmOpen(false)} className="rounded-xl border px-5 py-3 font-bold">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Fact({ icon, label, value }) {
  return <div className="rounded-2xl border p-4"><div className="text-amber-700">{icon}</div><p className="mt-3 text-sm text-slate-500">{label}</p><p className="mt-1 font-bold capitalize">{value}</p></div>;
}
