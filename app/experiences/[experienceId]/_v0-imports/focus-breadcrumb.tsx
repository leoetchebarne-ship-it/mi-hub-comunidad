"use client"

import { ChevronRight, Calendar, Layers, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Stage, Note, Project } from "@/lib/types"

interface FocusBreadcrumbProps {
  project: Project | null
  selectedWeek: number
  currentStage: Stage
  activeNote: Note | null
  onWeekClick?: () => void
  onStageClick?: () => void
  onNoteClick?: () => void
}

const STAGES: Record<Stage, { label: string; color: string }> = {
  planificacion: { label: "Planificación", color: "text-blue-400" },
  diseno: { label: "Diseño", color: "text-purple-400" },
  ejecucion: { label: "Ejecución", color: "text-green-400" },
  monitoreo: { label: "Monitoreo", color: "text-yellow-400" },
  ajuste: { label: "Ajuste", color: "text-orange-400" },
  cierre: { label: "Cierre", color: "text-red-400" },
}

export function FocusBreadcrumb({
  project,
  selectedWeek,
  currentStage,
  activeNote,
  onWeekClick,
  onStageClick,
  onNoteClick,
}: FocusBreadcrumbProps) {
  const stageInfo = STAGES[currentStage]

  return (
    <div className="flex items-center gap-1 px-4 py-2 bg-white/5 border-b border-white/10 overflow-x-auto">
      {/* Project name */}
      {project && (
        <>
          <span className="text-[10px] text-electric-blue/70 truncate max-w-24 shrink-0">
            {project.name}
          </span>
          <ChevronRight size={12} className="text-white/20 shrink-0" />
        </>
      )}

      {/* Week indicator */}
      <button
        onClick={onWeekClick}
        className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/5 transition-colors shrink-0"
      >
        <Calendar size={12} className="text-white/40" />
        <span className="text-[10px] text-white/60">Semana {selectedWeek}</span>
      </button>

      <ChevronRight size={12} className="text-white/20 shrink-0" />

      {/* Stage indicator */}
      <button
        onClick={onStageClick}
        className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/5 transition-colors shrink-0"
      >
        <Layers size={12} className={stageInfo.color} />
        <span className={cn("text-[10px]", stageInfo.color)}>{stageInfo.label}</span>
      </button>

      {/* Active note */}
      {activeNote && (
        <>
          <ChevronRight size={12} className="text-white/20 shrink-0" />
          <button
            onClick={onNoteClick}
            className="flex items-center gap-1.5 px-2 py-1 rounded bg-electric-blue/10 border border-electric-blue/30 transition-colors shrink-0 max-w-40"
          >
            <FileText size={12} className="text-electric-blue shrink-0" />
            <span className="text-[10px] text-electric-blue truncate">{activeNote.title}</span>
          </button>
        </>
      )}

      {/* Progress indicator */}
      <div className="ml-auto flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-all",
                i + 1 < selectedWeek
                  ? "bg-green-500"
                  : i + 1 === selectedWeek
                    ? "bg-electric-blue"
                    : "bg-white/10",
              )}
            />
          ))}
        </div>
        <span className="text-[9px] text-white/30">{Math.round((selectedWeek / 12) * 100)}%</span>
      </div>
    </div>
  )
}
