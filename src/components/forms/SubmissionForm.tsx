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
  const [selectedActivityId, setSelectedActivityId] = useState("")

  const [fileNames, setFileNames] = useState<string[]>([])
  
  const selectedActivity = catalog.find(c => c.id === selectedActivityId)

  async function clientSubmit(formData: FormData) {
    setLoading(true)
    setMessage("")
    const res = await submitActivity(formData)
    if (res?.error) {
      setMessage(res.error)
    } else {
      setMessage("UPLINK_SUCCESS: Activity logged.")
      setFileNames([])
    }
    setLoading(false)
  }

  return (
    <form action={clientSubmit} className="space-y-6 font-mono">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="activityId" className="text-matrix-green">&gt; select_payload_type</Label>
          <select 
            name="activityId" 
            required 
            onChange={(e) => setSelectedActivityId(e.target.value)}
            className="flex h-10 w-full rounded-none border border-matrix-green/50 bg-matrix-dark px-3 py-2 text-sm text-matrix-green focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-matrix-green appearance-none"
          >
            <option value="">-- AWAITING INPUT --</option>
            {Object.entries(
              catalog.reduce((acc, c) => {
                const cat = c.category ? c.category.replace('_', ' ') : "General";
                if (!acc[cat]) acc[cat] = [];
                acc[cat].push(c);
                return acc;
              }, {} as Record<string, any[]>)
            ).map(([category, items]) => (
              <optgroup key={category} label={`[ ${category.toUpperCase()} ]`} className="bg-matrix-dark text-matrix-green/70">
                {(items as any[]).map((c: any) => (
                  <option key={c.id} value={c.id} className="text-matrix-green">
                    {c.label}{c.level ? ` — ${c.level}` : ''} ({c.points} PTS)
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          {selectedActivity?.proof_hint && (
            <p className="text-xs text-matrix-green/60 mt-1 animate-pulse border-l-2 border-matrix-green/30 pl-2">
              <span className="font-bold text-matrix-green/80">HINT:</span> {selectedActivity.proof_hint}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="occurredOn" className="text-matrix-green">&gt; input_execution_date</Label>
          <div className="relative">
            <Input type="date" name="occurredOn" required className="w-full rounded-none border border-matrix-green/50 bg-matrix-dark px-3 py-2 text-sm text-matrix-green focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-matrix-green [color-scheme:dark]" />
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="title" className="text-matrix-green">&gt; input_title</Label>
        <Input name="title" required placeholder="e.g. Bypassed Mainframe Security" className="rounded-none border-matrix-green/50 bg-matrix-dark text-matrix-green focus-visible:ring-matrix-green placeholder:text-matrix-green/30" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="details" className="text-matrix-green">&gt; input_extended_logs</Label>
        <textarea name="details" className="flex w-full rounded-none border border-matrix-green/50 bg-matrix-dark px-3 py-2 text-sm text-matrix-green focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-matrix-green min-h-[100px] placeholder:text-matrix-green/30" placeholder="Attach detailed execution context..." />
      </div>

      <div className="space-y-2">
        <Label htmlFor="externalUrl" className="text-matrix-green">&gt; attach_external_link</Label>
        <Input type="url" name="externalUrl" placeholder="https://..." className="rounded-none border-matrix-green/50 bg-matrix-dark text-matrix-green focus-visible:ring-matrix-green placeholder:text-matrix-green/30" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="proofFiles" className="text-matrix-green">&gt; attach_evidence_files [1-3 required]</Label>
        <div className={`border border-dashed transition-colors p-8 text-center relative cursor-pointer group ${fileNames.length > 0 ? 'border-matrix-green bg-matrix-green/20' : 'border-matrix-green/50 bg-matrix-green/5 hover:bg-matrix-green/10'}`}>
          <Input 
            type="file" 
            name="proofFiles" 
            multiple
            required
            accept="image/jpeg,image/png,image/webp,application/pdf"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
            onChange={(e) => {
              const files = Array.from(e.target.files || [])
              if (files.length > 3) {
                setMessage("MAX_FILES_EXCEEDED: Maximum 3 evidence files allowed.")
                e.target.value = ""
                setFileNames([])
                return
              }
              const valid = files.every(f => f.size <= 10 * 1024 * 1024)
              if (!valid) {
                setMessage("FILE_TOO_LARGE: Max evidence size is 10MB per file")
                e.target.value = ""
                setFileNames([])
                return
              }
              setFileNames(files.map(f => f.name))
              setMessage("")
            }}
          />
          <UploadCloud className="w-8 h-8 text-matrix-green mx-auto mb-2 group-hover:scale-110 transition-transform" />
          
          {fileNames.length > 0 ? (
            <div>
              <p className="font-bold text-sm text-matrix-green tracking-widest">EVIDENCE_ACQUIRED ({fileNames.length}/3)</p>
              <div className="text-xs text-matrix-green mt-2 space-y-1">
                {fileNames.map((name, i) => (
                  <p key={i}>[{i + 1}] {name}</p>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <p className="font-bold text-sm text-matrix-green tracking-widest">DRAG_AND_DROP_EVIDENCE</p>
              <p className="text-xs text-matrix-green/50 mt-1">Select 1 to 3 files (local filesystem)</p>
            </div>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full h-12 bg-matrix-green text-matrix-dark font-bold hover:bg-white transition-colors tracking-widest rounded-none uppercase relative overflow-hidden" disabled={loading}>
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            UPLOADING TO DB [||||||||||||||||||]
            <span className="animate-pulse">_</span>
          </span>
        ) : (
          "EXECUTE_INJECTION"
        )}
      </Button>

      {message && (
        <p className={`p-4 text-center font-bold text-sm border ${message.includes("SUCCESS") ? "bg-matrix-green/10 text-matrix-green border-matrix-green" : "bg-red-900/20 text-red-500 border-red-500"}`}>
          {message}
        </p>
      )}
    </form>
  )
}
