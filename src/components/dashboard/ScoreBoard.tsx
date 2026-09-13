"use client";

import { motion } from "framer-motion";
import { useState, useRef } from "react";

type MVP = {
  member_id: string;
  full_name: string;
  sprint_track: string;
  avatar_path: string | null;
  total_points: number;
};

export default function ScoreBoard({ mvps, recentActivity }: { mvps: MVP[], recentActivity: any[] }) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateXValue = ((y - centerY) / centerY) * -10;
    const rotateYValue = ((x - centerX) / centerX) * 10;

    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div className="grid gap-6 max-w-4xl mx-auto mt-8 container font-mono perspective-1000 items-start">
      {/* MVP LEADERBOARD STASHED: Uncomment below to restore MVP list 
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ rotateX, rotateY }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative"
      >
        <div className="terminal-border bg-matrix-dark/90 backdrop-blur-md p-6 relative z-10" style={{ transform: "translateZ(30px)" }}>
          <h3 className="text-lg md:text-xl font-bold text-matrix-green flex flex-wrap items-center gap-2 mb-6 border-b border-matrix-green/30 pb-2 uppercase">
            <span className="flex items-center gap-2 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-matrix-green animate-pulse" />
              [MVP_LEADERBOARD]
            </span>
          </h3>
          
          <div className="space-y-2">
            {mvps.length === 0 ? (
              <div className="text-center py-8 text-matrix-green/50">NO_DATA_FOUND_IN_DATABANKS</div>
            ) : (
              mvps.map((mvp, index) => (
                <div key={mvp.member_id} className="flex items-center justify-between p-2 border border-matrix-green/20 bg-matrix-dark hover:bg-matrix-green/10 transition-colors cursor-default">
                  <div className="flex items-center gap-4">
                    <span className="text-matrix-green font-bold w-6">{(index + 1).toString().padStart(2, "0")}</span>
                    {mvp.avatar_path ? (
                      <img 
                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${mvp.avatar_path}`} 
                        className="w-10 h-10 rounded-full object-cover border border-matrix-green/50" 
                        alt={mvp.full_name} 
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full border border-matrix-green/50 flex items-center justify-center bg-matrix-green/10 text-matrix-green font-bold text-sm">
                        {mvp.full_name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-matrix-green uppercase font-bold">{mvp.full_name}</p>
                      <p className="text-xs text-matrix-green/60">{mvp.sprint_track}</p>
                    </div>
                  </div>
                  <span className="font-bold text-matrix-green">{(mvp.total_points || 0).toLocaleString()} PTS</span>
                </div>
              ))
            )}
          </div>
        </div>
      </motion.div>
      */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col gap-6"
      >
        <div className="terminal-border bg-matrix-dark/90 backdrop-blur-md p-4 flex flex-col gap-1">
          <div className="text-xs text-matrix-green/70 space-y-1 overflow-hidden">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>&gt; INITIALIZING ROOT ACCESS...</motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>&gt; CONNECTING TO BYTE_BRIGADE_NETWORK...</motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="text-matrix-green font-bold">&gt; HANDSHAKE SUCCESSFUL.</motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>&gt; FETCHING LATEST SUBMISSIONS...</motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }} className="animate-pulse">&gt; SYSTEM OPTIMAL. AWAITING INPUT_</motion.p>
          </div>
        </div>

        <div className="terminal-border bg-matrix-dark/90 backdrop-blur-md p-4 md:p-6">
          <h3 className="text-lg md:text-xl font-bold text-matrix-green mb-6 border-b border-matrix-green/30 pb-2 uppercase flex flex-wrap gap-2 items-center justify-between">
            <span className="whitespace-nowrap">[LIVE_NETWORK_TRAFFIC]</span>
            <span className="text-xs text-matrix-green/50 animate-pulse font-normal whitespace-nowrap">REC/LIVE</span>
          </h3>
          
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {recentActivity.length === 0 ? (
              <div className="text-center py-8 text-matrix-green/50 text-sm">NO_RECENT_TRAFFIC_DETECTED</div>
            ) : (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex flex-col border-l-2 border-matrix-green/50 pl-3 py-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-matrix-green uppercase">
                      {activity.profiles?.full_name}
                    </span>
                    {/* INDIVIDUAL POINTS STASHED: Uncomment below to restore
                    <span className="text-xs text-matrix-green font-bold">
                      +{activity.net_points} PTS
                    </span>
                    */}
                  </div>
                  <span className="text-xs text-matrix-green/70 mt-1 uppercase">
                    EXECUTED: {activity.activity_catalog?.label}
                  </span>
                  <span className="text-[10px] text-matrix-green/40 mt-1">
                    {new Date(activity.submitted_at).toLocaleDateString()} {new Date(activity.submitted_at).toLocaleTimeString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
