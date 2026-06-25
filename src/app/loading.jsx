export default function Loading() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-amber-400" />
        <p className="mt-4 font-semibold text-slate-500">Loading VerdictHub...</p>
      </div>
    </div>
  );
}
