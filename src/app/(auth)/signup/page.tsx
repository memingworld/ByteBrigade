import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signup } from "@/lib/actions/auth"

export default function Signup({ searchParams }: { searchParams: { message: string } }) {
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto min-h-[calc(100vh-3.5rem)] py-10">
      <div className="flex flex-col mb-8 text-center">
        <h1 className="text-4xl font-bold font-mono text-cyber-cyan tracking-wider glitch-hover mb-2">NEW_OPERATIVE</h1>
        <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest">Enrollment Protocol</p>
      </div>

      <form className="flex-1 flex flex-col w-full justify-center gap-6" action={signup}>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="agent@bytebrigade.com" required />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <Input type="password" name="password" placeholder="••••••••" required />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input name="fullName" placeholder="Motoko Kusanagi" required />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="department">Department</Label>
          <select name="department" className="flex h-10 w-full rounded-none border border-input bg-background/50 px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-cyan font-mono" required>
            <option value="">Select Dept</option>
            <option value="Engineering">Engineering</option>
            <option value="Design">Design</option>
            <option value="Product">Product</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="sprintTrack">Sprint Track</Label>
          <select name="sprintTrack" className="flex h-10 w-full rounded-none border border-input bg-background/50 px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-cyan font-mono" required>
            <option value="">Select Track</option>
            <option value="Code">Code</option>
            <option value="Open Source">Open Source</option>
            <option value="Build">Build</option>
            <option value="Pitch">Pitch</option>
          </select>
        </div>
        
        <Button variant="cyber" className="mt-4 w-full h-12">
          EXECUTE_REGISTRATION
        </Button>
        
        {searchParams?.message && (
          <p className="mt-4 p-4 bg-destructive/10 text-cyber-magenta text-center font-mono text-sm border border-cyber-magenta">
            {searchParams.message}
          </p>
        )}
      </form>
      
      <div className="text-center mt-8">
        <p className="text-sm text-muted-foreground font-mono">
          Already enrolled?{" "}
          <Link href="/login" className="text-cyber-cyan hover:underline">
            Authenticate
          </Link>
        </p>
      </div>
    </div>
  )
}
