"use client"

import { useMemo, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Check, Flag, AlertTriangle, Plus, Target } from "lucide-react"
import type { Note, Stage, ActionBlockType } from "@/lib/types"

interface MobileNotesListProps {
  notes: Note[]
  currentStage: Stage
  selectedWeek: number
  activeNote: Note | null
  onNoteClick: (note: Note) => void
  onNoteLongPress: (note: Note) => void
  onAddNote: () => void
}

const STAGES: Record<Stage, { label: string; color: string }> = {
  planificacion: { label: "Planificación", color: "bg-blue-500" },
  diseno: { label: "Diseño", color: "bg-purple-500" },
  ejecucion: { label: "Ejecución", color: "bg-green-500" },
  monitoreo: { label: "Monitoreo", color: "bg-yellow-500" },
  ajuste: { label: "Ajuste", color: "bg-orange-500" },
  cierre: { label: "Cierre", color: "bg-red-500" },
}

const ACTION_ICONS: Record<ActionBlockType, typeof Check> = {
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

export function MobileNotesList({
  notes,
  currentStage,
  selectedWeek,
  activeNote,
  onNoteClick,
  onNoteLongPress,
  onAddNote,
}: MobileNotesListProps) {
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null)
  const isLongPressRef = useRef(false)

  // Handlers para long press
  const handleTouchStart = useCallback(
    (note: Note) => {
      isLongPressRef.current = false
      longPressTimerRef.current = setTimeout(() => {
        isLongPressRef.current = true
        onNoteLongPress(note)
        // Vibración haptica si disponible
        if (navigator.vibrate) {
          navigator.vibrate(50)
        }
      }, 500)
    },
    [onNoteLongPress],
  )

  const handleTouchEnd = useCallback(
    (note: Note) => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current)
      }
      if (!isLongPressRef.current) {
        onNoteClick(note)
      }
    },
    [onNoteClick],
  )

  const handleTouchMove = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
    }
  }, [])

  // Filtrar notas por semana y etapa actual
  const filteredNotes = useMemo(() => {
    return notes
      .filter((n) => n.week === selectedWeek && n.stage === currentStage)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [notes, selectedWeek, currentStage])

  const stageInfo = STAGES[currentStage]

  return (
    <div className="w-full px-4 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sticky top-0 bg-black py-2 -mt-2 z-10">
        <div className="flex items-center gap-2">
          <div className={cn("w-2 h-2 rounded-full", stageInfo.color)} />
          <h3 className="text-[10px] tracking-[0.15em] text-white/50">
            NOTAS S{selectedWeek} - {stageInfo.label.toUpperCase()}
          </h3>
        </div>
        <span className="text-[10px] text-white/30">{filteredNotes.length} notas</span>
      </div>

      {/* Hint */}
      <div className="text-center mb-3">
        <span className="text-[9px] text-white/20">Mantén presionado para fijar al cronómetro</span>
      </div>

      {/* Lista de notas */}
      {filteredNotes.length === 0 ? (
        <button
          onClick={onAddNote}
          className="w-full py-6 border border-dashed border-white/20 rounded-lg flex flex-col items-center gap-2 text-white/40 hover:border-electric-blue/30 hover:text-electric-blue/70 transition-all"
        >
          <Plus size={20} />
          <span className="text-[10px] tracking-wider">CREAR NOTA PARA {stageInfo.label.toUpperCase()}</span>
        </button>
      ) : (
        <div className="space-y-2">
          {filteredNotes.map((note) => {
            const progress = calculateProgress(note)
            const issueCount = note.actionBlocks.filter((b) => b.type === "issue").length
            const milestoneCount = note.actionBlocks.filter((b) => b.type === "milestone").length
            const isActive = activeNote?.id === note.id

            return (
              <button
                key={note.id}
                onTouchStart={() => handleTouchStart(note)}
                onTouchEnd={() => handleTouchEnd(note)}
                onTouchMove={handleTouchMove}
                onClick={() => onNoteClick(note)}
                className={cn(
                  "w-full p-4 rounded-lg border transition-all text-left relative",
                  isActive
                    ? "border-electric-blue bg-electric-blue/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                    : "border-white/10 bg-white/5 active:border-electric-blue/30 active:bg-electric-blue/5",
                )}
              >
                {/* Indicador de objetivo activo */}
                {isActive && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-electric-blue flex items-center justify-center">
                    <Target size={12} className="text-black" />
                  </div>
                )}
                {/* Título y badges */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-sm text-white line-clamp-2 flex-1">{note.title}</h4>
                  <div className="flex items-center gap-1 shrink-0">
                    {issueCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 text-[9px]">
                        {issueCount} issue{issueCount > 1 ? "s" : ""}
                      </span>
                    )}
                    {milestoneCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded bg-green-500/20 text-green-400 text-[9px]">
                        {milestoneCount} hito{milestoneCount > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </div>

                {/* Preview de action blocks */}
                {note.actionBlocks.length > 0 && (
                  <div className="space-y-1 mb-3">
                    {note.actionBlocks.slice(0, 3).map((block) => {
                      const Icon = ACTION_ICONS[block.type]
                      return (
                        <div
                          key={block.id}
                          className={cn(
                            "flex items-center gap-2 text-xs",
                            block.type === "task" && block.completed && "line-through opacity-50",
                          )}
                        >
                          <Icon
                            size={12}
                            className={cn(
                              block.type === "task" && "text-electric-blue/70",
                              block.type === "milestone" && "text-green-400/70",
                              block.type === "issue" && "text-orange-400/70",
                            )}
                          />
                          <span className="text-white/60 truncate">{block.content}</span>
                        </div>
                      )
                    })}
                    {note.actionBlocks.length > 3 && (
                      <span className="text-[10px] text-white/30 pl-5">
                        +{note.actionBlocks.length - 3} más
                      </span>
                    )}
                  </div>
                )}

                {/* Barra de progreso */}
                {progress.total > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          progress.percentage === 100 ? "bg-green-500" : "bg-electric-blue",
                        )}
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-white/40 shrink-0">
                      {progress.completed}/{progress.total} tareas
                    </span>
                  </div>
                )}
              </button>
            )
          })}

          {/* Botón añadir nota */}
          <button
            onClick={onAddNote}
            className="w-full py-3 border border-dashed border-white/20 rounded-lg text-[10px] tracking-wider text-white/40 hover:border-electric-blue/30 hover:text-electric-blue/70 transition-all"
          >
            + NUEVA NOTA
          </button>
        </div>
      )}
    </div>
  )
}
