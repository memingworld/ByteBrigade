"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function submitActivity(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return redirect("/login")
  }

  // Get user profile to get team_id
  const { data: _profile } = await supabase.from("profiles").select("team_id").eq("id", user.id).single()
  const profile = _profile as any;
  
  if (!profile) {
    return { error: "Profile not found" }
  }

  const activityId = formData.get("activityId") as string
  const occurredOn = formData.get("occurredOn") as string
  const title = formData.get("title") as string
  const details = formData.get("details") as string
  const externalUrl = formData.get("externalUrl") as string
  const file = formData.get("proofFile") as File

  // Insert submission
  // @ts-ignore
  const { data: _submission, error: subError } = await supabase.from("submissions").insert({
    member_id: user.id,
    team_id: profile.team_id,
    activity_id: activityId,
    occurred_on: occurredOn,
    title,
    details,
    external_url: externalUrl,
    status: "pending"
  } as any).select().single()
  const submission = _submission as any;

  if (subError || !submission) {
    console.error("Submission error:", subError)
    return { error: `DB_ERROR: ${subError?.message || 'Unknown insertion error'}` }
  }

  // Handle file upload if present
  if (file && file.size > 0) {
    const fileExt = file.name.split(".").pop()
    const fileName = `${submission.id}-${Math.random()}.${fileExt}`
    const filePath = `${user.id}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from("proofs")
      .upload(filePath, file)

    if (uploadError) {
      console.error("Upload error:", uploadError)
      return { error: `UPLOAD_ERROR: ${uploadError.message}` }
    }

    // Record proof
    // @ts-ignore
    const { error: proofInsertError } = await supabase.from("submission_proofs").insert({
      submission_id: submission.id,
      storage_path: filePath,
      file_name: file.name,
      mime_type: file.type,
      size_bytes: file.size
    } as any)

    if (proofInsertError) {
      return { error: `PROOF_DB_ERROR: ${proofInsertError.message}` }
    }
  }

  revalidatePath("/submit")
  revalidatePath("/dashboard")
  
  return { success: true }
}
