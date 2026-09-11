import { login } from "@/lib/actions/auth"
import MatrixRain from "@/components/ui/MatrixRain"

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center relative px-4">
      <MatrixRain />
      
      <div className="w-full max-w-md bg-matrix-dark/80 backdrop-blur-md p-8 terminal-border relative z-10">
        <div className="mb-8 font-mono">
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
  )
}
