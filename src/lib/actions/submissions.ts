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
  const { data: _roleData } = await supabase.from("user_roles").select("role").eq("user_id", user.id).single()
  
  const profile = _profile as any;
  const role = (_roleData as any)?.role;
  
  const TEAM_ID = profile?.team_id || (role === 'core' ? 'f876de5d-4ada-4e24-bc97-bba3408d82f2' : null);
  
  if (!TEAM_ID) {
    return { error: "CRITICAL ERROR: OPERATIVE IS NOT ASSIGNED TO A TEAM." }
  }

  const activityId = formData.get("activityId") as string
  const occurredOnStr = formData.get("occurredOn") as string
  const title = formData.get("title") as string
  const details = formData.get("details") as string
  const externalUrl = formData.get("externalUrl") as string
  const files = formData.getAll("proofFiles") as File[]
  const validFiles = files.filter(f => f && f.size > 0)

  if (!activityId || !occurredOnStr || !title || !details) {
    return { error: "INVALID_INPUT: Missing required payload fields." }
  }

  if (externalUrl) {
    try {
      new URL(externalUrl)
    } catch (e) {
      return { error: "INVALID_INPUT: externalUrl must be a valid strictly formatted URL." }
    }
  }

  // Enforce DB constraint: occurred_on cannot be in the future
  let occurredOnDate = new Date(occurredOnStr)
  
  if (isNaN(occurredOnDate.getTime())) {
    return { error: "INVALID_INPUT: Date format is corrupted." }
  }

  const now = new Date()
  if (occurredOnDate > now) {
    occurredOnDate = now
  }
  const occurredOn = occurredOnDate.toISOString()

  if (validFiles.length === 0) {
    return { error: "INVALID_INPUT: At least 1 evidence file is strictly required." }
  }

  if (validFiles.length > 3) {
    return { error: "INVALID_INPUT: Maximum 3 evidence files allowed." }
  }

  for (const file of validFiles) {
    if (file.size > 10 * 1024 * 1024) {
      return { error: `FILE_TOO_LARGE: Evidence file ${file.name} exceeds 10MB limit.` }
    }
  }

  // Insert submission
  // @ts-ignore
  const { data: _submission, error: subError } = await supabase.from("submissions").insert({
    member_id: user.id,
    team_id: TEAM_ID,
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

  // Handle multiple file uploads
  for (const file of validFiles) {
    const fileExt = file.name.split(".").pop()
    const fileName = `${submission.id}-${Math.random()}.${fileExt}`
    const filePath = `${user.id}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from("proofs")
      .upload(filePath, file)

    if (uploadError) {
      console.error("Upload error:", uploadError)
      return { error: `UPLOAD_ERROR on ${file.name}: ${uploadError.message}` }
    }

    // Record proof
    // @ts-ignore
    const { error: proofInsertError } = await supabase.from("submission_proofs").insert({
      submission_id: submission.id,
      team_id: TEAM_ID,
      storage_path: filePath,
      file_name: file.name,
      mime_type: file.type,
      size_bytes: file.size
    } as any)

    if (proofInsertError) {
      return { error: `PROOF_DB_ERROR for ${file.name}: ${proofInsertError.message}` }
    }
  }

  revalidatePath("/submit")
  revalidatePath("/dashboard")
  
  return { success: true }
}
