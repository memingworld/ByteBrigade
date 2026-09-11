"use client"

import { useState } from "react"
import { updateProfile } from "@/lib/actions/profile"
import { User, Shield } from "lucide-react"

export default function ProfileSettingsForm({ profile, userEmail }: { profile: any, userEmail: string }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null)

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    setMessage(null)
    
    const result = await updateProfile(formData)
    
    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: "SYSTEM_UPDATED: Profile configuration saved successfully." })
    }
    
    setLoading(false)
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-6 font-mono text-matrix-green">
      <div className="flex items-center gap-4 border-b border-matrix-green/30 pb-4 mb-4">
        <div className="h-16 w-16 bg-matrix-green/10 border border-matrix-green flex items-center justify-center">
          <User className="h-8 w-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold">{profile.full_name || "UNKNOWN_OPERATIVE"}</h2>
          <p className="text-matrix-green/60 text-sm">{userEmail}</p>
        </div>
      </div>

      {message && (
        <div className={`p-3 ${message.type === 'error' ? 'terminal-border-red bg-red-900/20 text-red-500' : 'terminal-border bg-matrix-green/10'}`}>
          {message.text}
        </div>
      )}

      <div>
        <label className="block mb-2 text-sm" htmlFor="fullName">
          &gt; config_name
        </label>
        <input
          className="w-full bg-matrix-dark border border-matrix-green/50 focus:border-matrix-green outline-none p-2"
          name="fullName"
          defaultValue={profile.full_name}
          required
        />
      </div>

      <div>
        <label className="block mb-2 text-sm" htmlFor="department">
          &gt; config_department
        </label>
        <select
          className="w-full bg-matrix-dark border border-matrix-green/50 focus:border-matrix-green outline-none p-2 appearance-none"
          name="department"
          defaultValue={profile.department}
          required
        >
          <option value="Technical">Technical</option>
          <option value="Event Management">Event Management</option>
          <option value="R&D">R&D</option>
          <option value="Social">Social</option>
          <option value="Design">Design</option>
          <option value="PR">PR</option>
        </select>
      </div>

      <div>
        <label className="block mb-2 text-sm" htmlFor="sprintTrack">
          &gt; config_sprint_track
        </label>
        <select
          className="w-full bg-matrix-dark border border-matrix-green/50 focus:border-matrix-green outline-none p-2 appearance-none"
          name="sprintTrack"
          defaultValue={profile.sprint_track || ""}
        >
          <option value="">-- UNASSIGNED --</option>
          <option value="code">CODE</option>
          <option value="open_source">OPEN SOURCE</option>
          <option value="build">BUILD</option>
          <option value="pitch">PITCH</option>
        </select>
      </div>

      <div className="pt-4 border-t border-matrix-green/30 mt-2">
        <div className="flex items-center gap-2 mb-4 text-matrix-green/80">
          <Shield className="w-4 h-4" />
          <span>SECURITY_OVERRIDE</span>
        </div>
        <label className="block mb-2 text-sm" htmlFor="password">
          &gt; update_password (leave blank to keep current)
        </label>
        <input
          className="w-full bg-matrix-dark border border-matrix-green/50 focus:border-matrix-green outline-none p-2"
          type="password"
          name="password"
          placeholder="[ HIDDEN ]"
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="bg-matrix-green text-matrix-dark font-bold py-3 px-4 mt-4 hover:bg-white transition-all tracking-widest disabled:opacity-50"
      >
        {loading ? "EXECUTING..." : "COMMIT_CHANGES"}
      </button>
    </form>
  )
}
