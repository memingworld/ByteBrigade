import type { Metadata } from "next";
import { VT323 } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const vt323 = VT323({ weight: "400", subsets: ["latin"], variable: "--font-vt323" });

export const metadata: Metadata = {
  title: "Byte Brigade | ROOT",
  description: "Terminal Access",
};

import { createClient } from "@/lib/supabase/server";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en" className="dark">
      <body className={`${vt323.variable} font-mono min-h-screen bg-matrix-dark text-matrix-green antialiased`}>
        <div className="relative flex min-h-screen flex-col">
          {user && <Navbar />}
          <div className="flex-1 z-10 relative">
            {children}
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
