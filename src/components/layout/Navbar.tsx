import Link from "next/link";
import { Terminal } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-matrix-green/30 bg-matrix-dark/90 backdrop-blur">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex w-full">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Terminal className="h-6 w-6 text-matrix-green" />
            <span className="hidden font-bold sm:inline-block font-mono tracking-wider text-matrix-green glitch-hover text-lg">
              root@byte-brigade:~#
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-mono flex-1">
            <Link
              href="/dashboard"
              className="transition-colors hover:text-matrix-green text-matrix-green/70 flex items-center gap-2"
            >
              [ THE_GRID ]
            </Link>
            <Link
              href="/submit"
              className="transition-colors hover:text-matrix-green text-matrix-green/70 flex items-center gap-2"
            >
              [ UPLINK ]
            </Link>
            <Link
              href="/admin"
              className="transition-colors hover:text-red-500 text-red-500/70 flex items-center gap-2"
            >
              [ CMD_CENTER ]
            </Link>
            <Link
              href="/settings"
              className="transition-colors hover:text-matrix-green text-matrix-green/70 flex items-center gap-2"
            >
              [ SETTINGS ]
            </Link>
          </nav>
        </div>
        
        {/* Mobile nav placeholder */}
        <div className="md:hidden flex flex-1 items-center gap-2">
          <Terminal className="h-5 w-5 text-matrix-green" />
          <span className="font-bold font-mono tracking-wider text-matrix-green">root@bb:~#</span>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-matrix-green/30 bg-matrix-dark/90 backdrop-blur pb-safe">
        <div className="flex justify-around items-center h-16 font-mono">
          <Link href="/dashboard" className="flex flex-col items-center justify-center w-full h-full text-matrix-green/70 hover:text-matrix-green">
            <span className="text-xs">[GRID]</span>
          </Link>
          <Link href="/submit" className="flex flex-col items-center justify-center w-full h-full text-matrix-green/70 hover:text-matrix-green">
            <span className="text-xs">[UPLINK]</span>
          </Link>
          <Link href="/admin" className="flex flex-col items-center justify-center w-full h-full text-red-500/70 hover:text-red-500">
            <span className="text-xs">[CMD]</span>
          </Link>
          <Link href="/settings" className="flex flex-col items-center justify-center w-full h-full text-matrix-green/70 hover:text-matrix-green">
            <span className="text-xs">[SET]</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
