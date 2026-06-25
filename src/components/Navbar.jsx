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

  const navLinks = links.map((link) => (
    <Link
      key={link.href}
      href={link.href}
      onClick={() => setOpen(false)}
      className={`text-sm font-semibold ${pathname === link.href ? "text-amber-700" : "text-slate-600 hover:text-slate-950"}`}
    >
      {link.label}
    </Link>
  ));

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-xl font-extrabold">
          <span className="rounded-xl bg-slate-950 p-2 text-amber-300"><Scale size={20} /></span>
          VerdictHub
        </Link>

        <form onSubmit={submitSearch} className="hidden max-w-xs flex-1 items-center rounded-xl border px-3 py-2 lg:flex">
          <Search size={17} className="text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search lawyers..." className="w-full bg-transparent px-2 text-sm outline-none" />
        </form>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks}
          {session ? (
            <button onClick={() => authClient.signOut()} className="rounded-lg border px-4 py-2 text-sm font-bold">Logout</button>
          ) : (
            <>
              <Link href="/signin" className="text-sm font-bold">Login</Link>
              <Link href="/signup" className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-bold text-white">Get started</Link>
            </>
          )}
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </nav>

      {open && (
        <div className="border-t bg-white p-4 md:hidden">
          <form onSubmit={submitSearch} className="mb-3 flex rounded-xl border px-3 py-2">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search lawyers..." className="w-full outline-none" />
          </form>
          <div className="grid gap-3">{navLinks}</div>
          {session ? (
            <button onClick={() => authClient.signOut()} className="mt-3 font-semibold">Logout</button>
          ) : (
            <Link href="/signin" onClick={() => setOpen(false)} className="mt-3 block font-semibold">Login</Link>
          )}
        </div>
      )}
    </header>
  );
}
