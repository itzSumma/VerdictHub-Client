"use client";

import { authorizedFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { DollarSign, Scale, Users, BriefcaseBusiness } from "lucide-react";
import { useEffect, useState } from "react";

export default function AnalyticsPage() {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    (async () => {
      const { data } = await authClient.token();
      const response = await authorizedFetch("/admin/analytics", data?.token);
      if (response.ok) setStats(await response.json());
    })();
  }, []);

  const cards = [
    { label: "Total users", value: stats?.totalUsers || 0, icon: <Users /> },
    { label: "Total lawyers", value: stats?.totalLawyers || 0, icon: <Scale /> },
    { label: "Total hires", value: stats?.totalHires || 0, icon: <BriefcaseBusiness /> },
    { label: "Revenue", value: `$${stats?.totalRevenue || 0}`, icon: <DollarSign /> },
  ];

  return (
    <section className="py-10">
      <h1 className="text-3xl font-extrabold">Analytics overview</h1>
      <div className="mt-6 grid gap-5 md:grid-cols-4">
        {cards.map((card) => (
          <article key={card.label} className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="w-fit rounded-xl bg-amber-50 p-3 text-amber-700">{card.icon}</div>
            <p className="mt-5 text-sm font-bold text-slate-500">{card.label}</p>
            <h2 className="mt-1 text-3xl font-extrabold">{card.value}</h2>
          </article>
        ))}
      </div>
      <div className="mt-8 rounded-2xl border bg-white p-6">
        <h2 className="text-xl font-bold">Revenue snapshot</h2>
        <div className="mt-4 h-4 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full w-2/3 rounded-full bg-amber-400" />
        </div>
        <p className="mt-3 text-sm text-slate-500">Simple dashboard chart placeholder for assignment analytics.</p>
      </div>
    </section>
  );
}
