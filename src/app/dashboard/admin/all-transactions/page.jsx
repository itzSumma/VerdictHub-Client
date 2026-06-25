"use client";

import { authorizedFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";

export default function AllTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    (async () => {
      const { data } = await authClient.token();
      const response = await authorizedFetch("/admin/transactions", data?.token);
      if (response.ok) setTransactions(await response.json());
    })();
  }, []);

  return (
    <section className="py-10">
      <h1 className="text-3xl font-extrabold">All transactions</h1>
      <div className="mt-6 overflow-x-auto rounded-2xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500"><tr><th className="p-4">Transaction ID</th><th className="p-4">User</th><th className="p-4">Lawyer</th><th className="p-4">Amount</th><th className="p-4">Date</th><th className="p-4">Status</th></tr></thead>
          <tbody>
            {transactions.length ? transactions.map((item) => (
              <tr key={item._id} className="border-t">
                <td className="max-w-44 truncate p-4">{item.paymentIntentId}</td>
                <td className="p-4">{item.clientEmail}</td>
                <td className="p-4">{item.lawyerEmail}</td>
                <td className="p-4">${item.amount}</td>
                <td className="p-4">{new Date(item.paidAt || item.createdAt).toLocaleDateString()}</td>
                <td className="p-4 capitalize">{item.status}</td>
              </tr>
            )) : <tr><td className="p-4" colSpan="6">No transactions yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}
