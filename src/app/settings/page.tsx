import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import ProfileSettingsForm from "@/components/forms/ProfileSettingsForm"

export default async function SettingsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/login")
  }

  const { data: _profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()
    
  const profile = _profile as any

  if (!profile) {
    return (
      <div className="container py-10 font-mono text-matrix-green">
        <h1 className="text-2xl font-bold mb-6">/etc/profile</h1>
        <div className="p-4 border border-red-500 text-red-500 bg-red-900/20">
          FATAL ERROR: Profile record not found in database. 
          Are you sure you bypassed the email confirmation?
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-2xl py-10">
      <div className="mb-8 font-mono border-b border-matrix-green/30 pb-4">
        <h1 className="text-3xl font-bold text-matrix-green glitch-hover">
          /etc/profile
        </h1>
        <p className="text-matrix-green/60 mt-2">
          USER CONFIGURATION FILE
        </p>
      </div>

      <div className="terminal-border p-6 bg-matrix-dark/80 backdrop-blur">
        <ProfileSettingsForm profile={profile} userEmail={user.email || "UNKNOWN"} />
      </div>
    </div>
  )
}
