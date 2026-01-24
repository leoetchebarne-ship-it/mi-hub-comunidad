"use client"

import { useMemo, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Check, Flag, AlertTriangle, ChevronRight, Target } from "lucide-react"
import type { Note, Stage, ActionBlockType } from "@/lib/types"

interface NextStepsPanelProps {
  notes: Note[]
  currentStage: Stage
  activeNote: Note | null
  onNoteClick: (note: Note) => void
  onNoteDoubleClick: (note: Note) => void
  onViewAll: () => void
}

const STAGES: Record<Stage, { label: string; color: string }> = {
  planificacion: { label: "Planificación", color: "bg-blue-500" },
  diseno: { label: "Diseño", color: "bg-purple-500" },
  ejecucion: { label: "Ejecución", color: "bg-green-500" },
  monitoreo: { label: "Monitoreo", color: "bg-yellow-500" },
  ajuste: { label: "Ajuste", color: "bg-orange-500" },
  cierre: { label: "Cierre", color: "bg-red-500" },
}

const ACTION_BLOCK_ICONS: Record<ActionBlockType, typeof Check> = {
  task: Check,
  milestone: Flag,
  issue: AlertTriangle,
}

function calculateProgress(note: Note): { completed: number; total: number; percentage: number } {
  const tasks = note.actionBlocks.filter((b) => b.type === "task")
  const legacyTasks = note.checklist || []
  
  const totalTasks = tasks.length + legacyTasks.length
  if (totalTasks === 0) return { completed: 0, total: 0, percentage: 0 }
  
  const completedTasks = tasks.filter((t) => t.completed).length + legacyTasks.filter((t) => t.completed).length
  return {
    completed: completedTasks,
    total: totalTasks,
    percentage: Math.round((completedTasks / totalTasks) * 100),
  }
}

export function NextStepsPanel({
  notes,
  currentStage,
  activeNote,
  onNoteClick,
  onNoteDoubleClick,
  onViewAll,
}: NextStepsPanelProps) {
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const clickCountRef = useRef(0)

  // Handler para detectar doble clic
  const handleClick = useCallback(
    (note: Note) => {
      clickCountRef.current += 1

      if (clickCountRef.current === 1) {
        clickTimeoutRef.current = setTimeout(() => {
          // Single click
          if (clickCountRef.current === 1) {
            onNoteClick(note)
          }
          clickCountRef.current = 0
        }, 250)
      } else if (clickCountRef.current === 2) {
        // Double click
        if (clickTimeoutRef.current) {
          clearTimeout(clickTimeoutRef.current)
        }
        clickCountRef.current = 0
        onNoteDoubleClick(note)
      }
    },
    [onNoteClick, onNoteDoubleClick],
  )

  // Filtrar notas por etapa actual y ordenar por fecha
  const filteredNotes = useMemo(() => {
    return notes
      .filter((n) => n.stage === currentStage)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3)
  }, [notes, currentStage])

  const stageInfo = STAGES[currentStage]

  if (filteredNotes.length === 0) {
    return (
      <div className="w-full px-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={cn("w-2 h-2 rounded-full", stageInfo.color)} />
              <h3 className="text-[10px] tracking-[0.2em] text-white/50">PRÓXIMOS PASOS</h3>
            </div>
            <span className="text-[10px] text-white/30">{stageInfo.label}</span>
          </div>
          <button
            onClick={onViewAll}
            className="w-full py-4 border border-dashed border-white/20 rounded-lg text-[10px] tracking-wider text-white/40 hover:border-electric-blue/30 hover:text-electric-blue/70 transition-all"
          >
            + CREAR PRIMERA NOTA
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", stageInfo.color)} />
            <h3 className="text-[10px] tracking-[0.2em] text-white/50">PRÓXIMOS PASOS</h3>
            <span className="text-[9px] text-white/20">(doble clic para fijar)</span>
          </div>
          <button
            onClick={onViewAll}
            className="flex items-center gap-1 text-[10px] text-electric-blue/70 hover:text-electric-blue transition-colors"
          >
            VER TODO
            <ChevronRight size={12} />
          </button>
        </div>

        {/* Lista de notas */}
        <div className="space-y-2">
          {filteredNotes.map((note) => {
            const progress = calculateProgress(note)
            const isActive = activeNote?.id === note.id
            return (
              <button
                key={note.id}
                onClick={() => handleClick(note)}
                className={cn(
                  "w-full p-3 rounded-lg border transition-all text-left group relative",
                  isActive
                    ? "border-electric-blue bg-electric-blue/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                    : "border-white/10 bg-white/5 hover:border-electric-blue/30 hover:bg-electric-blue/5",
                )}
              >
                {/* Indicador de objetivo activo */}
                {isActive && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-electric-blue flex items-center justify-center">
                    <Target size={10} className="text-black" />
                  </div>
                )}

                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4
                    className={cn(
                      "text-xs transition-colors line-clamp-1",
                      isActive ? "text-electric-blue" : "text-white group-hover:text-electric-blue",
                    )}
                  >
                    {note.title}
                  </h4>
                  {note.week && <span className="text-[10px] text-white/30 shrink-0">S{note.week}</span>}
                </div>

                {/* Preview de bloques de acción */}
                {note.actionBlocks.length > 0 && (
                  <div className="flex items-center gap-2 mb-2">
                    {note.actionBlocks.slice(0, 2).map((block) => {
                      const Icon = ACTION_BLOCK_ICONS[block.type]
                      return (
                        <div
                          key={block.id}
                          className={cn(
                            "flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px]",
                            block.type === "task" && "bg-electric-blue/10 text-electric-blue/70",
                            block.type === "milestone" && "bg-green-500/10 text-green-400/70",
                            block.type === "issue" && "bg-orange-500/10 text-orange-400/70",
                            block.type === "task" && block.completed && "line-through opacity-50",
                          )}
                        >
                          <Icon size={10} />
                          <span className="truncate max-w-20">{block.content}</span>
                        </div>
                      )
                    })}
                    {note.actionBlocks.length > 2 && (
                      <span className="text-[9px] text-white/30">+{note.actionBlocks.length - 2}</span>
                    )}
                  </div>
                )}

                {/* Barra de progreso miniatura */}
                {progress.total > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          progress.percentage === 100 ? "bg-green-500" : "bg-electric-blue",
                        )}
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                    <span className="text-[9px] text-white/40">
                      {progress.completed}/{progress.total}
                    </span>
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Indicador de más notas */}
        {notes.filter((n) => n.stage === currentStage).length > 3 && (
          <button
            onClick={onViewAll}
            className="w-full mt-2 py-2 text-[10px] text-white/30 hover:text-electric-blue/70 transition-colors"
          >
            +{notes.filter((n) => n.stage === currentStage).length - 3} notas más en {stageInfo.label}
          </button>
        )}
      </div>
    </div>
  )
}
