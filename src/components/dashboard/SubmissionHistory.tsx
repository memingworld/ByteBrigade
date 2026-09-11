"use client"

import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

export default function SubmissionHistory({ submissions }: { submissions: any[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs font-mono text-cyber-cyan uppercase bg-cyber-cyan/10 border-b border-cyber-cyan">
          <tr>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Activity</th>
            <th className="px-4 py-3">Points</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {submissions.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground font-mono">No transmissions logged.</td>
            </tr>
          ) : (
            submissions.map((sub) => (
              <tr key={sub.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                <td className="px-4 py-3 font-mono">{format(new Date(sub.occurred_on), "yyyy-MM-dd")}</td>
                <td className="px-4 py-3">
                  <p className="font-medium">{sub.title}</p>
                  <p className="text-xs text-muted-foreground">{sub.activity_catalog?.label}</p>
                </td>
                <td className="px-4 py-3 font-mono font-bold">
                  {sub.status === "verified" ? (
                    <span className="text-green-500">{sub.net_points}</span>
                  ) : sub.status === "rejected" ? (
                    <span className="text-red-500 line-through">0</span>
                  ) : (
                    <span className="text-yellow-500">?</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={sub.status}>{sub.status}</Badge>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
