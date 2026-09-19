import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import SubmissionForm from "@/components/forms/SubmissionForm"
import SubmissionHistory from "@/components/dashboard/SubmissionHistory"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Suspense } from 'react'
import Loading from '../loading'

async function SubmitContent() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch active catalog
  const { data: catalog } = await supabase
    .from("activity_catalog")
    .select("*")
    .eq("is_active", true)
    .order("sort_order")

  // Fetch user submission history
  const { data: submissions, error: subError } = await supabase
    .from("submissions")
    .select("*, activity_catalog(label)")
    .eq("member_id", user.id)
    .order("submitted_at", { ascending: false })

  if (subError) {
    console.error("SUBMIT PAGE ERROR:", subError)
  }

  return (
    <div className="container py-8 flex flex-col lg:flex-row gap-8 font-mono">
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-matrix-green tracking-wider mb-6 glitch-hover">/bin/inject_payload</h1>
        <Card className="bg-matrix-dark/80 backdrop-blur terminal-border">
          <CardContent className="pt-6">
            <SubmissionForm catalog={catalog || []} />
          </CardContent>
        </Card>
      </div>

      <div className="flex-1">
        <h2 className="text-xl font-bold text-matrix-green/70 tracking-wider mb-6">[ TRANSMISSION_LOGS ]</h2>
        <Card className="bg-matrix-dark/80 backdrop-blur terminal-border">
          <CardContent className="p-0">
            <SubmissionHistory submissions={(submissions as any[]) || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function SubmitPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SubmitContent />
    </Suspense>
  )
}
