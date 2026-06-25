import dns from "node:dns"
dns.setServers(['1.1.1.1', '1.0.0.1']);

import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import AppChrome from "@/components/AppChrome";

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
      <body className="min-h-full text-slate-900">
        <AppChrome>
          {children}
        </AppChrome>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
