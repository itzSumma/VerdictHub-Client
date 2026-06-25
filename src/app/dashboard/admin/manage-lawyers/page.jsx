"use client";

import { authorizedFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ManageLawyersPage() {
  const [lawyers, setLawyers] = useState([]);
  const [token, setToken] = useState("");

  useEffect(() => {
    void (async () => {
      const { data } = await authClient.token();
      const response = await authorizedFetch("/admin/lawyers", data?.token);
      if (response.ok) {
        setToken(data?.token || "");
        setLawyers(await response.json());
      }
    })();
  }, []);

  const togglePublish = async (lawyer) => {
    const response = await authorizedFetch(`/lawyers/${lawyer._id}/publish`, token, {
      method: "PATCH",
      body: JSON.stringify({ published: !lawyer.published }),
    });
    if (!response.ok) return toast.error("Could not update lawyer.");
    toast.success("Listing status updated.");
    setLawyers((items) => items.map((item) => item._id === lawyer._id ? { ...item, published: !item.published } : item));
  };

  const remove = async (id) => {
    if (!confirm("Delete this lawyer listing?")) return;
    const response = await authorizedFetch(`/lawyers/${id}`, token, { method: "DELETE" });
    if (!response.ok) return toast.error("Could not delete lawyer.");
    toast.success("Lawyer listing deleted.");
    setLawyers((items) => items.filter((item) => item._id !== id));
  };

  return (
    <section className="py-10">
      <h1 className="text-3xl font-extrabold">Manage lawyer listings</h1>
      <div className="mt-6 overflow-x-auto rounded-2xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500"><tr><th className="p-4">Lawyer</th><th className="p-4">Specialization</th><th className="p-4">Fee</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr></thead>
          <tbody>
            {lawyers.length ? lawyers.map((lawyer) => (
              <tr key={lawyer._id} className="border-t">
                <td className="p-4 font-bold">{lawyer.name}</td>
                <td className="p-4">{lawyer.specialization}</td>
                <td className="p-4">${lawyer.hourlyRate}</td>
                <td className="p-4">{lawyer.published ? "Published" : "Draft"}</td>
                <td className="flex flex-wrap gap-2 p-4">
                  <button onClick={() => togglePublish(lawyer)} className="rounded-lg bg-amber-400 px-3 py-2 font-bold">{lawyer.published ? "Unpublish" : "Publish"}</button>
                  <button onClick={() => remove(lawyer._id)} className="rounded-lg border px-3 py-2 font-bold text-red-600">Delete</button>
                </td>
              </tr>
            )) : <tr><td className="p-4" colSpan="5">No lawyer listings yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}
