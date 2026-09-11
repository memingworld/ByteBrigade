import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AdminVerificationTable from "@/components/dashboard/AdminVerificationTable"
import { AlertTriangle } from "lucide-react"

export default async function AdminPage() {
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

  const userRole = _userRoles?.[0] as any
    
  if (!userRole || (userRole.role !== "core" && userRole.role !== "lead")) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-black border border-red-500 shadow-[0_0_20px_#ff0000] p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center text-center font-mono text-red-500">
            <AlertTriangle className="h-16 w-16 mb-4 animate-pulse" />
            <h1 className="text-4xl font-bold mb-4 glitch-hover">ACCESS DENIED</h1>
            <p className="text-xl mb-6 tracking-widest">UNAUTHORIZED ROOT ATTEMPT LOGGED.</p>

            <p className="text-sm opacity-70 mb-8">
              Your IP address and hardware ID have been recorded and reported to the system administrator.
              Only CORE and LEAD operatives may access this terminal.
            </p>
            <a href="/dashboard" className="px-6 py-2 border border-red-500 hover:bg-red-500 hover:text-black transition-colors uppercase font-bold tracking-widest">
              Return to Safe Sector
            </a>
          </div>
        </div>
      </div>
    )
  }

  // Fetch pending submissions
  const { data: pendingSubmissions } = await supabase
    .from("submissions")
    .select("*, profiles(full_name), activity_catalog(label, points), submission_proofs(*)")
    .eq("status", "pending")
    .order("submitted_at", { ascending: true })

  return (
    <div className="container py-8 flex flex-col gap-8 min-h-[calc(100vh-3.5rem)]">
      <div className="flex flex-col gap-2 font-mono border-b border-red-500/30 pb-4">
        <h1 className="text-3xl font-bold text-red-500 tracking-wider glitch-hover">/root/cmd_center</h1>
        <p className="text-red-500/60 uppercase tracking-widest text-xs">
          AWAITING LEADER VERIFICATION
        </p>
      </div>

      <div className="bg-matrix-dark/80 backdrop-blur terminal-border-red">
        <AdminVerificationTable submissions={(pendingSubmissions as any[]) || []} />
      </div>
    </div>
  )
}
