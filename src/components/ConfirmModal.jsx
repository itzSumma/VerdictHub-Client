"use client";

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  loading = false,
  onConfirm,
  onClose,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[1.75rem] bg-white p-6 shadow-2xl">
        <div className={`mb-5 grid h-14 w-14 place-items-center rounded-2xl ${danger ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-800"}`}>
          <span className="text-2xl font-black">!</span>
        </div>
        <h2 className="text-2xl font-black text-slate-950">{title}</h2>
        <p className="mt-3 leading-7 text-slate-600">{message}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <button
            disabled={loading}
            onClick={onConfirm}
            className={`rounded-full px-6 py-3 text-sm font-black text-white shadow-lg disabled:opacity-60 ${danger ? "bg-rose-600 shadow-rose-600/20 hover:bg-rose-700" : "bg-slate-950 shadow-slate-950/10 hover:bg-slate-800"}`}
          >
            {loading ? "Working..." : confirmLabel}
          </button>
          <button disabled={loading} onClick={onClose} className="rounded-full border border-slate-200 px-6 py-3 text-sm font-black text-slate-700 hover:bg-slate-50">
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
