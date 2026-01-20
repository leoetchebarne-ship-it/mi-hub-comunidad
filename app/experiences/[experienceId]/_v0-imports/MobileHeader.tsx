"use client"

import { Calendar, Layers, MoreVertical } from "lucide-react"
import type { Stage } from "@/lib/types"

interface MobileHeaderProps {
  selectedWeek: number
  currentStage: Stage
  onOpenTimeline: () => void
  onOpenStages: () => void
  onOpenDrawer: () => void
}

const stageLabels: Record<Stage, string> = {
  planificacion: "Planificación",
  diseno: "Diseño",
  ejecucion: "Ejecución",
  monitoreo: "Monitoreo",
  ajuste: "Ajuste",
  cierre: "Cierre",
}

export function MobileHeader({
  selectedWeek,
  currentStage,
  onOpenTimeline,
  onOpenStages,
  onOpenDrawer,
}: MobileHeaderProps) {
  return (
    <header className="flex md:hidden items-center justify-between px-4 py-3 border-b border-white/5">
      {/* Logo y título */}
      <div>
        <h1 className="text-xs font-medium tracking-[0.25em] text-white">PROJECT LAB</h1>
        <p className="text-[10px] tracking-[0.15em] text-amber-500/80">OPERACIONES ESPECIALES</p>
      </div>

      {/* Quick access buttons */}
      <div className="flex items-center gap-1">
        {/* Timeline button */}
        <button
          onClick={onOpenTimeline}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 transition-colors"
        >
          <Calendar size={14} />
          <span className="text-[10px] tracking-wider">S{selectedWeek}</span>
        </button>

        {/* Stages button */}
        <button
          onClick={onOpenStages}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 transition-colors"
        >
          <Layers size={14} />
          <span className="text-[10px] tracking-wider truncate max-w-[60px]">
            {stageLabels[currentStage].slice(0, 6)}
          </span>
        </button>

        {/* Menu button */}
        <button
          onClick={onOpenDrawer}
          className="p-1.5 rounded-md text-white/40 hover:text-white hover:bg-white/5 transition-colors"
        >
          <MoreVertical size={18} />
        </button>
      </div>
    </header>
  )
}
