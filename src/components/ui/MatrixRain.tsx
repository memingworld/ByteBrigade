"use client"

import React, { useEffect, useRef } from "react"

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const katakana = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレゲゼデベペオォコソトノホモヨョロゴゾドボポヴッン"
    const latin = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const nums = "0123456789"
    
    // The user explicitly requested "no japanese font should be there"
    const alphabet = latin + nums + "$+-*/=%\"'#&_(),.;:?!\\|{}<>[]^~"

    const fontSize = 16
    const columns = canvas.width / fontSize

    const drops: number[] = []
    for (let x = 0; x < columns; x++) {
      drops[x] = 1
    }

    const draw = () => {
      ctx.fillStyle = "rgba(13, 2, 8, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = "#00ff41" // Matrix Green
      ctx.font = fontSize + "px monospace"

      for (let i = 0; i < drops.length; i++) {
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length))
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    const interval = setInterval(draw, 33)

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      clearInterval(interval)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[-1] pointer-events-none opacity-40"
    />
  )
}
