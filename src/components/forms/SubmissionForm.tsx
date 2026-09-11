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

  const [fileName, setFileName] = useState("")

  async function clientSubmit(formData: FormData) {
    setLoading(true)
    setMessage("")
    const res = await submitActivity(formData)
    if (res?.error) {
      setMessage(res.error)
    } else {
      setMessage("UPLINK_SUCCESS: Activity logged.")
      setFileName("")
    }
    setLoading(false)
  }

  return (
    <form action={clientSubmit} className="space-y-6 font-mono">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="activityId" className="text-matrix-green">&gt; select_payload_type</Label>
          <select name="activityId" required className="flex h-10 w-full rounded-none border border-matrix-green/50 bg-matrix-dark px-3 py-2 text-sm text-matrix-green focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-matrix-green appearance-none">
            <option value="">-- AWAITING INPUT --</option>
            {catalog.map(c => (
              <option key={c.id} value={c.id}>{c.label} ({c.points} PTS)</option>
            ))}
          </select>
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
        <Label htmlFor="proofFile" className="text-matrix-green">&gt; attach_evidence_file</Label>
        <div className={`border border-dashed transition-colors p-8 text-center relative cursor-pointer group ${fileName ? 'border-matrix-green bg-matrix-green/20' : 'border-matrix-green/50 bg-matrix-green/5 hover:bg-matrix-green/10'}`}>
          <Input 
            type="file" 
            name="proofFile" 
            accept="image/*,application/pdf,.txt,.zip"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                if (file.size > 5 * 1024 * 1024) {
                  setMessage("FILE_TOO_LARGE: Max evidence size is 5MB")
                  e.target.value = ""
                  setFileName("")
                } else {
                  setFileName(file.name)
                  setMessage("")
                }
              } else {
                setFileName("")
              }
            }}
          />
          <UploadCloud className="w-8 h-8 text-matrix-green mx-auto mb-2 group-hover:scale-110 transition-transform" />
          
          {fileName ? (
            <div>
              <p className="font-bold text-sm text-matrix-green tracking-widest">EVIDENCE_ACQUIRED</p>
              <p className="text-xs text-matrix-green mt-1">{fileName}</p>
            </div>
          ) : (
            <div>
              <p className="font-bold text-sm text-matrix-green tracking-widest">DRAG_AND_DROP_EVIDENCE</p>
              <p className="text-xs text-matrix-green/50 mt-1">or click to browse local filesystem</p>
            </div>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full h-12 bg-matrix-green text-matrix-dark font-bold hover:bg-white transition-colors tracking-widest rounded-none uppercase" disabled={loading}>
        {loading ? "TRANSMITTING_PAYLOAD..." : "EXECUTE_INJECTION"}
      </Button>

      {message && (
        <p className={`p-4 text-center font-bold text-sm border ${message.includes("SUCCESS") ? "bg-matrix-green/10 text-matrix-green border-matrix-green" : "bg-red-900/20 text-red-500 border-red-500"}`}>
          {message}
        </p>
      )}
    </form>
  )
}
