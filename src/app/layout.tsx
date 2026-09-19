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
  
  // Strict Multi-Tenant Isolation
  // Only allow Byte Brigade operatives to access this portal
  if (user) {
    const { data: _profile } = await supabase.from('profiles').select('team_id').eq('id', user.id).single();
    const { data: _roleData } = await supabase.from('user_roles').select('role').eq('user_id', user.id).single();
    const profile = _profile as any;
    const role = (_roleData as any)?.role;
    const { data: team } = await supabase.from("teams").select("id").limit(1).single();
    
    // Core users bypass the tenant lock so they can access all dashboards
    if (role !== 'core' && profile && profile.team_id !== team?.id) {
      return (
        <html lang="en" className="dark">
          <body className={`${vt323.variable} font-mono min-h-screen bg-matrix-dark text-red-500 flex flex-col items-center justify-center p-4 text-center`}>
            <div className="border border-red-500 p-8 max-w-xl bg-black shadow-[0_0_20px_#ff0000]">
              <h1 className="text-3xl font-bold mb-4 glitch-hover">[ UNAUTHORIZED_SECTOR ]</h1>
              <p className="mb-6 opacity-80">
                CRITICAL WARNING: Your operative credentials belong to a different division. 
                You are attempting to access the restricted Byte Brigade portal using a cross-team database session.
              </p>
              <form action={async () => {
                "use server"
                const { logout } = await import("@/lib/actions/auth")
                await logout()
              }}>
                <button type="submit" className="border border-red-500 px-6 py-2 hover:bg-red-500 hover:text-black font-bold tracking-widest transition-colors uppercase">
                  DISCONNECT SESSION
                </button>
              </form>
            </div>
          </body>
        </html>
      )
    }
  }

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
