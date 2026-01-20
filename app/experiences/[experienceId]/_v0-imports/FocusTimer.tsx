"use client"

import { useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import type { Session, Stage } from "@/lib/types"

interface FocusTimerProps {
  onSessionComplete: (session: Session) => void
  currentWeek: number
  currentStage: Stage
}

export function FocusTimer({ onSessionComplete, currentWeek, currentStage }: FocusTimerProps) {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning])

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleStart = () => {
    if (!sessionId) {
      setSessionId(crypto.randomUUID())
    }
    setIsRunning(true)
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleFinish = useCallback(() => {
    if (time > 0 && sessionId) {
      const session: Session = {
        id: sessionId,
        week: currentWeek,
        stage: currentStage,
        duration: time,
        startedAt: new Date(Date.now() - time * 1000).toISOString(),
        endedAt: new Date().toISOString(),
      }
      onSessionComplete(session)
      setTime(0)
      setIsRunning(false)
      setSessionId(null)
    }
  }, [time, sessionId, currentWeek, currentStage, onSessionComplete])

  return (
    <div className="relative flex flex-col items-center gap-6 md:gap-8 w-full max-w-xs md:max-w-none">
      {/* Círculo del cronómetro - smaller on mobile */}
      <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80">
        {/* Efecto glow */}
        <div
          className={cn(
            "absolute inset-0 rounded-full transition-all duration-500",
            isRunning
              ? "bg-electric-blue/10 shadow-[0_0_40px_rgba(59,130,246,0.3)] md:shadow-[0_0_60px_rgba(59,130,246,0.3)]"
              : "bg-transparent",
          )}
        />

        {/* Borde del círculo */}
        <div className="absolute inset-0 rounded-full border border-white/20" />

        {/* Progreso animado */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="48%"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className={cn("transition-all duration-300", isRunning ? "text-electric-blue/50" : "text-white/10")}
            strokeDasharray={`${(time % 60) * 6} 360`}
          />
        </svg>

        {/* Contenido central */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[10px] sm:text-xs tracking-[0.3em] text-white/50 mb-2">FOCUS TIME</span>
          <span className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wider text-white">
            {formatTime(time)}
          </span>

          {/* Botón de acción */}
          <button
            onClick={isRunning ? handlePause : handleStart}
            className="mt-4 md:mt-6 text-[10px] sm:text-xs tracking-[0.2em] text-white/70 hover:text-electric-blue transition-colors"
          >
            {isRunning ? "PAUSAR" : time > 0 ? "CONTINUAR" : "INICIAR ENFOQUE"}
          </button>
        </div>
      </div>

      {/* Botón finalizar */}
      {time > 0 && (
        <button
          onClick={handleFinish}
          className="px-4 sm:px-6 py-2 text-[10px] sm:text-xs tracking-[0.15em] border border-electric-blue/30 rounded text-electric-blue hover:bg-electric-blue/10 transition-all"
        >
          FINALIZAR SESIÓN
        </button>
      )}
    </div>
  )
}
