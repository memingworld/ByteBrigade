"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

type MVP = {
  member_id: string;
  full_name: string;
  sprint_track: string;
  total_points: number;
}

export default function ScoreBoard({ mvps }: { mvps: MVP[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 mt-8 container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="h-full bg-background/60 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyber-magenta animate-pulse" />
              MVP_LEADERBOARD
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mvps.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground font-mono">No data available in network.</div>
              ) : (
                mvps.map((mvp, index) => (
                  <div key={mvp.member_id} className="flex items-center justify-between p-3 border border-border/50 bg-card/30 hover:border-cyber-cyan transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="text-cyber-cyan font-mono font-bold w-4">{index + 1}.</span>
                      <div>
                        <p className="font-medium text-foreground">{mvp.full_name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{mvp.sprint_track}</p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-cyber-magenta">{mvp.total_points} PTS</span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="h-full bg-background/60 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-cyber-cyan">SYSTEM_LOGS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-mono text-muted-foreground space-y-2">
              <p>{">"} INITIALIZING BYTE_BRIGADE PROTOCOL...</p>
              <p>{">"} CONNECTING TO MAIN MAINFRAME...</p>
              <p className="text-green-500">{">"} CONNECTION ESTABLISHED.</p>
              <p>{">"} AWAITING OPERATIVE SUBMISSIONS.</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
