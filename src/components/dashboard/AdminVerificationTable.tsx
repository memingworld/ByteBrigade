"use client"
import React from "react"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { verifySubmission, rejectSubmission, applyPlagiarismPenalty } from "@/lib/actions/admin"
import { format } from "date-fns"
import { AlertTriangle } from "lucide-react"

export default function AdminVerificationTable({ submissions }: { submissions: any[] }) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs font-mono text-matrix-green uppercase bg-matrix-green/10 border-b border-matrix-green">
          <tr>
            <th className="px-4 py-3">Operative</th>
            <th className="px-4 py-3">Activity</th>
            <th className="px-4 py-3">Date Submitted</th>
            <th className="px-4 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {submissions.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center text-matrix-green/50 font-mono">NO PENDING TRANSMISSIONS.</td>
            </tr>
          ) : (
            submissions.map((sub) => (
              <React.Fragment key={sub.id}>
                <tr className="border-b border-matrix-green/30 hover:bg-matrix-green/10 transition-colors text-matrix-green">
                  <td className="px-4 py-3 font-medium uppercase">
                    {sub.profiles?.full_name}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-matrix-green">{sub.title}</p>
                    <p className="text-xs text-matrix-green/70">{sub.activity_catalog?.label}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-matrix-green/70">
                    {format(new Date(sub.submitted_at), "yyyy-MM-dd HH:mm")}
                  </td>
                  <td className="px-4 py-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setExpandedRow(expandedRow === sub.id ? null : sub.id)}
                    >
                      {expandedRow === sub.id ? "CLOSE" : "INSPECT"}
                    </Button>
                  </td>
                </tr>
                {expandedRow === sub.id && (
                  <tr className="bg-background/80 border-b border-border">
                    <td colSpan={4} className="px-6 py-4">
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-xs font-mono text-matrix-green uppercase mb-1">Details</h4>
                            <p className="text-sm bg-matrix-dark p-3 rounded-none border border-matrix-green/30 text-matrix-green/80">{sub.details || "No extended details provided."}</p>
                          </div>
                          {sub.external_url && (
                            <div>
                              <h4 className="text-xs font-mono text-matrix-green uppercase mb-1">External Link</h4>
                              <a href={sub.external_url} target="_blank" rel="noreferrer" className="text-sm text-matrix-green hover:underline break-all">
                                {sub.external_url}
                              </a>
                            </div>
                          )}
                          <div>
                            <h4 className="text-xs font-mono text-matrix-green uppercase mb-1">Proof Files</h4>
                            {sub.submission_proofs && sub.submission_proofs.length > 0 ? (
                              <ul className="text-sm list-none space-y-2">
                                {sub.submission_proofs.map((proof: any) => {
                                  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/proofs/${proof.storage_path}`
                                  return (
                                    <li key={proof.id}>
                                      <a href={url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-matrix-green hover:text-white hover:underline bg-matrix-dark border border-matrix-green/30 p-2">
                                        <span className="font-mono text-xs uppercase">[VIEW_FILE]</span> {proof.file_name}
                                      </a>
                                    </li>
                                  )
                                })}
                              </ul>
                            ) : (
                              <p className="text-sm text-matrix-green/50 font-mono">NO EVIDENCE ATTACHED.</p>
                            )}
                          </div>
                        </div>

                        <div className="border border-matrix-green/50 p-4 bg-matrix-dark space-y-4">
                          <h4 className="font-mono text-matrix-green">[ DECISION_MATRIX ]</h4>
                          <form 
                            action={async (fd) => { 
                              const btn = document.getElementById(`btn-verify-${sub.id}`) as HTMLButtonElement
                              if (btn) btn.innerHTML = "VERIFYING..."
                              await verifySubmission(fd)
                              setExpandedRow(null)
                            }} 
                            className="space-y-2"
                          >
                            <input type="hidden" name="submissionId" value={sub.id} />
                            <div className="flex gap-2 items-center">
                              <Input name="awardedPoints" type="number" defaultValue={sub.activity_catalog?.points || 0} className="w-24 bg-matrix-dark border-matrix-green text-matrix-green" />
                              <span className="text-xs font-mono text-matrix-green/70">PTS TO AWARD</span>
                            </div>
                            <Input name="decisionNote" placeholder="Verification notes..." className="bg-matrix-dark border-matrix-green text-matrix-green placeholder:text-matrix-green/30" />
                            <Button id={`btn-verify-${sub.id}`} type="submit" variant="default" className="w-full h-8 text-xs bg-matrix-green hover:bg-white text-matrix-dark font-bold font-mono tracking-widest transition-all">
                              VERIFY_&_AWARD
                            </Button>
                          </form>

                          <div className="flex gap-2">
                            <form 
                              action={async (fd) => { 
                                const btn = document.getElementById(`btn-reject-${sub.id}`) as HTMLButtonElement
                                if (btn) btn.innerHTML = "REJECTING..."
                                await rejectSubmission(fd)
                                setExpandedRow(null)
                              }} 
                              className="flex-1"
                            >
                              <input type="hidden" name="submissionId" value={sub.id} />
                              <Button id={`btn-reject-${sub.id}`} type="submit" variant="outline" className="w-full h-8 text-xs text-red-500 border-red-500 hover:bg-red-500 hover:text-black font-mono tracking-widest transition-all">
                                REJECT
                              </Button>
                            </form>
                            <form 
                              action={async (fd) => { 
                                const btn = document.getElementById(`btn-penalize-${sub.id}`) as HTMLButtonElement
                                if (btn) btn.innerHTML = "PENALIZING..."
                                await applyPlagiarismPenalty(fd)
                                setExpandedRow(null)
                              }} 
                              className="flex-1"
                            >
                              <input type="hidden" name="submissionId" value={sub.id} />
                              <input type="hidden" name="basePoints" value={sub.activity_catalog?.points || 0} />
                              <Button id={`btn-penalize-${sub.id}`} type="submit" variant="destructive" className="w-full h-8 text-xs flex items-center justify-center gap-1 font-mono tracking-widest bg-red-900 border border-red-500 text-red-500 hover:bg-red-500 hover:text-black transition-all">
                                <AlertTriangle className="w-3 h-3" />
                                PENALIZE (90%)
                              </Button>
                            </form>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
