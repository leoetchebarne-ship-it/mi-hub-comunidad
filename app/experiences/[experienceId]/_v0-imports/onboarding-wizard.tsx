"use client"

import { useState, useCallback } from "react"
import { X, ChevronRight, ChevronLeft, Rocket, Target, Flag, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Stage, Project } from "@/lib/types"

interface OnboardingWizardProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (project: Project) => void
}

const STAGES: { key: Stage; label: string; color: string; description: string }[] = [
  { key: "planificacion", label: "Planificación", color: "bg-blue-500", description: "Definir objetivos y alcance" },
  { key: "diseno", label: "Diseño", color: "bg-purple-500", description: "Crear estructura y prototipos" },
  { key: "ejecucion", label: "Ejecución", color: "bg-green-500", description: "Desarrollo y construcción" },
  { key: "monitoreo", label: "Monitoreo", color: "bg-yellow-500", description: "Seguimiento y métricas" },
  { key: "ajuste", label: "Ajuste", color: "bg-orange-500", description: "Correcciones y mejoras" },
  { key: "cierre", label: "Cierre", color: "bg-red-500", description: "Finalización y entrega" },
]

const WEEKS = Array.from({ length: 12 }, (_, i) => i + 1)

export function OnboardingWizard({ isOpen, onClose, onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState(1)
  const [projectName, setProjectName] = useState("")
  const [objective, setObjective] = useState("")
  const [activeStages, setActiveStages] = useState<Stage[]>(STAGES.map((s) => s.key))
  const [weekMilestones, setWeekMilestones] = useState<Record<number, string>>({})
  const [currentMilestoneWeek, setCurrentMilestoneWeek] = useState<number | null>(null)
  const [milestoneInput, setMilestoneInput] = useState("")

  const toggleStage = useCallback((stage: Stage) => {
    setActiveStages((prev) =>
      prev.includes(stage) ? prev.filter((s) => s !== stage) : [...prev, stage],
    )
  }, [])

  const handleAddMilestone = useCallback(() => {
    if (currentMilestoneWeek && milestoneInput.trim()) {
      setWeekMilestones((prev) => ({
        ...prev,
        [currentMilestoneWeek]: milestoneInput.trim(),
      }))
      setMilestoneInput("")
      setCurrentMilestoneWeek(null)
    }
  }, [currentMilestoneWeek, milestoneInput])

  const handleComplete = useCallback(() => {
    if (projectName.trim() && objective.trim()) {
      const project: Project = {
        id: crypto.randomUUID(),
        name: projectName.trim(),
        objective: objective.trim(),
        activeStages,
        weekMilestones,
        createdAt: new Date().toISOString(),
        startDate: new Date().toISOString(),
      }
      onComplete(project)
      onClose()
    }
  }, [projectName, objective, activeStages, weekMilestones, onComplete, onClose])

  const canProceed = step === 1 ? projectName.trim() && objective.trim() : step === 2 ? activeStages.length > 0 : true

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/90 z-50" />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-black border border-electric-blue/30 rounded-xl overflow-hidden shadow-[0_0_60px_rgba(59,130,246,0.2)]">
          {/* Header */}
          <div className="relative p-6 border-b border-white/10 bg-gradient-to-r from-electric-blue/10 to-transparent">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-white/40 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-electric-blue/20 flex items-center justify-center">
                <Rocket size={20} className="text-electric-blue" />
              </div>
              <div>
                <h2 className="text-base tracking-[0.15em] text-white">PROTOCOLO DE DESPLIEGUE</h2>
                <p className="text-[10px] text-electric-blue/70">Configuración del operativo trimestral</p>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="flex items-center gap-2 mt-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all",
                      step >= s
                        ? "bg-electric-blue text-black"
                        : "bg-white/10 text-white/40",
                    )}
                  >
                    {step > s ? <Check size={14} /> : s}
                  </div>
                  {s < 3 && (
                    <div
                      className={cn(
                        "w-8 md:w-16 h-0.5 rounded",
                        step > s ? "bg-electric-blue" : "bg-white/10",
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 min-h-[300px]">
            {/* Step 1: Nombre y Objetivo */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Target size={32} className="mx-auto text-electric-blue mb-2" />
                  <h3 className="text-sm tracking-[0.2em] text-white mb-1">IDENTIFICA TU OPERATIVO</h3>
                  <p className="text-xs text-white/40">Define el nombre y objetivo principal del proyecto</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] tracking-wider text-white/50 mb-2">
                      NOMBRE DEL OPERATIVO
                    </label>
                    <input
                      type="text"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="Ej: Lanzamiento App Q1 2026"
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-electric-blue/50 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-wider text-white/50 mb-2">
                      OBJETIVO PRINCIPAL
                    </label>
                    <textarea
                      value={objective}
                      onChange={(e) => setObjective(e.target.value)}
                      placeholder="Describe el resultado esperado al finalizar las 12 semanas..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-electric-blue/50 text-sm resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Fases Activas */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Flag size={32} className="mx-auto text-electric-blue mb-2" />
                  <h3 className="text-sm tracking-[0.2em] text-white mb-1">FASES DEL OPERATIVO</h3>
                  <p className="text-xs text-white/40">Selecciona las etapas que utilizarás en tu proyecto</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {STAGES.map((stage) => {
                    const isActive = activeStages.includes(stage.key)
                    return (
                      <button
                        key={stage.key}
                        onClick={() => toggleStage(stage.key)}
                        className={cn(
                          "p-4 rounded-lg border text-left transition-all",
                          isActive
                            ? "border-electric-blue/50 bg-electric-blue/10"
                            : "border-white/10 bg-white/5 hover:border-white/20",
                        )}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className={cn(
                              "w-4 h-4 rounded border-2 flex items-center justify-center transition-all",
                              isActive ? "border-electric-blue bg-electric-blue" : "border-white/30",
                            )}
                          >
                            {isActive && <Check size={10} className="text-black" />}
                          </div>
                          <div className={cn("w-2 h-2 rounded-full", stage.color)} />
                        </div>
                        <p className="text-xs text-white mb-0.5">{stage.label}</p>
                        <p className="text-[10px] text-white/40">{stage.description}</p>
                      </button>
                    )
                  })}
                </div>

                <p className="text-center text-[10px] text-white/30">
                  {activeStages.length} de {STAGES.length} fases seleccionadas
                </p>
              </div>
            )}

            {/* Step 3: Mapeo de Hitos */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Rocket size={32} className="mx-auto text-electric-blue mb-2" />
                  <h3 className="text-sm tracking-[0.2em] text-white mb-1">HITOS SEMANALES</h3>
                  <p className="text-xs text-white/40">Define hitos clave para cada semana (opcional)</p>
                </div>

                {/* Timeline visual */}
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                  {WEEKS.map((week) => {
                    const hasMilestone = weekMilestones[week]
                    const isEditing = currentMilestoneWeek === week
                    return (
                      <button
                        key={week}
                        onClick={() => {
                          if (hasMilestone) {
                            setWeekMilestones((prev) => {
                              const next = { ...prev }
                              delete next[week]
                              return next
                            })
                          } else {
                            setCurrentMilestoneWeek(week)
                          }
                        }}
                        className={cn(
                          "relative p-3 rounded-lg border text-center transition-all",
                          hasMilestone
                            ? "border-green-500/50 bg-green-500/10"
                            : isEditing
                              ? "border-electric-blue/50 bg-electric-blue/10"
                              : "border-white/10 bg-white/5 hover:border-white/20",
                        )}
                      >
                        <span className="text-xs text-white/70">S{week}</span>
                        {hasMilestone && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 flex items-center justify-center">
                            <Check size={8} className="text-black" />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Milestone input */}
                {currentMilestoneWeek && (
                  <div className="p-4 rounded-lg border border-electric-blue/30 bg-electric-blue/5">
                    <label className="block text-[10px] tracking-wider text-electric-blue/70 mb-2">
                      HITO PARA SEMANA {currentMilestoneWeek}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={milestoneInput}
                        onChange={(e) => setMilestoneInput(e.target.value)}
                        placeholder="Ej: Completar MVP funcional"
                        className="flex-1 px-3 py-2 rounded bg-white/5 border border-white/10 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-electric-blue/50"
                        onKeyDown={(e) => e.key === "Enter" && handleAddMilestone()}
                      />
                      <button
                        onClick={handleAddMilestone}
                        className="px-4 py-2 rounded bg-electric-blue/20 text-electric-blue text-xs hover:bg-electric-blue/30 transition-colors"
                      >
                        Agregar
                      </button>
                    </div>
                  </div>
                )}

                {/* Lista de hitos */}
                {Object.keys(weekMilestones).length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[10px] text-white/40">Hitos definidos:</p>
                    {Object.entries(weekMilestones)
                      .sort(([a], [b]) => Number(a) - Number(b))
                      .map(([week, milestone]) => (
                        <div
                          key={week}
                          className="flex items-center gap-3 p-2 rounded bg-white/5 border border-white/10"
                        >
                          <span className="text-[10px] text-green-400 font-medium">S{week}</span>
                          <span className="text-xs text-white/70 flex-1">{milestone}</span>
                          <button
                            onClick={() =>
                              setWeekMilestones((prev) => {
                                const next = { ...prev }
                                delete next[Number(week)]
                                return next
                              })
                            }
                            className="text-white/30 hover:text-red-400 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={() => step > 1 && setStep(step - 1)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded text-xs text-white/50 hover:text-white transition-colors",
                step === 1 && "invisible",
              )}
            >
              <ChevronLeft size={14} />
              Anterior
            </button>

            <div className="text-[10px] text-white/30">
              Paso {step} de 3
            </div>

            {step < 3 ? (
              <button
                onClick={() => canProceed && setStep(step + 1)}
                disabled={!canProceed}
                className={cn(
                  "flex items-center gap-2 px-6 py-2.5 rounded text-xs tracking-wider transition-all",
                  canProceed
                    ? "bg-electric-blue/20 text-electric-blue border border-electric-blue/30 hover:bg-electric-blue/30"
                    : "bg-white/5 text-white/30 border border-white/10 cursor-not-allowed",
                )}
              >
                Siguiente
                <ChevronRight size={14} />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="flex items-center gap-2 px-6 py-2.5 rounded text-xs tracking-wider bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 transition-all"
              >
                <Rocket size={14} />
                INICIAR OPERATIVO
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
