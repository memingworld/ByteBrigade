"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function updateProfile(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  const fullName = formData.get("fullName") as string
  const department = formData.get("department") as string
  const sprintTrack = formData.get("sprintTrack") as string
  const enrollmentNo = formData.get("enrollmentNo") as string
  const file = formData.get("avatarFile") as File
  
  if (!fullName || !fullName.trim()) return { error: "INVALID_INPUT: Name is strictly required." }
  if (enrollmentNo && !/^\d+$/.test(enrollmentNo)) {
    return { error: "INVALID_INPUT: Enrollment number must contain only numerical digits." }
  }

  const validDepartments = ["Technical", "Event Management", "R&D", "Social", "Design", "PR"]
  if (!validDepartments.includes(department)) {
    return { error: "INVALID_INPUT: Unauthorized department selected." }
  }

  const validTracks = ["", "code", "open_source", "build", "pitch"]
  if (!validTracks.includes(sprintTrack)) {
    return { error: "INVALID_INPUT: Unauthorized sprint track selected." }
  }

  let avatarPath = null;
  
  // Handle avatar upload
  if (file && file.size > 0) {
    if (file.size > 5 * 1024 * 1024) {
      return { error: "Avatar image exceeds 5MB limit" }
    }
    const fileExt = file.name.split(".").pop()
    const fileName = `${user.id}-${Math.random()}.${fileExt}`
    const filePath = `${user.id}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true })

    if (uploadError) {
      return { error: `AVATAR_UPLOAD_ERROR: ${uploadError.message}` }
    }
    
    avatarPath = filePath
  }
  
  const updatePayload: any = {
    id: user.id,
    team_id: "f876de5d-4ada-4e24-bc97-bba3408d82f2",
    full_name: fullName,
    department,
    enrollment_no: enrollmentNo,
    sprint_track: sprintTrack || null
  }
  
  if (avatarPath) {
    updatePayload.avatar_path = avatarPath
  }

  // @ts-ignore
  const { error } = await supabase.from("profiles").upsert(updatePayload)

  if (error) {
    return { error: error.message }
  }

  // Also check if they want to update password
  const newPassword = formData.get("password") as string
  if (newPassword && newPassword.trim() !== "") {
    const { error: passError } = await supabase.auth.updateUser({
      password: newPassword
    })
    
    if (passError) {
      return { error: `Profile updated, but password failed: ${passError.message}` }
    }
  }

  revalidatePath("/settings")
  revalidatePath("/dashboard")
  return { success: true }
}
