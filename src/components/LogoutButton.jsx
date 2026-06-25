"use client";

import { authClient } from "@/lib/auth-client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function LogoutButton({ compact = false, className = "" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    if (loading) return;
    setLoading(true);
    await authClient.signOut();
    toast.success("Signed out successfully.");
    router.replace("/");
    router.refresh();
  };

  return (
    <button
      type="button"
      disabled={loading}
      onClick={logout}
      className={`group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-black text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70 ${compact ? "w-full" : ""} ${className}`}
    >
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-rose-100/80 to-transparent transition group-hover:translate-x-full" />
      {loading ? (
        <span className="relative inline-flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-rose-600" />
          Signing out...
        </span>
      ) : (
        <span className="relative inline-flex items-center gap-2">
          <LogOut size={16} />
          Logout
        </span>
      )}
    </button>
  );
}
