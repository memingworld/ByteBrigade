import { createClient } from "@/lib/supabase/server"
import SubmissionForm from "@/components/forms/SubmissionForm"
import SubmissionHistory from "@/components/dashboard/SubmissionHistory"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function SubmitPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch active catalog
  const { data: catalog } = await supabase
    .from("activity_catalog")
    .select("*")
    .eq("is_active", true)
    .order("sort_order")

  // Fetch user submission history
  const { data: submissions } = await supabase
    .from("submissions")
    .select("*, activity_catalog(label)")
    .eq("member_id", user?.id)
    .order("submitted_at", { ascending: false })

  return (
    <div className="container py-8 flex flex-col lg:flex-row gap-8">
      <div className="flex-1">
        <h1 className="text-3xl font-bold font-mono text-cyber-cyan tracking-wider mb-6 glitch-hover">UPLINK_PORTAL</h1>
        <Card className="bg-background/80 backdrop-blur">
          <CardContent className="pt-6">
            <SubmissionForm catalog={catalog || []} />
          </CardContent>
        </Card>
      </div>

      <div className="flex-1">
        <h2 className="text-xl font-bold font-mono text-muted-foreground tracking-wider mb-6">TRANSMISSION_LOGS</h2>
        <Card className="bg-background/80 backdrop-blur">
          <CardContent className="p-0">
            <SubmissionHistory submissions={(submissions as any[]) || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
