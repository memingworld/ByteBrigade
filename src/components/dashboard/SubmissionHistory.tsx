"use client"

import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

export default function SubmissionHistory({ submissions }: { submissions: any[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left font-mono text-matrix-green">
        <thead className="text-xs text-matrix-green uppercase bg-matrix-green/10 border-b border-matrix-green">
          <tr>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Payload</th>
            <th className="px-4 py-3">PTS</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {submissions.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center text-matrix-green/50">NO TRANSMISSIONS LOGGED.</td>
            </tr>
          ) : (
            submissions.map((sub) => (
              <tr key={sub.id} className="border-b border-matrix-green/30 hover:bg-matrix-green/10 transition-colors">
                <td className="px-4 py-3">{format(new Date(sub.occurred_on), "yyyy-MM-dd")}</td>
                <td className="px-4 py-3">
                  <p className="font-bold">{sub.title}</p>
                  <p className="text-xs text-matrix-green/70">{sub.activity_catalog?.label}</p>
                </td>
                <td className="px-4 py-3 font-bold">
                  {sub.status === "verified" ? (
                    <span className="text-matrix-green">+{sub.net_points}</span>
                  ) : sub.status === "rejected" ? (
                    <span className="text-red-500">-</span>
                  ) : (
                    <span className="text-matrix-green/50">PENDING</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={sub.status} className="rounded-none border border-matrix-green bg-transparent text-matrix-green hover:bg-matrix-green hover:text-matrix-dark uppercase tracking-widest text-[10px]">
                    {sub.status}
                  </Badge>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
