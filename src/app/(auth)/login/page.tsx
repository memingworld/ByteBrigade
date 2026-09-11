import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login } from "@/lib/actions/auth"

export default function Login({ searchParams }: { searchParams: { message: string } }) {
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto min-h-[calc(100vh-3.5rem)]">
      <div className="flex flex-col mb-8 text-center">
        <h1 className="text-4xl font-bold font-mono text-cyber-cyan tracking-wider glitch-hover mb-2">AUTH_GATEWAY</h1>
        <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest">Identify Yourself</p>
      </div>

      <form className="flex-1 flex flex-col w-full justify-center gap-6" action={login}>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="agent@bytebrigade.com" required />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <Input type="password" name="password" placeholder="••••••••" required />
        </div>
        
        <Button variant="cyber" className="mt-4 w-full h-12">
          INITIALIZE_CONNECTION
        </Button>
        
        {searchParams?.message && (
          <p className="mt-4 p-4 bg-destructive/10 text-cyber-magenta text-center font-mono text-sm border border-cyber-magenta">
            {searchParams.message}
          </p>
        )}
      </form>
      
      <div className="text-center mt-8">
        <p className="text-sm text-muted-foreground font-mono">
          New operative?{" "}
          <Link href="/signup" className="text-cyber-cyan hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  )
}
