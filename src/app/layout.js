import dns from "node:dns"
dns.setServers(['1.1.1.1', '1.0.0.1']);

import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "VerdictHub | Find trusted legal counsel",
  description: "Hire trusted legal experts with confidence.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.className} h-full antialiased`}>
      <body className="bg-slate-50 text-slate-900">
        <Navbar />
        <main className="max-w-7xl mx-auto px-2 min-h-screen">
          {children}
        </main>

        <Footer/>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
