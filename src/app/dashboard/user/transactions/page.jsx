import TransactionsTable from "@/components/TransactionsTable";

export default function UserTransactionsPage() {
  return (
    <section className="py-10">
      <h1 className="text-3xl font-extrabold">My transactions</h1>
      <p className="mt-2 text-slate-500">Track your lawyer hiring payments.</p>
      <TransactionsTable />
    </section>
  );
}
