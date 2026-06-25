import { Mail, MapPin, Scale } from "lucide-react";
import Link from "next/link";
import { BsInstagram, BsTwitter } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";
import { LiaLinkedin } from "react-icons/lia";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/70 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_.8fr_.8fr_1.1fr]">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-300 text-slate-950"><Scale /></span>
              <div>
                <h2 className="text-2xl font-black">VerdictHub</h2>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-300">Legal marketplace</p>
              </div>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-300">Find, hire, and manage trusted legal counsel with transparent profiles, secure payments, and role-based dashboards.</p>
            <div className="mt-6 flex gap-3">
              {[FaFacebook, BsInstagram, BsTwitter, LiaLinkedin].map((Icon, index) => (
                <Link key={index} href="#" className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:bg-amber-300 hover:text-slate-950">
                  <Icon />
                </Link>
              ))}
            </div>
          </div>

          <FooterLinks title="Platform" links={[["Browse Lawyers", "/lawyers"], ["Dashboard", "/dashboard"], ["Sign In", "/signin"], ["Create Account", "/signup"]]} />
          <FooterLinks title="Legal" links={[["About", "#"], ["Contact", "#"], ["Privacy Policy", "#"], ["Terms", "#"]]} />

          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-amber-300">Newsletter</h3>
            <p className="mt-4 text-sm leading-7 text-slate-300">Get legal hiring tips and platform updates. Frontend placeholder only.</p>
            <div className="mt-5 flex rounded-full bg-white p-1">
              <input placeholder="Email address" className="min-w-0 flex-1 rounded-full px-4 text-sm text-slate-900 outline-none" />
              <button className="rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white">Join</button>
            </div>
            <div className="mt-6 space-y-3 text-sm text-slate-300">
              <p className="flex gap-2"><MapPin size={17} className="text-amber-300" /> Dhaka, Bangladesh</p>
              <p className="flex gap-2"><Mail size={17} className="text-amber-300" /> support@verdicthub.com</p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-sm text-slate-400 md:flex-row">
          <p>© {new Date().getFullYear()} VerdictHub. All rights reserved.</p>
          <p>Built for secure online lawyer hiring.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterLinks({ title, links }) {
  return (
    <div>
      <h3 className="text-sm font-black uppercase tracking-[0.2em] text-amber-300">{title}</h3>
      <ul className="mt-5 space-y-3 text-sm text-slate-300">
        {links.map(([label, href]) => <li key={label}><Link href={href} className="transition hover:text-amber-300">{label}</Link></li>)}
      </ul>
    </div>
  );
}
