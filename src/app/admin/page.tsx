import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AdminVerificationTable from "@/components/dashboard/AdminVerificationTable"
import { Card, CardContent } from "@/components/ui/card"

export default async function AdminPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch pending submissions
  const { data: pendingSubmissions } = await supabase
    .from("submissions")
    .select("*, profiles(full_name), activity_catalog(label, points), submission_proofs(*)")
    .eq("status", "pending")
    .order("submitted_at", { ascending: true })

  return (
    <div className="container py-8 flex flex-col gap-8 min-h-[calc(100vh-3.5rem)]">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold font-mono text-cyber-magenta tracking-wider glitch-hover">COMMAND_CENTER</h1>
        <p className="text-muted-foreground font-mono uppercase tracking-widest text-xs">Awaiting Leader Verification</p>
      </div>

      <Card className="bg-background/80 backdrop-blur border-cyber-magenta shadow-[0_0_15px_rgba(255,0,60,0.1)]">
        <CardContent className="p-0">
          <AdminVerificationTable submissions={pendingSubmissions || []} />
        </CardContent>
      </Card>
    </div>
  )
}
