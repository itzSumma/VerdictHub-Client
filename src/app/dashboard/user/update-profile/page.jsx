"use client";

import { authorizedFetch, uploadToImgBB } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function UpdateProfilePage() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const form = new FormData(event.currentTarget);
      const file = form.get("imageFile");
      const image = file?.size ? await uploadToImgBB(file) : form.get("image");
      const { data } = await authClient.token();
      const response = await authorizedFetch("/profile", data?.token, {
        method: "PATCH",
        body: JSON.stringify({ name: form.get("name"), image }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      toast.success("Profile updated.");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Could not update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mx-auto max-w-2xl py-10">
      <h1 className="text-3xl font-extrabold">Update profile</h1>
      <form onSubmit={submit} className="mt-6 space-y-4 rounded-2xl border bg-white p-6">
        <label className="block text-sm font-bold">Full name</label>
        <input name="name" defaultValue={session?.user?.name || ""} className="w-full rounded-xl border px-4 py-3" required />

        <label className="block text-sm font-bold">Profile image URL</label>
        <input name="image" defaultValue={session?.user?.image || ""} className="w-full rounded-xl border px-4 py-3" />

        <label className="block text-sm font-bold">Or upload image via imgBB</label>
        <input name="imageFile" type="file" accept="image/*" className="w-full rounded-xl border px-4 py-3" />

        <button disabled={saving} className="rounded-xl bg-slate-950 px-5 py-3 font-bold text-white disabled:opacity-50">
          {saving ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </section>
  );
}
