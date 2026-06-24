"use client";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Menu, Scale, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const links = [{ href: '/', label: 'Home' }, { href: '/lawyers', label: 'Browse Lawyers' }, ...(session ? [{ href: '/dashboard', label: 'Dashboard' }] : [])];
  return <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur"><nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4"><Link href="/" className="flex items-center gap-2 text-xl font-extrabold"><span className="rounded-xl bg-slate-950 p-2 text-amber-300"><Scale size={20}/></span>VerdictHub</Link><div className="hidden items-center gap-6 md:flex">{links.map((link) => <Link key={link.href} href={link.href} className="text-sm font-semibold text-slate-600 hover:text-slate-950">{link.label}</Link>)}{session ? <button onClick={() => authClient.signOut()} className="rounded-lg border px-4 py-2 text-sm font-bold">Logout</button> : <><Link href="/signin" className="text-sm font-bold">Login</Link><Link href="/signup" className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-bold text-white">Get started</Link></>}</div><button className="md:hidden" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button></nav>{open && <div className="border-t bg-white p-4 md:hidden">{links.map((link) => <Link onClick={() => setOpen(false)} key={link.href} href={link.href} className="block py-3 font-semibold">{link.label}</Link>)}<Link href={session ? '/dashboard' : '/signin'} className="block py-3 font-semibold">{session ? 'Dashboard' : 'Login'}</Link></div>}</header>;
}
