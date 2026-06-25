"use client";

import LawyerCard from "@/components/LawyerCard";
import { api } from "@/lib/api";
import { Search, SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const specialties = ["All", "Criminal", "Corporate", "Family", "Property", "Immigration", "Employment", "Tax", "Cyber Law"];

function BrowseLawyersContent() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    specialization: searchParams.get("specialization") || "All",
    availability: "All",
    minFee: "",
    maxFee: "",
    sort: "newest",
    page: 1,
  });
  const [result, setResult] = useState({ data: [], pages: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      const params = new URLSearchParams(Object.entries(filters).filter(([, value]) => value !== ""));
      try {
        const response = await fetch(`${api}/lawyers?${params}`, { signal: controller.signal, cache: "no-store" });
        if (!response.ok) throw new Error();
        setResult(await response.json());
      } catch (error) {
        if (error.name !== "AbortError") setResult({ data: [], pages: 0, total: 0 });
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [filters]);

  const update = (key, value) => setFilters((current) => ({ ...current, [key]: value, page: key === "page" ? value : 1 }));

  return (
    <div className="py-10">
      <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-14 text-white shadow-2xl shadow-slate-950/15 md:px-10">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl" />
        <p className="relative text-sm font-black uppercase tracking-[0.25em] text-amber-300">Find the right advocate</p>
        <h1 className="relative mt-4 text-5xl font-black tracking-tight">Browse verified lawyers</h1>
        <p className="relative mt-4 max-w-2xl text-slate-300">Search by name, specialty, consultation fee, and availability. Every profile is designed to help clients decide faster.</p>
      </div>

      <div className="premium-card sticky top-24 z-20 mt-8 grid gap-4 rounded-[1.75rem] p-4 md:grid-cols-6">
        <label className="relative md:col-span-2">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
          <input value={filters.search} onChange={(e) => update("search", e.target.value)} placeholder="Search lawyer or specialization" className="w-full rounded-2xl border border-slate-200 bg-white px-11 py-3.5 text-sm font-semibold outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100" />
        </label>
        <Select value={filters.specialization} onChange={(value) => update("specialization", value)} options={specialties} />
        <Select value={filters.availability} onChange={(value) => update("availability", value)} options={["All", "available", "busy"]} />
        <input value={filters.minFee} onChange={(e) => update("minFee", e.target.value)} type="number" min="0" placeholder="Min fee" className="rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100" />
        <input value={filters.maxFee} onChange={(e) => update("maxFee", e.target.value)} type="number" min="0" placeholder="Max fee" className="rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100" />
        <select value={filters.sort} onChange={(e) => update("sort", e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100 md:col-span-2">
          <option value="newest">Newest profiles</option>
          <option value="feeLow">Fee: low to high</option>
          <option value="feeHigh">Fee: high to low</option>
          <option value="mostHired">Most hired</option>
        </select>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <p className="text-sm font-bold text-slate-500">{loading ? "Searching..." : `${result.total || 0} lawyers found`}</p>
        <p className="rounded-full bg-white px-4 py-2 text-xs font-black text-slate-500 shadow-sm">6-12 results per page</p>
      </div>

      {loading ? <Skeletons /> : result.data.length ? (
        <>
          <div className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{result.data.map((lawyer) => <LawyerCard key={lawyer._id} lawyer={lawyer} />)}</div>
          <Pagination page={filters.page} pages={result.pages} onChange={(page) => update("page", page)} />
        </>
      ) : (
        <div className="mt-8 rounded-[2rem] border border-dashed border-slate-300 bg-white/75 p-16 text-center shadow-sm">
          <SlidersHorizontal className="mx-auto text-amber-700" />
          <h2 className="mt-4 text-2xl font-black">No lawyers match these filters</h2>
          <p className="mt-2 text-slate-500">Try a different name, specialty, fee, or availability option.</p>
        </div>
      )}
    </div>
  );
}

export default function BrowseLawyersPage() {
  return <Suspense fallback={<Skeletons />}><BrowseLawyersContent /></Suspense>;
}

function Select({ value, onChange, options }) {
  return <select value={value} onChange={(e) => onChange(e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold capitalize outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100">{options.map((item) => <option key={item} value={item}>{item}</option>)}</select>;
}

function Skeletons() {
  return <div className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-[29rem] animate-pulse rounded-[1.75rem] bg-white/80 shadow-lg" />)}</div>;
}

function Pagination({ page, pages, onChange }) {
  if (pages < 2) return null;
  return <div className="mt-10 flex justify-center gap-3"><button disabled={page === 1} onClick={() => onChange(page - 1)} className="rounded-full border bg-white px-5 py-3 text-sm font-black shadow-sm disabled:opacity-40">Previous</button><span className="rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white">Page {page} of {pages}</span><button disabled={page === pages} onClick={() => onChange(page + 1)} className="rounded-full border bg-white px-5 py-3 text-sm font-black shadow-sm disabled:opacity-40">Next</button></div>;
}
