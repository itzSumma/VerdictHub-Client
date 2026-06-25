"use client";

import { authorizedFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/ConfirmModal";

export default function MyCommentsPage() {
  const [comments, setComments] = useState([]);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [editTarget, setEditTarget] = useState(null);
  const [editText, setEditText] = useState("");
  const [editRating, setEditRating] = useState(5);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void (async () => {
      const { data } = await authClient.token();
      const response = await authorizedFetch("/comments/me", data?.token);
      if (response.ok) {
        setToken(data?.token || "");
        setComments(await response.json());
      }
      setLoading(false);
    })();
  }, []);

  const openEdit = (comment) => {
    setEditTarget(comment);
    setEditText(comment.text || "");
    setEditRating(comment.rating || 5);
  };

  const update = async () => {
    if (!editTarget || !editText.trim()) return;
    setSaving(true);
    const response = await authorizedFetch(`/comments/${editTarget._id}`, token, {
      method: "PUT",
      body: JSON.stringify({ text: editText, rating: editRating }),
    });
    setSaving(false);
    if (!response.ok) return toast.error("Could not update comment.");
    toast.success("Comment updated.");
    setComments((items) => items.map((item) => item._id === editTarget._id ? { ...item, text: editText, rating: editRating } : item));
    setEditTarget(null);
  };

  const remove = async (id) => {
    setSaving(true);
    const response = await authorizedFetch(`/comments/${id}`, token, { method: "DELETE" });
    setSaving(false);
    if (!response.ok) return toast.error("Could not delete comment.");
    toast.success("Comment deleted.");
    setComments((items) => items.filter((item) => item._id !== id));
    setDeleteTarget(null);
  };

  return (
    <section className="py-10">
      <h1 className="text-3xl font-extrabold">My comments</h1>
      <div className="mt-6 grid gap-4">
        {loading ? <p>Loading...</p> : comments.length ? comments.map((comment) => (
          <article key={comment._id} className="rounded-2xl border bg-white p-5">
            <p className="text-slate-700">{comment.text}</p>
            <p className="mt-2 text-sm text-slate-500">Rating: {comment.rating}/5</p>
            <div className="mt-4 flex gap-3">
              <button onClick={() => openEdit(comment)} className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-bold">Edit</button>
              <button onClick={() => setDeleteTarget(comment)} className="rounded-lg border px-4 py-2 text-sm font-bold">Delete</button>
            </div>
          </article>
        )) : <p className="rounded-2xl border border-dashed p-10 text-center text-slate-500">No comments yet.</p>}
      </div>
      {editTarget && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[1.75rem] bg-white p-6 shadow-2xl">
            <h2 className="text-2xl font-black">Edit comment</h2>
            <textarea value={editText} onChange={(event) => setEditText(event.target.value)} className="mt-5 min-h-32 w-full rounded-2xl border px-4 py-3 outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100" />
            <select value={editRating} onChange={(event) => setEditRating(Number(event.target.value))} className="mt-3 w-full rounded-2xl border px-4 py-3">
              {[5, 4, 3, 2, 1].map((item) => <option key={item} value={item}>{item} stars</option>)}
            </select>
            <div className="mt-5 flex gap-3">
              <button disabled={saving} onClick={update} className="rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white disabled:opacity-60">{saving ? "Saving..." : "Save changes"}</button>
              <button disabled={saving} onClick={() => setEditTarget(null)} className="rounded-full border px-6 py-3 text-sm font-black">Cancel</button>
            </div>
          </div>
        </div>
      )}
      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete comment?"
        message="This comment will be permanently removed from your profile."
        confirmLabel="Delete comment"
        danger
        loading={saving}
        onConfirm={() => deleteTarget && remove(deleteTarget._id)}
        onClose={() => setDeleteTarget(null)}
      />
    </section>
  );
}
