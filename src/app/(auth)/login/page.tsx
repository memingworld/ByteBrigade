import Image from "next/image"
import { login } from "@/lib/actions/auth"
import MatrixRain from "@/components/ui/MatrixRain"
import { createClient } from "@/lib/supabase/server"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  const supabase = createClient()
  const TEAM_ID = "f876de5d-4ada-4e24-bc97-bba3408d82f2"

  // Fetch safe public profile data for the Meet Our Team section via Secure RPC
  const { data: _teamMembers, error } = await (supabase as any).rpc('get_meet_our_team', { p_team_id: TEAM_ID })
    
  if (error) {
    console.error("RPC Error fetching meet our team:", error)
  }

  const teamMembers = (_teamMembers as any[]) || []

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#050505] flex flex-col items-center">
      <div className="absolute inset-0 pointer-events-none opacity-50">
        <MatrixRain />
      </div>
      
      {/* Login Terminal Section */}
      <div className="w-full flex-1 flex flex-col justify-center items-center px-4 py-20 min-h-[80vh]">
        <div className="w-full max-w-md bg-matrix-dark/80 backdrop-blur-md p-8 terminal-border relative z-10 shadow-[0_0_30px_rgba(0,255,0,0.1)]">
          <div className="mb-8 font-mono">
            <div className="flex flex-col items-center mb-6">
              <Image src="/logo.jpg" alt="Byte Brigade Logo" width={96} height={96} className="rounded-lg shadow-[0_0_20px_rgba(0,255,0,0.2)] border border-matrix-green/30" />
            </div>
            <p className="text-matrix-green mb-2">System Initialization...</p>
            <p className="text-matrix-green mb-2">Connecting to Byte_Brigade_Mainframe...</p>
            <p className="text-matrix-green mb-6">Connection Established. Awaiting Authentication.</p>
            <h1 className="text-2xl font-bold text-matrix-green animate-pulse">
              root@byte-brigade:~# login
            </h1>
          </div>

          <form className="flex-1 flex flex-col w-full justify-center gap-6" action={login}>
            <div className="font-mono text-matrix-green">
              <label className="block mb-2" htmlFor="email">
                &gt; input_email
              </label>
              <input
                className="w-full bg-transparent border-b border-matrix-green/50 focus:border-matrix-green outline-none text-matrix-green placeholder:text-matrix-green/30"
                name="email"
                placeholder="operator@bytebrigade.com"
                required
              />
            </div>
            
            <div className="font-mono text-matrix-green">
              <label className="block mb-2" htmlFor="password">
                &gt; input_password
              </label>
              <input
                className="w-full bg-transparent border-b border-matrix-green/50 focus:border-matrix-green outline-none text-matrix-green placeholder:text-matrix-green/30"
                type="password"
                name="password"
                placeholder="••••••••••••"
                required
              />
            </div>

            <button className="bg-matrix-green text-matrix-dark font-bold font-mono py-2 px-4 mt-4 hover:bg-white hover:text-matrix-dark transition-all uppercase tracking-widest relative overflow-hidden group">
              <span className="relative z-10">Execute / Authenticate</span>
              <div className="absolute inset-0 h-full w-full bg-matrix-green scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-200 ease-out z-0"></div>
            </button>

            {searchParams?.message && (
              <p className="mt-4 p-2 bg-red-900/50 text-red-500 font-mono text-center terminal-border-red">
                ERROR: {searchParams.message}
              </p>
            )}

            <div className="mt-8 pt-4 border-t border-matrix-green/20 text-center">
              <p className="text-sm text-matrix-green/70 font-mono">
                UNAUTHORIZED ACCESS IS STRICTLY PROHIBITED.
              </p>
              <p className="text-sm text-matrix-green/70 font-mono mt-2">
                <a href="/signup" className="hover:text-matrix-green underline decoration-matrix-green/30 hover:decoration-matrix-green">
                  REQUEST CLEARANCE (SIGN UP)
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Meet Our Team Section */}
      <div className="w-full bg-[#050505] relative z-10 pt-10 pb-32 px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-[0.2em] uppercase text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            MEET OUR TEAM
          </h2>
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
    </div>
  )
}
