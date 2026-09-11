"use client"

import { motion } from "framer-motion"
import { useState, useRef } from "react"

type MVP = {
  member_id: string;
  full_name: string;
  sprint_track: string;
  total_points: number;
}

export default function ScoreBoard({ mvps }: { mvps: MVP[] }) {
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    // Calculate rotation based on cursor position
    const rotateXValue = ((y - centerY) / centerY) * -10 // Max 10 deg
    const rotateYValue = ((x - centerX) / centerX) * 10

    setRotateX(rotateXValue)
    setRotateY(rotateYValue)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 mt-8 container font-mono perspective-1000">
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ rotateX, rotateY }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{ transformStyle: "preserve-3d" }}
        className="h-full relative"
      >
        <div className="h-full terminal-border bg-matrix-dark/90 backdrop-blur-md p-6 relative z-10" style={{ transform: "translateZ(30px)" }}>
          <h3 className="text-xl font-bold text-matrix-green flex items-center gap-2 mb-6 border-b border-matrix-green/30 pb-2">
            <span className="w-2 h-2 rounded-full bg-matrix-green animate-pulse" />
            [ MVP_LEADERBOARD ]
          </h3>
          
          <div className="space-y-2">
            {mvps.length === 0 ? (
              <div className="text-center py-8 text-matrix-green/50">NO_DATA_FOUND_IN_DATABANKS</div>
            ) : (
              mvps.map((mvp, index) => (
                <div key={mvp.member_id} className="flex items-center justify-between p-2 border border-matrix-green/20 bg-matrix-dark hover:bg-matrix-green/10 transition-colors cursor-default">
                  <div className="flex items-center gap-4">
                    <span className="text-matrix-green font-bold w-6">{(index + 1).toString().padStart(2, '0')}</span>
                    <div>
                      <p className="text-matrix-green uppercase">{mvp.full_name}</p>
                      <p className="text-xs text-matrix-green/60">{mvp.sprint_track}</p>
                    </div>
                  </div>
                  <span className="font-bold text-matrix-green">{mvp.total_points} PTS</span>
                </div>
              ))
            )}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="h-full terminal-border bg-matrix-dark/90 backdrop-blur-md p-6">
          <h3 className="text-xl font-bold text-matrix-green mb-6 border-b border-matrix-green/30 pb-2">
            [ SYSTEM_LOGS ]
          </h3>
          <div className="text-sm text-matrix-green/70 space-y-2">
            <p className="animate-pulse">{">"} INITIALIZING ROOT ACCESS...</p>
            <p>{">"} CONNECTING TO BYTE_BRIGADE_NETWORK...</p>
            <p className="text-matrix-green font-bold">{">"} HANDSHAKE SUCCESSFUL.</p>
            <p>{">"} FETCHING LATEST SUBMISSIONS...</p>
            <p>{">"} SYSTEM OPTIMAL. AWAITING INPUT.</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
