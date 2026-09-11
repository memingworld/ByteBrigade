"use client"

import { motion } from "framer-motion"

export default function HeroSection({ teamScore }: { teamScore: number }) {
  return (
    <div className="relative py-12 px-6 border-b border-border bg-background/50 overflow-hidden">
      <div className="absolute inset-0 bg-cyber-cyan/5 pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6"
      >
        <div>
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground font-mono uppercase tracking-widest text-sm mb-2"
          >
            System Status: Online
          </motion.h2>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-magenta font-mono tracking-tighter glitch-hover"
          >
            BYTE_BRIGADE
          </motion.h1>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-background/80 border border-cyber-cyan p-6 shadow-[0_0_15px_rgba(0,243,255,0.2)] backdrop-blur neon-border flex flex-col items-end"
        >
          <span className="text-muted-foreground font-mono uppercase tracking-widest text-xs mb-1">Total Network Power</span>
          <span className="text-4xl font-bold text-cyber-cyan font-mono drop-shadow-[0_0_5px_#00f3ff]">{teamScore.toLocaleString()} PTS</span>
        </motion.div>
      </motion.div>
    </div>
  )
}
