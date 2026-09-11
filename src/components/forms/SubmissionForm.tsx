"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { submitActivity } from "@/lib/actions/submissions"
import { UploadCloud } from "lucide-react"

export default function SubmissionForm({ catalog }: { catalog: any[] }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  async function clientSubmit(formData: FormData) {
    setLoading(true)
    setMessage("")
    const res = await submitActivity(formData)
    if (res?.error) {
      setMessage(res.error)
    } else {
      setMessage("UPLINK_SUCCESS: Activity logged.")
    }
    setLoading(false)
  }

  return (
    <form action={clientSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="activityId">Activity Type</Label>
          <select name="activityId" required className="flex h-10 w-full rounded-none border border-input bg-background/50 px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-cyan font-mono">
            <option value="">Select Activity...</option>
            {catalog.map(c => (
              <option key={c.id} value={c.id}>{c.label} ({c.points} PTS)</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="occurredOn">Date Occurred</Label>
          <Input type="date" name="occurredOn" required />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="title">Title / Brief Description</Label>
        <Input name="title" required placeholder="e.g. Merged PR to next.js" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="details">Extended Details</Label>
        <textarea name="details" className="flex w-full rounded-none border border-input bg-background/50 px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-cyan font-mono min-h-[100px]" placeholder="Add context for verification..." />
      </div>

      <div className="space-y-2">
        <Label htmlFor="externalUrl">External URL (PR, Tweet, etc.)</Label>
        <Input type="url" name="externalUrl" placeholder="https://..." />
      </div>

      <div className="space-y-2">
        <Label htmlFor="proofFile">Proof Upload</Label>
        <div className="border-2 border-dashed border-cyber-cyan/50 bg-cyber-cyan/5 hover:bg-cyber-cyan/10 transition-colors p-8 text-center relative cursor-pointer group">
          <Input type="file" name="proofFile" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
          <UploadCloud className="w-8 h-8 text-cyber-cyan mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <p className="font-mono text-sm text-cyber-cyan">DRAG_AND_DROP_FILE_HERE</p>
          <p className="font-mono text-xs text-muted-foreground mt-1">or click to browse</p>
        </div>
      </div>

      <Button type="submit" variant="cyber" className="w-full h-12" disabled={loading}>
        {loading ? "TRANSMITTING..." : "INITIATE_UPLINK"}
      </Button>

      {message && (
        <p className={`p-4 text-center font-mono text-sm border ${message.includes("SUCCESS") ? "bg-green-500/10 text-green-500 border-green-500" : "bg-destructive/10 text-cyber-magenta border-cyber-magenta"}`}>
          {message}
        </p>
      )}
    </form>
  )
}
