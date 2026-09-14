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
  return redirect("/signup?message=REGISTRATION CLOSED. TEAM CAPACITY (8/8) REACHED.")
}

export async function logout() {
  const supabase = createClient()
  await supabase.auth.signOut()
  return redirect("/login")
}
