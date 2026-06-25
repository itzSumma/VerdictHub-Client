"use client";

import { authorizedFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function MyCommentsPage() {
  const [comments, setComments] = useState([]);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);

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

  const update = async (comment) => {
    const text = prompt("Update your comment", comment.text);
    if (!text) return;
    const response = await authorizedFetch(`/comments/${comment._id}`, token, {
      method: "PUT",
      body: JSON.stringify({ text, rating: comment.rating }),
    });
    if (!response.ok) return toast.error("Could not update comment.");
    toast.success("Comment updated.");
    setComments((items) => items.map((item) => item._id === comment._id ? { ...item, text } : item));
  };

  const remove = async (id) => {
    if (!confirm("Delete this comment?")) return;
    const response = await authorizedFetch(`/comments/${id}`, token, { method: "DELETE" });
    if (!response.ok) return toast.error("Could not delete comment.");
    toast.success("Comment deleted.");
    setComments((items) => items.filter((item) => item._id !== id));
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
              <button onClick={() => update(comment)} className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-bold">Edit</button>
              <button onClick={() => remove(comment._id)} className="rounded-lg border px-4 py-2 text-sm font-bold">Delete</button>
            </div>
          </article>
        )) : <p className="rounded-2xl border border-dashed p-10 text-center text-slate-500">No comments yet.</p>}
      </div>
    </section>
  );
}
