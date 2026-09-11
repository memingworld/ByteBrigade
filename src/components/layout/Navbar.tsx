import Link from "next/link";
import { Terminal, Grid, UploadCloud, ShieldAlert, Settings, LogOut } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-matrix-green/30 bg-matrix-dark/90 backdrop-blur">
      <div className="container flex h-14 items-center justify-between">
        <div className="hidden md:flex flex-1 items-center">
          <Link href="/" className="mr-8 flex items-center space-x-2">
            <Terminal className="h-6 w-6 text-matrix-green" />
            <span className="font-bold sm:inline-block font-mono tracking-wider text-matrix-green glitch-hover text-lg">
              root@byte-brigade:~#
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-mono">
            <Link
              href="/dashboard"
              className="transition-colors hover:text-matrix-green text-matrix-green/70 flex items-center gap-2"
            >
              <Grid className="w-4 h-4" /> [ THE_MATRIX ]
            </Link>
            <Link
              href="/submit"
              className="transition-colors hover:text-matrix-green text-matrix-green/70 flex items-center gap-2"
            >
              <UploadCloud className="w-4 h-4" /> [ INJECT_PAYLOAD ]
            </Link>
            <Link
              href="/admin"
              className="transition-colors hover:text-red-500 text-red-500/70 flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4" /> [ ROOT_ACCESS ]
            </Link>
            <Link
              href="/settings"
              className="transition-colors hover:text-matrix-green text-matrix-green/70 flex items-center gap-2"
            >
              <Settings className="w-4 h-4" /> [ SYS_PREFS ]
            </Link>
          </nav>
        </div>
        
        {/* Disconnect on the right for Desktop */}
        <div className="hidden md:flex">
          <form action={async () => {
            "use server"
            const { logout } = await import("@/lib/actions/auth")
            await logout()
          }}>
            <button type="submit" className="transition-colors hover:text-red-500 text-matrix-green/70 flex items-center gap-2 uppercase font-mono text-sm">
              <LogOut className="w-4 h-4" /> [ DISCONNECT ]
            </button>
          </form>
        </div>
        
        {/* Mobile nav placeholder */}
        <div className="md:hidden flex flex-1 items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-matrix-green" />
            <span className="font-bold font-mono tracking-wider text-matrix-green">root@bb:~#</span>
          </div>
          <form action={async () => {
            "use server"
            const { logout } = await import("@/lib/actions/auth")
            await logout()
          }}>
            <button type="submit" className="text-red-500/70 hover:text-red-500 p-2">
              <LogOut className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-matrix-green/30 bg-matrix-dark/90 backdrop-blur pb-safe">
        <div className="flex justify-around items-center h-16 font-mono">
          <Link href="/dashboard" className="flex flex-col items-center justify-center w-full h-full text-matrix-green/70 hover:text-matrix-green">
            <Grid className="w-5 h-5 mb-1" />
            <span className="text-[10px]">[MATRIX]</span>
          </Link>
          <Link href="/submit" className="flex flex-col items-center justify-center w-full h-full text-matrix-green/70 hover:text-matrix-green">
            <UploadCloud className="w-5 h-5 mb-1" />
            <span className="text-[10px]">[PAYLOAD]</span>
          </Link>
          <Link href="/admin" className="flex flex-col items-center justify-center w-full h-full text-red-500/70 hover:text-red-500">
            <ShieldAlert className="w-5 h-5 mb-1" />
            <span className="text-[10px]">[ROOT]</span>
          </Link>
          <Link href="/settings" className="flex flex-col items-center justify-center w-full h-full text-matrix-green/70 hover:text-matrix-green">
            <Settings className="w-5 h-5 mb-1" />
            <span className="text-[10px]">[PREFS]</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
