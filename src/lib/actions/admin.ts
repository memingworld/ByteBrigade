"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

async function verifyAdmin() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { authorized: false, teamId: null };
  
  const { data: _userRoles } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    
  const userRole = _userRoles?.[0] as any

  const { data: _profile } = await supabase
    .from("profiles")
    .select("team_id")
    .eq("id", user.id)
    .single()
    
  const profile = _profile as any

  const TEAM_ID = profile?.team_id || (userRole?.role === 'core' ? 'f876de5d-4ada-4e24-bc97-bba3408d82f2' : null);

  if (userRole && (userRole.role === "core" || userRole.role === "lead") && TEAM_ID) {
    return { authorized: true, teamId: TEAM_ID }
  }
  
  return { authorized: false, teamId: null };
}

export async function verifySubmission(formData: FormData) {
  const adminCheck = await verifyAdmin()
  if (!adminCheck.authorized) return { error: "Unauthorized" }

  const supabase = createClient()
  const submissionId = formData.get("submissionId") as string
  const awardedPoints = parseInt(formData.get("awardedPoints") as string)
  const decisionNote = formData.get("decisionNote") as string

  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await supabase
    .from("submissions")
    // @ts-ignore
    .update({
      status: "verified",
      awarded_points: awardedPoints,
      decided_by: user?.id || null,
      decided_at: new Date().toISOString(),
      decision_note: decisionNote
    } as any)
    .eq("id", submissionId)
    .eq("team_id", adminCheck.teamId) // CRITICAL: only allow update if it belongs to admin's team

  if (error) return { error: error.message }
  
  revalidatePath("/admin")
  revalidatePath("/dashboard")
  return { success: true }
}

export async function rejectSubmission(formData: FormData) {
  const adminCheck = await verifyAdmin()
  if (!adminCheck.authorized) return { error: "Unauthorized" }

  const supabase = createClient()
  const submissionId = formData.get("submissionId") as string
  const decisionNote = formData.get("decisionNote") as string

  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await supabase
    .from("submissions")
    // @ts-ignore
    .update({
      status: "rejected",
      awarded_points: 0,
      decided_by: user?.id || null,
      decided_at: new Date().toISOString(),
      decision_note: decisionNote
    } as any)
    .eq("id", submissionId)
    .eq("team_id", adminCheck.teamId)

  if (error) return { error: error.message }
  
  revalidatePath("/admin")
  return { success: true }
}

export async function applyPlagiarismPenalty(formData: FormData) {
  const adminCheck = await verifyAdmin()
  if (!adminCheck.authorized) return { error: "Unauthorized" }

  const supabase = createClient()
  const submissionId = formData.get("submissionId") as string
  const decisionNote = formData.get("decisionNote") as string
  const basePoints = parseInt(formData.get("basePoints") as string)

  const { data: { user } } = await supabase.auth.getUser()
  
  // 90% point deduction rule applied to penalty_points
  const penaltyPoints = Math.round(basePoints * 0.9)

  const { error } = await supabase
    .from("submissions")
    // @ts-ignore
    .update({
      status: "rejected",
      awarded_points: 0,
      penalty_points: penaltyPoints,
      decided_by: user?.id || null,
      decided_at: new Date().toISOString(),
      decision_note: `PLAGIARISM DETECTED: 90% Penalty Applied. ${decisionNote}`
    } as any)
    .eq("id", submissionId)
    .eq("team_id", adminCheck.teamId)

  if (error) return { error: error.message }
  
  revalidatePath("/admin")
  revalidatePath("/dashboard")
  return { success: true }
}
export async function revertSubmission(formData: FormData) {
  const adminCheck = await verifyAdmin()
  if (!adminCheck.authorized) return { error: "Unauthorized" }

  const supabase = createClient()
  const submissionId = formData.get("submissionId") as string

  const { error } = await supabase
    .from("submissions")
    // @ts-ignore
    .update({
      status: "pending",
      awarded_points: 0,
      penalty_points: 0,
      decided_by: null,
      decided_at: null,
      decision_note: null
    } as any)
    .eq("id", submissionId)
    .eq("team_id", adminCheck.teamId)

  if (error) return { error: error.message }
  
  revalidatePath("/admin")
  revalidatePath("/dashboard")
  return { success: true }
}
export async function toggleRegistration(formData: FormData) {
  const adminCheck = await verifyAdmin()
  if (!adminCheck.authorized) return { error: "Unauthorized" }

  const supabase = createClient()
  const currentState = formData.get("currentState") as string
  const newState = currentState === "CLOSED" ? "OPEN" : "CLOSED"

  const { error } = await supabase
    .from("teams")
    // @ts-ignore
    .update({ color: newState } as any)
    .eq("id", "f876de5d-4ada-4e24-bc97-bba3408d82f2")

  if (error) return { error: error.message }
  
  revalidatePath("/admin")
  revalidatePath("/signup")
  return { success: true }
}
