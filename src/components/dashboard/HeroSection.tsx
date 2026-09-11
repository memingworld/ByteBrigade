"use client"

import { motion } from "framer-motion"

export default function HeroSection({ teamScore }: { teamScore: number }) {
  return (
    <div className="relative py-12 px-6 border-b border-matrix-green/30 bg-matrix-dark overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 font-mono"
      >
        <div>
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-matrix-green/70 uppercase tracking-widest text-sm mb-2"
          >
            &gt; SYSTEM_STATUS: ONLINE_AND_SECURE
          </motion.h2>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold text-matrix-green tracking-tighter glitch-hover drop-shadow-[0_0_8px_rgba(0,255,65,0.8)]"
          >
            BYTE_BRIGADE
          </motion.h1>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-matrix-dark/80 p-6 terminal-border flex flex-col items-end"
        >
          <span className="text-matrix-green/70 uppercase tracking-widest text-xs mb-1">
            [ TOTAL_NETWORK_POWER ]
          </span>
          <span className="text-4xl font-bold text-matrix-green drop-shadow-[0_0_5px_#00ff41]">
            {teamScore.toLocaleString()} PTS
          </span>
        </motion.div>
      </motion.div>
    </div>
  )
}
