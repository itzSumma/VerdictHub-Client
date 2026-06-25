"use client";

import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

const api = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

function PaymentForm({ hire, token, onPaid, onClose }) {
  const stripe = useStripe();
  const elements = useElements();
  const [paying, setPaying] = useState(false);

  const pay = async () => {
    if (!stripe || !elements) return;
    setPaying(true);

    try {
      const intentResponse = await fetch(`${api}/payments/create-intent`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ hireId: hire._id }),
      });
      const intentData = await intentResponse.json();
      if (!intentResponse.ok) throw new Error(intentData.message || "Could not start payment.");

      const card = elements.getElement(CardElement);
      const result = await stripe.confirmCardPayment(intentData.clientSecret, {
        payment_method: { card },
      });

      if (result.error) throw new Error(result.error.message);

      const confirmResponse = await fetch(`${api}/payments/confirm`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ paymentIntentId: result.paymentIntent.id }),
      });
      const confirmData = await confirmResponse.json();
      if (!confirmResponse.ok) throw new Error(confirmData.message || "Payment was made but could not be saved.");

      toast.success("Payment completed.");
      onPaid(hire._id);
      onClose();
    } catch (error) {
      toast.error(error.message || "Payment failed.");
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold">Pay ${hire.fee}</h2>
            <p className="mt-1 text-sm text-slate-500">For {hire.lawyerName}</p>
          </div>
          <button onClick={onClose} className="rounded-full border px-3 py-1 text-sm font-bold">✕</button>
        </div>

        <div className="mt-6 rounded-xl border p-4">
          <CardElement options={{ hidePostalCode: true }} />
        </div>

        <p className="mt-3 text-xs text-slate-500">
          Test card: 4242 4242 4242 4242, any future date, any CVC.
        </p>

        <button
          disabled={!stripe || paying}
          onClick={pay}
          className="mt-5 w-full rounded-xl bg-amber-400 px-5 py-3 font-extrabold text-slate-950 disabled:opacity-50"
        >
          {paying ? "Processing..." : `Pay $${hire.fee}`}
        </button>
      </div>
    </div>
  );
}

export default function PaymentButton({ hire, token, onPaid }) {
  const [open, setOpen] = useState(false);
  const options = useMemo(() => ({ appearance: { theme: "stripe" } }), []);

  if (hire.paid) {
    return <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">Paid</span>;
  }

  if (hire.status !== "accepted") {
    return <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">Waiting</span>;
  }

  if (!stripePromise) {
    return <span className="text-xs text-red-500">Stripe key missing</span>;
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-bold text-white">
        Pay now
      </button>
      {open && (
        <Elements stripe={stripePromise} options={options}>
          <PaymentForm hire={hire} token={token} onPaid={onPaid} onClose={() => setOpen(false)} />
        </Elements>
      )}
    </>
  );
}
