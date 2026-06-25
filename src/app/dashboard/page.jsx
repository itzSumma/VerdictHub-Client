"use client";

import { authClient } from "@/lib/auth-client";
import { BriefcaseBusiness, ClipboardList, UserRound } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, isPending } = authClient.useSession();
  if (isPending) return <div className="py-20 text-center">Loading your dashboard...</div>;

  const user = session?.user;
  const role = user?.role || "user";
  const links = role === "lawyer"
    ? [
        { href: "/dashboard/lawyer/hiring-history", label: "Hiring requests", icon: <ClipboardList /> },
        { href: "/dashboard/lawyer/manage-legal-profile", label: "Manage legal profile", icon: <BriefcaseBusiness /> },
        { href: "/dashboard/lawyer/transactions", label: "Payment history", icon: <ClipboardList /> },
      ]
    : role === "admin"
      ? [
          { href: "/dashboard/admin/manage-users", label: "Manage users", icon: <UserRound /> },
          { href: "/dashboard/admin/all-transactions", label: "All transactions", icon: <ClipboardList /> },
          { href: "/dashboard/admin/analytics", label: "Analytics", icon: <BriefcaseBusiness /> },
        ]
      : [
          { href: "/dashboard/user/hiring-history", label: "Hiring history", icon: <ClipboardList /> },
          { href: "/dashboard/user/transactions", label: "Transactions", icon: <ClipboardList /> },
          { href: "/dashboard/user/update-profile", label: "Update profile", icon: <UserRound /> },
          { href: "/dashboard/user/comments", label: "My comments", icon: <BriefcaseBusiness /> },
        ];

  return (
    <div className="py-10">
      <p className="text-sm font-bold uppercase tracking-widest text-amber-700">Your workspace</p>
      <h1 className="mt-2 text-4xl font-extrabold">Welcome, {user?.name || "there"}</h1>
      <p className="mt-3 text-slate-600">Manage your VerdictHub activity from one place.</p>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="rounded-2xl border bg-white p-6 transition hover:border-amber-400 hover:shadow-lg">
            <div className="w-fit rounded-xl bg-amber-50 p-3 text-amber-800">{link.icon}</div>
            <h2 className="mt-5 text-lg font-bold">{link.label}</h2>
            <p className="mt-2 text-sm text-slate-500">Open and manage this area.</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
