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

        <form className="flex-1 flex flex-col w-full justify-center gap-4" action={signup}>
          <div className="font-mono text-matrix-green">
            <label className="block mb-1 text-sm" htmlFor="fullName">
              &gt; input_name
            </label>
            <input
              className="w-full bg-transparent border-b border-matrix-green/50 focus:border-matrix-green outline-none text-matrix-green"
              name="fullName"
              placeholder="Neo"
              required
            />
          </div>

          <div className="font-mono text-matrix-green">
            <label className="block mb-1 text-sm" htmlFor="email">
              &gt; input_email
            </label>
            <input
              className="w-full bg-transparent border-b border-matrix-green/50 focus:border-matrix-green outline-none text-matrix-green"
              name="email"
              placeholder="neo@thematrix.com"
              required
            />
          </div>

          <div className="font-mono text-matrix-green">
            <label className="block mb-1 text-sm" htmlFor="enrollmentNo">
              &gt; input_enrollment_no
            </label>
            <input
              className="w-full bg-transparent border-b border-matrix-green/50 focus:border-matrix-green outline-none text-matrix-green"
              name="enrollmentNo"
              type="text"
              inputMode="numeric"
              pattern="\d+"
              title="Must contain only numbers"
              placeholder="0123456789"
              required
            />
          </div>
          
          <div className="font-mono text-matrix-green">
            <label className="block mb-1 text-sm" htmlFor="password">
              &gt; input_password
            </label>
            <input
              className="w-full bg-transparent border-b border-matrix-green/50 focus:border-matrix-green outline-none text-matrix-green"
              type="password"
              name="password"
              placeholder="••••••••••••"
              required
            />
          </div>

          <div className="font-mono text-matrix-green">
            <label className="block mb-1 text-sm" htmlFor="department">
              &gt; select_department
            </label>
            <select
              className="w-full bg-matrix-dark border border-matrix-green/50 focus:border-matrix-green outline-none text-matrix-green p-2 appearance-none"
              name="department"
              required
            >
              <option value="">-- SELECT SECTOR --</option>
              <option value="Technical">Technical</option>
              <option value="Event Management">Event Management</option>
              <option value="R&D">R&D</option>
              <option value="Social">Social</option>
              <option value="Design">Design</option>
              <option value="PR">PR</option>
            </select>
          </div>

          <div className="font-mono text-matrix-green">
            <label className="block mb-1 text-sm" htmlFor="sprintTrack">
              &gt; select_sprint_track
            </label>
            <select
              className="w-full bg-matrix-dark border border-matrix-green/50 focus:border-matrix-green outline-none text-matrix-green p-2 appearance-none"
              name="sprintTrack"
              required
            >
              <option value="">-- SELECT TRACK --</option>
              <option value="code">CODE</option>
              <option value="open_source">OPEN SOURCE</option>
              <option value="build">BUILD</option>
              <option value="pitch">PITCH</option>
            </select>
          </div>

          <button className="bg-matrix-green text-matrix-dark font-bold font-mono py-2 px-4 mt-6 hover:bg-white hover:text-matrix-dark transition-all uppercase tracking-widest">
            Execute / Register
          </button>

          {searchParams?.message && (
            <p className="mt-4 p-2 bg-red-900/50 text-red-500 font-mono text-center terminal-border-red">
              ERROR: {searchParams.message}
            </p>
          )}

          <div className="mt-6 pt-4 border-t border-matrix-green/20 text-center">
            <p className="text-sm text-matrix-green/70 font-mono">
              <a href="/login" className="hover:text-matrix-green underline decoration-matrix-green/30 hover:decoration-matrix-green">
                ABORT / RETURN TO LOGIN
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
