"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Target, Crosshair, Shield, Zap } from "lucide-react"
import type { Note, Stage } from "@/lib/types"

interface MobileFocusConfirmationProps {
  isOpen: boolean
  note: Note | null
  onConfirm: () => void
  onCancel: () => void
}

const STAGES: Record<Stage, { label: string; color: string; bgGradient: string }> = {
  planificacion: {
    label: "PLANIFICACIÓN",
    color: "text-blue-400",
    bgGradient: "from-blue-500/20 via-black to-black",
  },
  diseno: {
    label: "DISEÑO",
    color: "text-purple-400",
    bgGradient: "from-purple-500/20 via-black to-black",
  },
  ejecucion: {
    label: "EJECUCIÓN",
    color: "text-green-400",
    bgGradient: "from-green-500/20 via-black to-black",
  },
  monitoreo: {
    label: "MONITOREO",
    color: "text-yellow-400",
    bgGradient: "from-yellow-500/20 via-black to-black",
  },
  ajuste: {
    label: "AJUSTE",
    color: "text-orange-400",
    bgGradient: "from-orange-500/20 via-black to-black",
  },
  cierre: {
    label: "CIERRE",
    color: "text-red-400",
    bgGradient: "from-red-500/20 via-black to-black",
  },
}

export function MobileFocusConfirmation({ isOpen, note, onConfirm, onCancel }: MobileFocusConfirmationProps) {
  const [animationPhase, setAnimationPhase] = useState(0)

  useEffect(() => {
    if (isOpen) {
      setAnimationPhase(0)
      const t1 = setTimeout(() => setAnimationPhase(1), 100)
      const t2 = setTimeout(() => setAnimationPhase(2), 400)
      const t3 = setTimeout(() => setAnimationPhase(3), 700)
      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
        clearTimeout(t3)
      }
    }
  }, [isOpen])

  if (!isOpen || !note) return null

  const stageInfo = STAGES[note.stage]

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-b transition-opacity duration-300",
        stageInfo.bgGradient,
        animationPhase >= 1 ? "opacity-100" : "opacity-0",
      )}
    >
      {/* Grid tactical background */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Scan lines effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className={cn(
            "absolute w-full h-1 bg-gradient-to-r from-transparent via-electric-blue/30 to-transparent transition-transform duration-1000",
            animationPhase >= 2 ? "translate-y-[100vh]" : "-translate-y-10",
          )}
          style={{ top: 0 }}
        />
      </div>

      {/* Corner brackets - tactical design */}
      <div className="absolute top-8 left-8 w-12 h-12 border-l-2 border-t-2 border-electric-blue/50" />
      <div className="absolute top-8 right-8 w-12 h-12 border-r-2 border-t-2 border-electric-blue/50" />
      <div className="absolute bottom-8 left-8 w-12 h-12 border-l-2 border-b-2 border-electric-blue/50" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-r-2 border-b-2 border-electric-blue/50" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        {/* Icon with pulse */}
        <div
          className={cn(
            "relative mb-6 transition-all duration-500",
            animationPhase >= 2 ? "scale-100 opacity-100" : "scale-50 opacity-0",
          )}
        >
          <div className="absolute inset-0 w-24 h-24 rounded-full bg-electric-blue/20 animate-ping" />
          <div className="relative w-24 h-24 rounded-full border-2 border-electric-blue/50 flex items-center justify-center bg-black/50 backdrop-blur">
            <Crosshair size={40} className="text-electric-blue" />
          </div>
        </div>

        {/* Status text */}
        <div
          className={cn(
            "mb-4 transition-all duration-500 delay-200",
            animationPhase >= 2 ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
          )}
        >
          <div className="flex items-center gap-2 justify-center mb-2">
            <Shield size={14} className="text-electric-blue/70" />
            <span className="text-[10px] tracking-[0.3em] text-electric-blue/70">SISTEMA ACTIVADO</span>
          </div>
          <h2 className="text-2xl font-light tracking-[0.2em] text-white mb-2">INICIANDO SESIÓN</h2>
          <h3 className="text-xl font-light tracking-[0.15em] text-white/70">DE ENFOQUE EN</h3>
        </div>

        {/* Stage name - highlighted */}
        <div
          className={cn(
            "mb-8 transition-all duration-500 delay-300",
            animationPhase >= 3 ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
          )}
        >
          <span
            className={cn(
              "text-3xl font-bold tracking-[0.25em]",
              stageInfo.color,
            )}
          >
            {stageInfo.label}
          </span>
        </div>

        {/* Note title */}
        <div
          className={cn(
            "mb-8 px-6 py-4 rounded-lg border border-white/10 bg-white/5 max-w-sm transition-all duration-500 delay-400",
            animationPhase >= 3 ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
          )}
        >
          <div className="flex items-center gap-2 mb-2">
            <Target size={14} className="text-electric-blue" />
            <span className="text-[10px] tracking-[0.15em] text-white/50">OBJETIVO</span>
          </div>
          <p className="text-sm text-white line-clamp-2">{note.title}</p>
        </div>

        {/* Action buttons */}
        <div
          className={cn(
            "flex flex-col gap-3 w-full max-w-xs transition-all duration-500 delay-500",
            animationPhase >= 3 ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
          )}
        >
          <button
            onClick={onConfirm}
            className="w-full py-4 rounded-lg bg-electric-blue text-black font-medium text-sm tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <Zap size={18} />
            CONFIRMAR ENFOQUE
          </button>
          <button
            onClick={onCancel}
            className="w-full py-3 rounded-lg border border-white/20 text-white/60 text-xs tracking-wider active:scale-95 transition-transform"
          >
            CANCELAR
          </button>
        </div>
      </div>

      {/* Bottom tactical info */}
      <div className="absolute bottom-20 left-0 right-0 flex justify-center">
        <div
          className={cn(
            "flex items-center gap-4 text-[10px] text-white/30 transition-all duration-500 delay-600",
            animationPhase >= 3 ? "opacity-100" : "opacity-0",
          )}
        >
          <span>S{note.week || "?"}</span>
          <span className="w-1 h-1 rounded-full bg-white/30" />
          <span>PROJECT LAB</span>
          <span className="w-1 h-1 rounded-full bg-white/30" />
          <span>v1.0</span>
        </div>
      </div>
    </div>
  )
}
