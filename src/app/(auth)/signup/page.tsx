import { signup } from "@/lib/actions/auth"
import MatrixRain from "@/components/ui/MatrixRain"

export default function SignupPage({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center relative px-4 py-8">
      <MatrixRain />
      <div className="w-full max-w-md bg-matrix-dark/80 backdrop-blur-md p-8 terminal-border relative z-10">
        <div className="mb-6 font-mono">
          <p className="text-matrix-green mb-2">Initializing Operator Registration...</p>
          <h1 className="text-2xl font-bold text-matrix-green animate-pulse">
            root@byte-brigade:~# adduser
          </h1>
        </div>

        <div className="flex-1 flex flex-col w-full justify-center gap-6 mt-8">
          <div className="border border-red-500 bg-red-900/20 p-6 text-center">
            <h2 className="text-xl font-bold text-red-500 mb-2 font-mono glitch-hover">REGISTRATION CLOSED</h2>
            <p className="text-red-400 font-mono text-sm">
              TEAM BYTE BRIGADE HAS REACHED MAXIMUM OPERATIVE CAPACITY (8/8).
              NO FURTHER ENLISTMENTS ARE BEING ACCEPTED AT THIS TIME.
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-matrix-green/20 text-center">
            <p className="text-sm text-matrix-green/70 font-mono">
              <a href="/login" className="hover:text-matrix-green underline decoration-matrix-green/30 hover:decoration-matrix-green">
                ABORT / RETURN TO LOGIN
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
