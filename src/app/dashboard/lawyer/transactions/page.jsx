import TransactionsTable from "@/components/TransactionsTable";

export default function LawyerTransactionsPage() {
  return (
    <section className="py-10">
      <h1 className="text-3xl font-extrabold">Payment history</h1>
      <p className="mt-2 text-slate-500">Track payments received from accepted hiring requests.</p>
      <TransactionsTable />
    </section>
  );
}
