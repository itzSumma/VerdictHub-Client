"use client";

import { authClient } from "@/lib/auth-client";
import { Menu, Scale, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const links = [
    { href: "/", label: "Home" },
    { href: "/lawyers", label: "Browse Lawyers" },
    ...(session ? [{ href: "/dashboard", label: "Dashboard" }] : []),
  ];

  const submitSearch = (event) => {
    event.preventDefault();
    router.push(`/lawyers${search.trim() ? `?search=${encodeURIComponent(search.trim())}` : ""}`);
    setOpen(false);
  };

  const navLinks = links.map((link) => {
    const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
    return (
      <Link
        key={link.href}
        href={link.href}
        onClick={() => setOpen(false)}
        className={`rounded-full px-4 py-2 text-sm font-bold transition ${active ? "bg-amber-100 text-amber-800" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"}`}
      >
        {link.label}
      </Link>
    );
  });

  return (
    <header className="sticky top-0 z-50 border-b border-white/70 bg-white/75 shadow-sm shadow-slate-900/5 backdrop-blur-2xl">
      <nav className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-amber-300 shadow-lg shadow-slate-950/20"><Scale size={22} /></span>
          <span>
            <span className="block text-xl font-black tracking-tight text-slate-950">VerdictHub</span>
            <span className="hidden text-[11px] font-bold uppercase tracking-[0.22em] text-amber-700 sm:block">Legal marketplace</span>
          </span>
        </Link>

        <form onSubmit={submitSearch} className="hidden max-w-sm flex-1 items-center rounded-full border border-slate-200 bg-white px-4 py-2.5 shadow-sm lg:flex">
          <Search size={17} className="text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search lawyer, category..." className="w-full bg-transparent px-3 text-sm outline-none" />
        </form>

        <div className="hidden items-center gap-2 md:flex">
          {navLinks}
          {session ? (
            <button onClick={() => authClient.signOut()} className="ml-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-extrabold text-slate-700 shadow-sm transition hover:border-amber-300 hover:text-slate-950">Logout</button>
          ) : (
            <>
              <Link href="/signin" className="rounded-full px-4 py-2 text-sm font-extrabold text-slate-700 hover:bg-slate-100">Login</Link>
              <Link href="/signup" className="gold-gradient rounded-full px-5 py-2.5 text-sm font-black text-slate-950 shadow-lg shadow-amber-500/20 transition hover:-translate-y-0.5">Get started</Link>
            </>
          )}
        </div>

        <button className="rounded-xl border bg-white p-2 md:hidden" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </nav>

      {open && (
        <div className="border-t border-slate-100 bg-white/95 p-4 backdrop-blur md:hidden">
          <form onSubmit={submitSearch} className="mb-4 flex rounded-2xl border px-3 py-2">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search lawyers..." className="w-full outline-none" />
          </form>
          <div className="grid gap-2">{navLinks}</div>
          {session ? (
            <button onClick={() => authClient.signOut()} className="mt-4 rounded-full border px-4 py-2 font-bold">Logout</button>
          ) : (
            <Link href="/signin" onClick={() => setOpen(false)} className="mt-4 block rounded-full bg-slate-950 px-4 py-2 text-center font-bold text-white">Login</Link>
          )}
        </div>
      )}
    </header>
  );
}
