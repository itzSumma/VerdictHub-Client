import Link from "next/link";

export default function NotFound() {
  return (
    <section className="grid min-h-[60vh] place-items-center text-center">
      <div>
        <p className="text-sm font-bold uppercase tracking-widest text-amber-700">404</p>
        <h1 className="mt-3 text-4xl font-extrabold">This page is outside the courtroom.</h1>
        <p className="mt-3 text-slate-500">The route you opened does not exist.</p>
        <Link href="/" className="mt-6 inline-block rounded-xl bg-slate-950 px-5 py-3 font-bold text-white">Back to Home</Link>
      </div>
    </section>
  );
}
