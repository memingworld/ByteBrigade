import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

import { Suspense } from 'react'
import Loading from '../loading'

async function TeamContent() {
  const supabase = createClient()
  
  // We don't strictly need auth for this page if they want it public,
  // but let's assume they want it protected like the rest of the portal.
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect("/login")
  }

  const TEAM_ID = "f876de5d-4ada-4e24-bc97-bba3408d82f2"

  // Fetch all team members
  const { data: _teamMembers } = await supabase
    .from("profiles")
    .select("*")
    .eq("team_id", TEAM_ID)
    .order("full_name", { ascending: true })

  const teamMembers = (_teamMembers as any[]) || []

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center py-20 px-4 bg-[#050505]">
      
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-[0.2em] uppercase text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
          MEET OUR TEAM
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto w-full">
        {teamMembers.map((member) => {
          const initials = member.full_name
            ?.split(" ")
            .map((n: string) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase() || "??"

          return (
            <div 
              key={member.id} 
              className="flex flex-col items-center p-8 rounded-lg bg-[#0d0d12] border border-white/5 hover:border-white/10 hover:bg-[#12121a] transition-all duration-300"
            >
              {member.avatar_path ? (
                <img 
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${member.avatar_path}`} 
                  alt={member.full_name} 
                  className="w-24 h-24 rounded-full object-cover mb-6 border border-white/10"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-[#16161f] border border-white/10 flex items-center justify-center mb-6">
                  <span className="text-xl font-bold text-white/50 tracking-widest">{initials}</span>
                </div>
              )}
              
              <h3 className="text-lg font-bold text-white mb-2 text-center">{member.full_name}</h3>
              <p className="text-sm text-white/40 text-center">{member.department || "Operative"}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function TeamPage() {
  return (
    <Suspense fallback={<Loading />}>
      <TeamContent />
    </Suspense>
  )
}
