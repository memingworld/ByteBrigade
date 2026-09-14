import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AdminVerificationTable from "@/components/dashboard/AdminVerificationTable"
import { AlertTriangle } from "lucide-react"

import { Suspense } from 'react'
import Loading from '../loading'
import { toggleRegistration } from "@/lib/actions/admin"

export const dynamic = "force-dynamic";

async function AdminContent() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Authorize User
  const { data: _userRoles, error: roleError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)

  const EXCEPTION_IDS = [
    '357a1587-7f5c-42b1-be63-9907f993697f', // Me
    'ac5118b2-ea11-4b73-b96d-cf22f7e7c3bb', // Naman
  ]

  const isException = EXCEPTION_IDS.includes(user.id)
    
  if (!isException && (!userRole || (userRole.role !== "core" && userRole.role !== "lead"))) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-black border border-red-500 shadow-[0_0_20px_#ff0000] p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center text-center font-mono text-red-500">
            <AlertTriangle className="h-16 w-16 mb-4 animate-pulse" />
            <h1 className="text-4xl font-bold mb-4 glitch-hover">ACCESS DENIED</h1>
            <p className="text-xl mb-6 tracking-widest">UNAUTHORIZED ROOT ATTEMPT LOGGED.</p>

            <p className="text-sm opacity-70 mb-4">
              Your IP address and hardware ID have been recorded and reported to the system administrator.
              Only CORE and LEAD operatives may access this terminal.
            </p>
            {roleError && (
              <div className="bg-red-900/30 p-2 mb-6 border border-red-500/50 text-xs text-left">
                [SYSTEM_LOG] Auth Check Failed: {roleError.message || JSON.stringify(roleError)}
              </div>
            )}
            <a href="/dashboard" className="px-6 py-2 border border-red-500 hover:bg-red-500 hover:text-black transition-colors uppercase font-bold tracking-widest">
              Return to Safe Sector
            </a>
          </div>
        </div>
      </div>
    )
  }

  // Fetch the admin's team_id dynamically
  const { data: _profile } = await supabase
    .from("profiles")
    .select("team_id")
    .eq("id", user.id)
    .single()

  const profile = _profile as any;
  const adminTeamId = profile?.team_id || (userRole.role === 'core' ? 'f876de5d-4ada-4e24-bc97-bba3408d82f2' : null);

  if (!adminTeamId) {
    return <div className="text-red-500 font-mono text-center p-8">CRITICAL ERROR: OPERATIVE IS NOT ASSIGNED TO A TEAM.</div>
  }

  // Fetch ALL submissions scoped EXACTLY to the admin's team
  const { data: allSubmissions } = await supabase
    .from("submissions")
    .select("*, profiles(full_name), activity_catalog(label, points), submission_proofs(*)")
    .eq("team_id", adminTeamId)
    .order("submitted_at", { ascending: false })

  // Fetch ByteBrigade Team settings (we use color column for registration toggle)
  const { data: adminTeam } = await supabase
    .from("teams")
    .select("color")
    .eq("id", "f876de5d-4ada-4e24-bc97-bba3408d82f2") // Byte Brigade ID
    .single()
    
  const registrationState = (adminTeam as any)?.color === "CLOSED" ? "CLOSED" : "OPEN"

  return (
    <div className="container py-8 flex flex-col gap-8 min-h-[calc(100vh-3.5rem)]">
      <div className="flex flex-col gap-2 font-mono border-b border-red-500/30 pb-4">
        <h1 className="text-3xl font-bold text-red-500 tracking-wider glitch-hover">/root/cmd_center</h1>
        <p className="text-red-500/60 uppercase tracking-widest text-xs">
          COMMAND & VERIFICATION CENTER
        </p>
      </div>

      {/* SYSTEM SETTINGS */}
      <div className="bg-matrix-dark/80 backdrop-blur border border-red-500/30 p-6 flex items-center justify-between font-mono">
        <div>
          <h2 className="text-red-500 font-bold tracking-widest mb-1">[ SYSTEM_SETTINGS ]</h2>
          <p className="text-xs text-red-500/60">Manage sector configurations and operational status.</p>
        </div>
        <form action={async (fd) => {
          "use server";
          await toggleRegistration(fd);
        }}>
          <input type="hidden" name="currentState" value={registrationState} />
          <div className="flex items-center gap-4">
            <span className="text-sm text-red-500 font-bold">REGISTRATION:</span>
            <button type="submit" className={`px-4 py-2 border font-bold tracking-widest transition-colors ${registrationState === 'OPEN' ? 'border-matrix-green text-matrix-green hover:bg-matrix-green hover:text-black' : 'border-red-500 text-red-500 hover:bg-red-500 hover:text-black'}`}>
              {registrationState}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-matrix-dark/80 backdrop-blur terminal-border-red">
        <AdminVerificationTable submissions={(allSubmissions as any[]) || []} />
      </div>
    </div>
  )
}

export default function AdminPage() {
  return (
    <Suspense fallback={<Loading />}>
      <AdminContent />
    </Suspense>
  )
}
