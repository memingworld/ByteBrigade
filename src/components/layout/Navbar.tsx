import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { Zap, LayoutGrid, Upload, ShieldAlert } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Zap className="h-6 w-6 text-cyber-cyan" />
            <span className="hidden font-bold sm:inline-block font-mono tracking-wider text-cyber-cyan glitch-hover">
              BYTE_BRIGADE
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/dashboard"
              className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-2"
            >
              <LayoutGrid className="w-4 h-4" />
              THE_GRID
            </Link>
            <Link
              href="/submit"
              className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              UPLINK
            </Link>
            <Link
              href="/admin"
              className="transition-colors hover:text-cyber-magenta text-foreground/60 flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4" />
              CMD_CENTER
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Mobile nav placeholder */}
            <div className="md:hidden flex items-center gap-2">
              <Zap className="h-5 w-5 text-cyber-cyan" />
              <span className="font-bold font-mono tracking-wider text-cyber-cyan">BB</span>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>
      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/80 backdrop-blur pb-safe">
        <div className="flex justify-around items-center h-16">
          <Link href="/dashboard" className="flex flex-col items-center justify-center w-full h-full text-muted-foreground hover:text-cyber-cyan">
            <LayoutGrid className="h-5 w-5" />
            <span className="text-[10px] mt-1 font-mono">GRID</span>
          </Link>
          <Link href="/submit" className="flex flex-col items-center justify-center w-full h-full text-muted-foreground hover:text-cyber-cyan">
            <Upload className="h-5 w-5" />
            <span className="text-[10px] mt-1 font-mono">UPLINK</span>
          </Link>
          <Link href="/admin" className="flex flex-col items-center justify-center w-full h-full text-muted-foreground hover:text-cyber-magenta">
            <ShieldAlert className="h-5 w-5" />
            <span className="text-[10px] mt-1 font-mono">CMD</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
