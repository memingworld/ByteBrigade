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
  
  // Byte Brigade team ID
  const TEAM_ID = "00000000-0000-0000-0000-000000000000" // Replace with actual or fetch by slug

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return redirect("/signup?message=" + error.message)
  }

  if (data.user) {
    // Insert into profiles
    // @ts-ignore
    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      full_name: fullName,
      department: department,
      team_id: TEAM_ID, // Assuming this exists or handles dynamically
      sprint_track: sprintTrack,
    } as any)
    
    if (profileError) {
      return redirect("/signup?message=Profile creation failed")
    }
  }

  return redirect("/dashboard")
}

export async function logout() {
  const supabase = createClient()
  await supabase.auth.signOut()
  return redirect("/login")
}
