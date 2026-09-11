"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

async function verifyAdmin() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false;
  
  const { data: userRole } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single()
    
  if (userRole && (userRole.role === "core" || userRole.role === "lead")) {
    return true
  }
  
  return false;
}

export async function verifySubmission(formData: FormData) {
  if (!(await verifyAdmin())) return { error: "Unauthorized" }

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

  if (error) return { error: error.message }
  
  revalidatePath("/admin")
  revalidatePath("/dashboard")
  return { success: true }
}

export async function rejectSubmission(formData: FormData) {
  if (!(await verifyAdmin())) return { error: "Unauthorized" }

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

  if (error) return { error: error.message }
  
  revalidatePath("/admin")
  return { success: true }
}

export async function applyPlagiarismPenalty(formData: FormData) {
  if (!(await verifyAdmin())) return { error: "Unauthorized" }

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

  if (error) return { error: error.message }
  
  revalidatePath("/admin")
  revalidatePath("/dashboard")
  return { success: true }
}
