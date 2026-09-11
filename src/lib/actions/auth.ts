"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function login(formData: FormData) {
  const supabase = createClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return redirect("/login?message=Could not authenticate user")
  }

  return redirect("/dashboard")
}

export async function signup(formData: FormData) {
  const supabase = createClient()
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const fullName = formData.get("fullName") as string
  const department = formData.get("department") as string
  const sprintTrack = formData.get("sprintTrack") as string
  const enrollmentNo = formData.get("enrollmentNo") as string

  // 1. Create the user in Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) {
    return redirect("/signup?message=" + authError.message)
  }

  const userId = authData.user?.id

  if (userId) {
    // 2. Create the user profile
    const { error: profileError } = await supabase.from("profiles").insert({
      id: userId,
      full_name: fullName,
      department: department,
      enrollment_no: enrollmentNo,
      team_id: "f876de5d-4ada-4e24-bc97-bba3408d82f2", // Default to Byte Brigade
      sprint_track: sprintTrack,
      is_active: true
    } as any)
    
    if (profileError) {
      console.error("Profile Error:", profileError)
      return redirect("/signup?message=Profile creation failed: " + profileError.message)
    }
  }

  return redirect("/dashboard")
}

export async function logout() {
  const supabase = createClient()
  await supabase.auth.signOut()
  return redirect("/login")
}
