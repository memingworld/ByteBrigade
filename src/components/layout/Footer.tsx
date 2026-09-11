import React from 'react'

export default function Footer() {
  return (
    <footer className="border-t border-matrix-green/30 mt-auto py-6 flex flex-col items-center justify-center text-xs font-mono text-matrix-green/60 bg-matrix-dark">
      <p>© {new Date().getFullYear()} Byte Brigade. All rights reserved.</p>
      <p className="mt-1">
        Contact:{" "}
        <a 
          href="mailto:byte-brigade@outlook.com" 
          className="hover:text-matrix-green hover:underline transition-colors"
        >
          byte-brigade@outlook.com
        </a>
      </p>
    </footer>
  )
}
