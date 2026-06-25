"use client";

import { authorizedFetch, uploadToImgBB } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const emptyForm = { name: "", specialization: "Corporate", hourlyRate: "", availability: "available", image: "", bio: "" };

export default function ManageLegalProfilePage() {
  const [token, setToken] = useState("");
  const [lawyers, setLawyers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [saving, setSaving] = useState(false);

  const refreshListings = async (authToken = token) => {
    const response = await authorizedFetch("/lawyers/me/listings", authToken);
    if (response.ok) setLawyers(await response.json());
  };

  useEffect(() => {
    void (async () => {
      const { data } = await authClient.token();
      const response = await authorizedFetch("/lawyers/me/listings", data?.token);
      if (response.ok) {
        setToken(data?.token || "");
        setLawyers(await response.json());
      }
    })();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const data = new FormData(event.currentTarget);
      const file = data.get("imageFile");
      const payload = Object.fromEntries(data.entries());
      delete payload.imageFile;
      if (file?.size) payload.image = await uploadToImgBB(file);
      const response = await authorizedFetch(editingId ? `/lawyers/${editingId}` : "/lawyers", token, {
        method: editingId ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      toast.success(editingId ? "Legal profile updated." : "Legal profile created.");
      setForm(emptyForm);
      setEditingId("");
      refreshListings();
    } catch (error) {
      toast.error(error.message || "Could not save legal profile.");
    } finally {
      setSaving(false);
    }
  };

  const edit = (lawyer) => {
    setEditingId(lawyer._id);
    setForm({
      name: lawyer.name || "",
      specialization: lawyer.specialization || "Corporate",
      hourlyRate: lawyer.hourlyRate || "",
      availability: lawyer.availability || "available",
      image: lawyer.image || "",
      bio: lawyer.bio || "",
    });
  };

  const remove = async (id) => {
    if (!confirm("Delete this legal profile?")) return;
    const response = await authorizedFetch(`/lawyers/${id}`, token, { method: "DELETE" });
    if (!response.ok) return toast.error("Could not delete profile.");
    toast.success("Legal profile deleted.");
    setLawyers((items) => items.filter((item) => item._id !== id));
  };

  const togglePublish = async (lawyer) => {
    const response = await authorizedFetch(`/lawyers/${lawyer._id}/publish`, token, {
      method: "PATCH",
      body: JSON.stringify({ published: !lawyer.published }),
    });
    if (!response.ok) return toast.error("Could not update publication.");
    setLawyers((items) => items.map((item) => item._id === lawyer._id ? { ...item, published: !item.published } : item));
  };

  return (
    <section className="py-10">
      <h1 className="text-3xl font-extrabold">Manage legal profile</h1>
      <form onSubmit={submit} className="mt-6 grid gap-4 rounded-2xl border bg-white p-6 md:grid-cols-2">
        <input name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Lawyer/service name" className="rounded-xl border px-4 py-3" required />
        <select name="specialization" value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} className="rounded-xl border px-4 py-3">
          {["Corporate", "Criminal", "Family", "Tax", "Property", "Immigration"].map((item) => <option key={item}>{item}</option>)}
        </select>
        <input name="hourlyRate" value={form.hourlyRate} onChange={(e) => setForm({ ...form, hourlyRate: e.target.value })} type="number" min="1" placeholder="Consultation fee" className="rounded-xl border px-4 py-3" required />
        <select name="availability" value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })} className="rounded-xl border px-4 py-3">
          <option value="available">Available</option>
          <option value="busy">Busy</option>
        </select>
        <input name="image" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="Image URL" className="rounded-xl border px-4 py-3 md:col-span-2" />
        <input name="imageFile" type="file" accept="image/*" className="rounded-xl border px-4 py-3 md:col-span-2" />
        <textarea name="bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Professional bio" className="min-h-32 rounded-xl border px-4 py-3 md:col-span-2" required />
        <button disabled={saving} className="rounded-xl bg-slate-950 px-5 py-3 font-bold text-white disabled:opacity-50">
          {saving ? "Saving..." : editingId ? "Update profile" : "Create profile"}
        </button>
      </form>

      <div className="mt-8 overflow-x-auto rounded-2xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500"><tr><th className="p-4">Name</th><th className="p-4">Fee</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr></thead>
          <tbody>
            {lawyers.map((lawyer) => (
              <tr key={lawyer._id} className="border-t">
                <td className="p-4 font-bold">{lawyer.name}</td>
                <td className="p-4">${lawyer.hourlyRate}</td>
                <td className="p-4">{lawyer.published ? "Published" : "Draft"}</td>
                <td className="flex flex-wrap gap-2 p-4">
                  <button onClick={() => edit(lawyer)} className="rounded-lg bg-amber-400 px-3 py-2 font-bold">Edit</button>
                  <button onClick={() => togglePublish(lawyer)} className="rounded-lg border px-3 py-2 font-bold">{lawyer.published ? "Unpublish" : "Publish"}</button>
                  <button onClick={() => remove(lawyer._id)} className="rounded-lg border px-3 py-2 font-bold text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
