import { Terminal } from "lucide-react"

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-matrix-dark text-matrix-green font-mono">
      <Terminal className="w-16 h-16 mb-4 animate-pulse" />
      <h2 className="text-2xl font-bold tracking-widest animate-pulse glitch-hover">
        [ ESTABLISHING_UPLINK ]
      </h2>
      <p className="mt-4 opacity-70 text-sm">Synchronizing with Byte Brigade Mainframe...</p>
      
      <div className="w-64 h-1 bg-matrix-green/20 mt-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 h-full bg-matrix-green animate-scan" style={{ width: '30%', animation: 'scan 1.5s linear infinite' }} />
      </div>
      
      <style>{`
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  )
}
