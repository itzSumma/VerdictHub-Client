"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";

export default function AppChrome({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  if (isDashboard) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    );
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-screen max-w-7xl px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      <Footer />
    </>
  );
}
