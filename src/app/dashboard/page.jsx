"use client";

import { authClient } from "@/lib/auth-client";
import { BriefcaseBusiness, ClipboardList, ShieldCheck, UserRound } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, isPending } = authClient.useSession();
  if (isPending) return <div className="py-20 text-center">Loading your dashboard...</div>;

  const user = session?.user;
  const role = user?.role || "user";
  const links = role === "lawyer"
    ? [
        { href: "/dashboard/lawyer/hiring-history", label: "Hiring requests", icon: <ClipboardList />, text: "Review incoming client requests." },
        { href: "/dashboard/lawyer/manage-legal-profile", label: "Manage legal profile", icon: <BriefcaseBusiness />, text: "Create, edit, publish, or delete services." },
        { href: "/dashboard/lawyer/transactions", label: "Payment history", icon: <ClipboardList />, text: "Track client payments and earnings." },
      ]
    : role === "admin"
      ? [
          { href: "/dashboard/admin/manage-users", label: "Manage users", icon: <UserRound />, text: "Change roles or remove accounts." },
          { href: "/dashboard/admin/manage-lawyers", label: "Manage lawyers", icon: <BriefcaseBusiness />, text: "Publish, unpublish, or delete listings." },
          { href: "/dashboard/admin/all-transactions", label: "All transactions", icon: <ClipboardList />, text: "Audit platform payment activity." },
          { href: "/dashboard/admin/analytics", label: "Analytics", icon: <ShieldCheck />, text: "View growth and revenue metrics." },
        ]
      : [
          { href: "/dashboard/user/hiring-history", label: "Hiring history", icon: <ClipboardList />, text: "See request status and pay accepted hires." },
          { href: "/dashboard/user/transactions", label: "Transactions", icon: <ClipboardList />, text: "Review all completed payments." },
          { href: "/dashboard/user/update-profile", label: "Update profile", icon: <UserRound />, text: "Manage name and profile image." },
          { href: "/dashboard/user/comments", label: "My comments", icon: <BriefcaseBusiness />, text: "Edit or delete your lawyer reviews." },
        ];

  return (
    <div className="py-10">
      <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-8 text-white shadow-2xl shadow-slate-950/15 md:p-10">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl" />
        <p className="relative text-sm font-black uppercase tracking-[0.22em] text-amber-300">Your workspace</p>
        <h1 className="relative mt-3 text-4xl font-black tracking-tight md:text-5xl">Welcome, {user?.name || "there"}</h1>
        <p className="relative mt-4 max-w-2xl text-slate-300">Manage your VerdictHub activity from a focused, role-based dashboard.</p>
        <div className="relative mt-6 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-bold capitalize text-amber-100">{role} dashboard</div>
      </section>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="premium-card group rounded-[1.5rem] p-6 transition hover:-translate-y-1 hover:border-amber-300 hover:shadow-2xl">
            <div className="w-fit rounded-2xl bg-amber-50 p-3 text-amber-800 transition group-hover:bg-slate-950 group-hover:text-amber-300">{link.icon}</div>
            <h2 className="mt-5 text-xl font-black">{link.label}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">{link.text}</p>
            <p className="mt-5 text-sm font-black text-amber-700">Open workspace →</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
