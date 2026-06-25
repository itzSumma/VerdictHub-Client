"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const googleLogin = async () => {
    if (loading || googleLoading) return;
    setGoogleLoading(true);
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (loading || googleLoading) return;

    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const user = Object.fromEntries(formData.entries());

    const { data, error } = await authClient.signUp.email({
      ...user,
      role: user.role || "user",
      plan: "free",
    });

    if (error) {
      setLoading(false);
      return toast.error(error.message || "Could not create your account.");
    }

    if (data) {
      toast.success("Account created. Opening your dashboard...");
      router.replace("/dashboard");
      router.refresh();
    }
  };

  return (
    <section className="relative isolate overflow-hidden py-12 sm:py-16">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(245,158,11,0.20),transparent_28rem),radial-gradient(circle_at_80%_0%,rgba(15,23,42,0.12),transparent_26rem)]" />
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="hidden rounded-[2rem] bg-slate-950 p-8 text-white shadow-2xl shadow-slate-950/20 lg:block">
          <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-amber-200">
            Start with confidence
          </div>
          <h2 className="mt-8 text-4xl font-black leading-tight">Create a polished legal workspace in seconds.</h2>
          <p className="mt-5 leading-8 text-slate-300">Choose client or lawyer access, then continue straight to your role-based dashboard.</p>
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-amber-200">Included</p>
            <div className="mt-4 grid gap-3 text-sm font-bold text-slate-200">
              {["Legal hiring workflow", "Profile and request management", "Secure payment tracking"].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-amber-400 text-slate-950">✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="premium-card mx-auto w-full max-w-xl rounded-[2rem] p-6 sm:p-8">
          <div className="mb-7">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-amber-700">Create account</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Join VerdictHub</h1>
            <p className="mt-3 leading-7 text-slate-600">Build your profile and jump directly into your dashboard after signup.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <AuthInput label="Full name" name="name" placeholder="Your name" autoComplete="name" />
            <AuthInput label="Profile image URL" name="image" type="url" placeholder="https://..." required={false} />
            <AuthInput label="Email address" name="email" type="email" placeholder="you@example.com" autoComplete="email" />
            <AuthInput label="Password" name="password" type="password" placeholder="Create a strong password" autoComplete="new-password" />

            <label className="block">
              <span className="text-sm font-black text-slate-800">Signup as</span>
              <select name="role" required defaultValue="user" className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100">
                <option value="user">Client</option>
                <option value="lawyer">Lawyer</option>
              </select>
            </label>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="group relative flex w-full items-center justify-center overflow-hidden rounded-2xl bg-slate-950 px-5 py-4 text-sm font-black text-white shadow-2xl shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition group-hover:translate-x-full" />
              {loading ? <Spinner text="Creating account..." /> : "Create account"}
            </button>

            <GoogleButton loading={googleLoading} disabled={loading || googleLoading} onClick={googleLogin} />

            <p className="text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link href="/signin" className="font-black text-amber-700 hover:text-amber-800">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

function AuthInput({ label, required = true, ...props }) {
  return (
    <label className="block">
      <span className="text-sm font-black text-slate-800">{label}</span>
      <input
        required={required}
        {...props}
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
      />
    </label>
  );
}

function GoogleButton({ loading, disabled, onClick }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-black text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
    >
      <GoogleIcon />
      {loading ? <Spinner text="Connecting Google..." dark /> : "Continue with Google"}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.38 12 5.38z" />
    </svg>
  );
}

function Spinner({ text, dark = false }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`h-4 w-4 animate-spin rounded-full border-2 ${dark ? "border-slate-300 border-t-slate-800" : "border-white/40 border-t-white"}`} />
      {text}
    </span>
  );
}
