"use client"

import { useMemo } from "react"
import { X, Calendar, Target, AlertCircle, TrendingUp, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Note, Stage, Session } from "@/lib/types"

interface CommandCenterModalProps {
  isOpen: boolean
  onClose: () => void
  notes: Note[]
  sessions: Session[]
  selectedWeek: number
  currentStage: Stage
  onStartNewProject?: () => void
}

const STAGES: { key: Stage; label: string; color: string; order: number }[] = [
  { key: "planificacion", label: "Planificación", color: "bg-blue-500", order: 1 },
  { key: "diseno", label: "Diseño", color: "bg-purple-500", order: 2 },
  { key: "ejecucion", label: "Ejecución", color: "bg-green-500", order: 3 },
  { key: "monitoreo", label: "Monitoreo", color: "bg-yellow-500", order: 4 },
  { key: "ajuste", label: "Ajuste", color: "bg-orange-500", order: 5 },
  { key: "cierre", label: "Cierre", color: "bg-red-500", order: 6 },
]

const PROJECT_DURATION_WEEKS = 12

export function CommandCenterModal({
  isOpen,
  onClose,
  notes,
  sessions,
  selectedWeek,
  currentStage,
  onStartNewProject,
}: CommandCenterModalProps) {
  // Calcular días restantes (asumiendo 7 días por semana)
  const daysRemaining = useMemo(() => {
    const weeksRemaining = PROJECT_DURATION_WEEKS - selectedWeek
    return Math.max(0, weeksRemaining * 7)
  }, [selectedWeek])

  // Calcular progreso total basado en semanas
  const weekProgress = useMemo(() => {
    return Math.round((selectedWeek / PROJECT_DURATION_WEEKS) * 100)
  }, [selectedWeek])

  // Calcular progreso por etapas completadas
  const stageProgress = useMemo(() => {
    const currentStageOrder = STAGES.find((s) => s.key === currentStage)?.order || 1
    return Math.round((currentStageOrder / STAGES.length) * 100)
  }, [currentStage])

  // Progreso combinado
  const totalProgress = useMemo(() => {
    return Math.round((weekProgress + stageProgress) / 2)
  }, [weekProgress, stageProgress])

  // Tiempo total de enfoque
  const totalFocusTime = useMemo(() => {
    const totalSeconds = sessions.reduce((acc, s) => acc + s.duration, 0)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    return { hours, minutes, totalSeconds }
  }, [sessions])

  // Prioridades críticas (notas con issues o tareas pendientes)
  const criticalPriorities = useMemo(() => {
    return notes
      .filter((note) => {
        const hasIssues = note.actionBlocks.some((b) => b.type === "issue")
        const hasIncompleteTasks = note.actionBlocks.some((b) => b.type === "task" && !b.completed)
        return hasIssues || hasIncompleteTasks
      })
      .sort((a, b) => {
        // Priorizar las que tienen issues
        const aHasIssue = a.actionBlocks.some((b) => b.type === "issue")
        const bHasIssue = b.actionBlocks.some((b) => b.type === "issue")
        if (aHasIssue && !bHasIssue) return -1
        if (!aHasIssue && bHasIssue) return 1
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
      .slice(0, 5)
  }, [notes])

  // Stats por etapa
  const statsByStage = useMemo(() => {
    return STAGES.map((stage) => ({
      ...stage,
      noteCount: notes.filter((n) => n.stage === stage.key).length,
      sessionTime: sessions
        .filter((s) => s.stage === stage.key)
        .reduce((acc, s) => acc + s.duration, 0),
    }))
  }, [notes, sessions])

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/80 z-50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[85vh] bg-black border border-white/10 rounded-xl z-50 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/10">
          <div>
            <h2 className="text-sm md:text-base tracking-[0.2em] text-white">CENTRO DE MANDO</h2>
            <p className="text-[10px] md:text-xs text-electric-blue/70 mt-1">Estado del proyecto</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/40 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {/* KPIs principales */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {/* Días restantes */}
            <div className="p-4 rounded-lg border border-white/10 bg-white/5">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={14} className="text-electric-blue" />
                <span className="text-[10px] text-white/50 tracking-wider">DÍAS RESTANTES</span>
              </div>
              <p className="text-2xl md:text-3xl font-light text-white">{daysRemaining}</p>
              <p className="text-[10px] text-white/30 mt-1">Semana {selectedWeek} de {PROJECT_DURATION_WEEKS}</p>
            </div>

            {/* Progreso total */}
            <div className="p-4 rounded-lg border border-white/10 bg-white/5">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={14} className="text-green-400" />
                <span className="text-[10px] text-white/50 tracking-wider">PROGRESO</span>
              </div>
              <p className="text-2xl md:text-3xl font-light text-white">{totalProgress}%</p>
              <div className="h-1.5 rounded-full bg-white/10 mt-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-electric-blue to-green-400 transition-all"
                  style={{ width: `${totalProgress}%` }}
                />
              </div>
            </div>

            {/* Tiempo de enfoque */}
            <div className="p-4 rounded-lg border border-white/10 bg-white/5 col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={14} className="text-amber-400" />
                <span className="text-[10px] text-white/50 tracking-wider">TIEMPO ENFOCADO</span>
              </div>
              <p className="text-2xl md:text-3xl font-light text-white">
                {totalFocusTime.hours}h {totalFocusTime.minutes}m
              </p>
              <p className="text-[10px] text-white/30 mt-1">{sessions.length} sesiones completadas</p>
            </div>
          </div>

          {/* Distribución por etapas */}
          <div className="p-4 rounded-lg border border-white/10 bg-white/5">
            <div className="flex items-center gap-2 mb-4">
              <Target size={14} className="text-electric-blue" />
              <span className="text-[10px] text-white/50 tracking-wider">DISTRIBUCIÓN POR ETAPA</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {statsByStage.map((stage) => (
                <div
                  key={stage.key}
                  className={cn(
                    "p-2 rounded border border-white/10 transition-all",
                    currentStage === stage.key && "border-electric-blue/50 bg-electric-blue/10",
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={cn("w-2 h-2 rounded-full", stage.color)} />
                    <span className="text-[10px] text-white/70">{stage.label}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm text-white">{stage.noteCount}</span>
                    <span className="text-[9px] text-white/30">notas</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prioridades críticas */}
          <div className="p-4 rounded-lg border border-orange-500/30 bg-orange-500/5">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle size={14} className="text-orange-400" />
              <span className="text-[10px] text-orange-400/70 tracking-wider">PRIORIDADES CRÍTICAS</span>
            </div>

            {criticalPriorities.length === 0 ? (
              <p className="text-xs text-white/40 text-center py-4">No hay prioridades críticas pendientes</p>
            ) : (
              <div className="space-y-2">
                {criticalPriorities.map((note) => {
                  const stageInfo = STAGES.find((s) => s.key === note.stage)
                  const issueCount = note.actionBlocks.filter((b) => b.type === "issue").length
                  const pendingTasks = note.actionBlocks.filter((b) => b.type === "task" && !b.completed).length

                  return (
                    <div
                      key={note.id}
                      className="flex items-center gap-3 p-2 rounded bg-white/5 border border-white/10"
                    >
                      <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", stageInfo?.color)} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white truncate">{note.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {issueCount > 0 && (
                            <span className="text-[9px] text-orange-400">
                              {issueCount} issue{issueCount > 1 ? "s" : ""}
                            </span>
                          )}
                          {pendingTasks > 0 && (
                            <span className="text-[9px] text-electric-blue/70">
                              {pendingTasks} tarea{pendingTasks > 1 ? "s" : ""} pendiente{pendingTasks > 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                      </div>
                      {note.week && (
                        <span className="text-[10px] text-white/30 shrink-0">S{note.week}</span>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Resumen rápido */}
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 rounded-lg border border-white/10 bg-white/5">
              <p className="text-xl font-light text-white">{notes.length}</p>
              <p className="text-[10px] text-white/40">Notas totales</p>
            </div>
            <div className="p-3 rounded-lg border border-white/10 bg-white/5">
              <p className="text-xl font-light text-white">
                {notes.reduce((acc, n) => acc + n.actionBlocks.filter((b) => b.type === "task" && b.completed).length, 0)}
              </p>
              <p className="text-[10px] text-white/40">Tareas completadas</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 md:p-6 border-t border-white/10 space-y-3">
          {onStartNewProject && (
            <button
              onClick={() => {
                onStartNewProject()
                onClose()
              }}
              className="w-full py-3 text-xs tracking-wider bg-green-500/20 text-green-400 border border-green-500/30 rounded hover:bg-green-500/30 transition-colors"
            >
              + INICIAR NUEVO OPERATIVO
            </button>
          )}
          <button
            onClick={onClose}
            className="w-full py-3 text-xs tracking-wider bg-electric-blue/20 text-electric-blue border border-electric-blue/30 rounded hover:bg-electric-blue/30 transition-colors"
          >
            CERRAR CENTRO DE MANDO
          </button>
        </div>
      </div>
    </>
  )
}
