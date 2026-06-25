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
  const [result, setResult] = useState({ data: [], pages: 0 });
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
        if (error.name !== "AbortError") setResult({ data: [], pages: 0 });
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [filters]);

  const update = (key, value) => setFilters((current) => ({ ...current, [key]: value, page: key === "page" ? value : 1 }));

  return (
    <div className="py-10">
      <div className="rounded-3xl bg-slate-950 px-6 py-12 text-white md:px-10">
        <p className="text-sm font-bold uppercase tracking-[.2em] text-amber-300">Find the right advocate</p>
        <h1 className="mt-3 text-4xl font-extrabold">Browse verified lawyers</h1>
        <p className="mt-3 max-w-2xl text-slate-300">Search legal specialists by name, practice area, fee, and availability.</p>
      </div>

      <div className="mt-8 grid gap-4 rounded-2xl border bg-white p-4 md:grid-cols-6">
        <label className="relative md:col-span-2">
          <Search className="absolute left-3 top-3 text-slate-400" size={18} />
          <input value={filters.search} onChange={(e) => update("search", e.target.value)} placeholder="Search lawyer or specialization" className="w-full rounded-xl border px-10 py-3 outline-none focus:border-amber-500" />
        </label>
        <select value={filters.specialization} onChange={(e) => update("specialization", e.target.value)} className="rounded-xl border px-3 py-3">{specialties.map((item) => <option key={item}>{item}</option>)}</select>
        <select value={filters.availability} onChange={(e) => update("availability", e.target.value)} className="rounded-xl border px-3 py-3">
          <option>All</option>
          <option value="available">Available</option>
          <option value="busy">Busy</option>
        </select>
        <input value={filters.minFee} onChange={(e) => update("minFee", e.target.value)} type="number" min="0" placeholder="Min fee" className="rounded-xl border px-3 py-3" />
        <input value={filters.maxFee} onChange={(e) => update("maxFee", e.target.value)} type="number" min="0" placeholder="Max fee" className="rounded-xl border px-3 py-3" />
        <select value={filters.sort} onChange={(e) => update("sort", e.target.value)} className="rounded-xl border px-3 py-3 md:col-span-2">
          <option value="newest">Newest profiles</option>
          <option value="feeLow">Fee: low to high</option>
          <option value="feeHigh">Fee: high to low</option>
          <option value="mostHired">Most hired</option>
        </select>
      </div>

      {loading ? <Skeletons /> : result.data.length ? (
        <>
          <div className="mt-8 grid gap-6 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{result.data.map((lawyer) => <LawyerCard key={lawyer._id} lawyer={lawyer} />)}</div>
          <Pagination page={filters.page} pages={result.pages} onChange={(page) => update("page", page)} />
        </>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed p-16 text-center">
          <SlidersHorizontal className="mx-auto text-amber-700" />
          <h2 className="mt-4 text-xl font-bold">No lawyers match these filters</h2>
          <p className="mt-2 text-slate-500">Try a different name, specialty, fee, or availability option.</p>
        </div>
      )}
    </div>
  );
}

export default function BrowseLawyersPage() {
  return <Suspense fallback={<Skeletons />}><BrowseLawyersContent /></Suspense>;
}

function Skeletons() {
  return <div className="mt-8 grid gap-6 grid-cols-2 lg:grid-cols-4">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-96 animate-pulse rounded-2xl bg-slate-200" />)}</div>;
}

function Pagination({ page, pages, onChange }) {
  if (pages < 2) return null;
  return <div className="mt-8 flex justify-center gap-3"><button disabled={page === 1} onClick={() => onChange(page - 1)} className="rounded-lg border px-4 py-2 disabled:opacity-40">Previous</button><span className="py-2 text-sm">Page {page} of {pages}</span><button disabled={page === pages} onClick={() => onChange(page + 1)} className="rounded-lg border px-4 py-2 disabled:opacity-40">Next</button></div>;
}
