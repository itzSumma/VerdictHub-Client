"use client";

export default function Error({ error, reset }) {
  return (
    <section className="grid min-h-[60vh] place-items-center text-center">
      <div>
        <p className="text-sm font-bold uppercase tracking-widest text-red-600">Something went wrong</p>
        <h1 className="mt-3 text-4xl font-extrabold">VerdictHub hit an unexpected issue.</h1>
        <p className="mt-3 text-slate-500">{error?.message || "Please try again."}</p>
        <button onClick={reset} className="mt-6 rounded-xl bg-slate-950 px-5 py-3 font-bold text-white">Try again</button>
      </div>
    </section>
  );
}
