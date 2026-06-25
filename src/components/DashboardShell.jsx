"use client";

import { authClient } from "@/lib/auth-client";
import { BarChart3, BriefcaseBusiness, CreditCard, LayoutDashboard, MessageSquare, UserCog, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const linksByRole = {
  user: [
    { href: "/dashboard", label: "Overview", icon: <LayoutDashboard size={18} /> },
    { href: "/dashboard/user/hiring-history", label: "Hiring history", icon: <BriefcaseBusiness size={18} /> },
    { href: "/dashboard/user/transactions", label: "Transactions", icon: <CreditCard size={18} /> },
    { href: "/dashboard/user/update-profile", label: "Update profile", icon: <UserCog size={18} /> },
    { href: "/dashboard/user/comments", label: "Comments", icon: <MessageSquare size={18} /> },
  ],
  lawyer: [
    { href: "/dashboard", label: "Overview", icon: <LayoutDashboard size={18} /> },
    { href: "/dashboard/lawyer/hiring-history", label: "Hiring requests", icon: <BriefcaseBusiness size={18} /> },
    { href: "/dashboard/lawyer/manage-legal-profile", label: "Legal profile", icon: <UserCog size={18} /> },
    { href: "/dashboard/lawyer/transactions", label: "Payments", icon: <CreditCard size={18} /> },
  ],
  admin: [
    { href: "/dashboard", label: "Overview", icon: <LayoutDashboard size={18} /> },
    { href: "/dashboard/admin/manage-users", label: "Manage users", icon: <Users size={18} /> },
    { href: "/dashboard/admin/manage-lawyers", label: "Manage lawyers", icon: <BriefcaseBusiness size={18} /> },
    { href: "/dashboard/admin/all-transactions", label: "Transactions", icon: <CreditCard size={18} /> },
    { href: "/dashboard/admin/analytics", label: "Analytics", icon: <BarChart3 size={18} /> },
  ],
};

export default function DashboardShell({ children }) {
  const { data: session } = authClient.useSession();
  const pathname = usePathname();
  const role = session?.user?.role || "user";
  const links = linksByRole[role] || linksByRole.user;

  return (
    <div className="grid gap-6 py-8 lg:grid-cols-[18rem_1fr]">
      <aside className="h-fit rounded-[1.75rem] border border-white/70 bg-white/85 p-4 shadow-xl shadow-slate-900/7 backdrop-blur-xl lg:sticky lg:top-28">
        <div className="rounded-[1.25rem] bg-slate-950 p-5 text-white">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-300">Dashboard</p>
          <h2 className="mt-2 truncate text-xl font-black">{session?.user?.name || "VerdictHub"}</h2>
          <p className="mt-1 text-sm capitalize text-slate-300">{role} workspace</p>
        </div>
        <nav className="mt-4 grid gap-2">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link key={link.href} href={link.href} className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black transition ${active ? "bg-amber-100 text-amber-800" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"}`}>
                {link.icon}
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
