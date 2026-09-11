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
  
  // Avatar logic would go here if uploading a file, for now we just allow string path if any
  // But user just asked to change settings such as department etc.
  
  // @ts-ignore
  const { error } = await supabase.from("profiles").update({
    full_name: fullName,
    department,
    sprint_track: sprintTrack || null
  } as any).eq("id", user.id)

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
