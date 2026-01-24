"use client"

import { useState, useEffect, useCallback } from "react"
import { Play, Pause, Square, Clock, Target, X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Note, Stage, Session } from "@/lib/types"

interface QuickActionButtonProps {
  lastActiveNote: Note | null
  currentWeek: number
  currentStage: Stage
  onSessionComplete: (session: Session) => void
  onSetActiveNote: (note: Note) => void
}

const STAGES: Record<Stage, string> = {
  planificacion: "bg-blue-500",
  diseno: "bg-purple-500",
  ejecucion: "bg-green-500",
  monitoreo: "bg-yellow-500",
  ajuste: "bg-orange-500",
  cierre: "bg-red-500",
}

export function QuickActionButton({
  lastActiveNote,
  currentWeek,
  currentStage,
  onSessionComplete,
  onSetActiveNote,
}: QuickActionButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [time, setTime] = useState(0)
  const [sessionId, setSessionId] = useState<string | null>(null)

  // Timer logic
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
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleStart = useCallback(() => {
    if (!sessionId) {
      setSessionId(crypto.randomUUID())
    }
    if (lastActiveNote) {
      onSetActiveNote(lastActiveNote)
    }
    setIsRunning(true)
    setIsExpanded(true)
  }, [sessionId, lastActiveNote, onSetActiveNote])

  const handlePause = useCallback(() => {
    setIsRunning(false)
  }, [])

  const handleStop = useCallback(() => {
    if (time > 0 && sessionId) {
      const session: Session = {
        id: sessionId,
        week: currentWeek,
        stage: lastActiveNote?.stage || currentStage,
        duration: time,
        startedAt: new Date(Date.now() - time * 1000).toISOString(),
        endedAt: new Date().toISOString(),
        noteId: lastActiveNote?.id,
      }
      onSessionComplete(session)
    }
    setTime(0)
    setIsRunning(false)
    setSessionId(null)
    setIsExpanded(false)
  }, [time, sessionId, currentWeek, currentStage, lastActiveNote, onSessionComplete])

  const handleClose = useCallback(() => {
    if (!isRunning && time === 0) {
      setIsExpanded(false)
    }
  }, [isRunning, time])

  // Si no hay nota activa reciente, mostrar versión mínima
  if (!lastActiveNote && !isExpanded) {
    return null
  }

  return (
    <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40">
      {/* Expanded state */}
      {isExpanded ? (
        <div className="bg-black/95 border border-white/20 rounded-xl p-4 shadow-[0_0_30px_rgba(0,0,0,0.5)] min-w-64">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-electric-blue" />
              <span className="text-[10px] tracking-wider text-white/50">SESIÓN RÁPIDA</span>
            </div>
            {!isRunning && time === 0 && (
              <button
                onClick={handleClose}
                className="p-1 text-white/30 hover:text-white/60 transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Note info */}
          {lastActiveNote && (
            <div className="flex items-center gap-2 mb-3 p-2 rounded bg-white/5 border border-white/10">
              <div className={cn("w-2 h-2 rounded-full", STAGES[lastActiveNote.stage])} />
              <span className="text-xs text-white truncate flex-1">{lastActiveNote.title}</span>
            </div>
          )}

          {/* Timer display */}
          <div className="text-center mb-4">
            <span
              className={cn(
                "text-3xl font-light tracking-wider",
                isRunning ? "text-electric-blue" : "text-white",
              )}
            >
              {formatTime(time)}
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
            {!isRunning ? (
              <button
                onClick={handleStart}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-electric-blue/20 text-electric-blue border border-electric-blue/30 hover:bg-electric-blue/30 transition-all"
              >
                <Play size={16} fill="currentColor" />
                <span className="text-xs">{time > 0 ? "Continuar" : "Iniciar"}</span>
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 transition-all"
              >
                <Pause size={16} />
                <span className="text-xs">Pausar</span>
              </button>
            )}

            {time > 0 && (
              <button
                onClick={handleStop}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 transition-all"
              >
                <Square size={14} fill="currentColor" />
                <span className="text-xs">Guardar</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Collapsed FAB */
        <button
          onClick={() => setIsExpanded(true)}
          className={cn(
            "group relative flex items-center gap-3 px-4 py-3 rounded-full transition-all",
            "bg-electric-blue/20 border border-electric-blue/40",
            "hover:bg-electric-blue/30 hover:border-electric-blue/60",
            "shadow-[0_0_20px_rgba(59,130,246,0.3)]",
          )}
        >
          {/* Pulse animation */}
          <div className="absolute inset-0 rounded-full bg-electric-blue/20 animate-ping opacity-30" />

          <Target size={18} className="text-electric-blue relative z-10" />

          <div className="relative z-10 text-left">
            <p className="text-[10px] text-electric-blue/70">Continuar con</p>
            <p className="text-xs text-electric-blue truncate max-w-32">
              {lastActiveNote?.title || "Última nota"}
            </p>
          </div>

          <Play
            size={16}
            className="text-electric-blue relative z-10 group-hover:scale-110 transition-transform"
            fill="currentColor"
          />
        </button>
      )}
    </div>
  )
}
