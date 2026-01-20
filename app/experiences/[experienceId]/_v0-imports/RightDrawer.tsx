"use client"

import { useState } from "react"
import { X, Plus, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Note, Stage } from "@/lib/types"

interface RightDrawerProps {
  isOpen: boolean
  onClose: () => void
  notes: Note[]
  onAddNote: (note: Note) => void
  selectedWeek: number
  currentStage: Stage
}

export function RightDrawer({ isOpen, onClose, notes, onAddNote, selectedWeek, currentStage }: RightDrawerProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [title, setTitle] = useState("")
  const [objective, setObjective] = useState("")
  const [milestone, setMilestone] = useState("")
  const [checklist, setChecklist] = useState<string[]>([])
  const [newTask, setNewTask] = useState("")

  const handleAddTask = () => {
    if (newTask.trim()) {
      setChecklist((prev) => [...prev, newTask.trim()])
      setNewTask("")
    }
  }

  const handleSaveNote = () => {
    if (title.trim()) {
      const note: Note = {
        id: crypto.randomUUID(),
        week: selectedWeek,
        stage: currentStage,
        title: title.trim(),
        objective: objective.trim(),
        milestone: milestone.trim(),
        checklist: checklist.map((task) => ({ text: task, completed: false })),
        createdAt: new Date().toISOString(),
      }
      onAddNote(note)
      setTitle("")
      setObjective("")
      setMilestone("")
      setChecklist([])
      setIsAdding(false)
    }
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />}

      {/* Drawer - Full width on mobile, fixed width on desktop */}
      <aside
        className={cn(
          "fixed right-0 top-0 h-full w-full sm:w-80 bg-black/95 border-l border-white/10 z-50 transform transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-xs tracking-[0.2em] text-white/70">PLANIFICADOR</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-60px)]">
          {/* Indicador de contexto */}
          <div className="text-xs text-white/40 space-y-1">
            <p>
              Semana {selectedWeek} • {currentStage.charAt(0).toUpperCase() + currentStage.slice(1)}
            </p>
          </div>

          {/* Lista de notas existentes */}
          {notes.length > 0 && (
            <div className="space-y-3">
              {notes.map((note) => (
                <div key={note.id} className="p-3 border border-white/10 rounded-lg bg-white/5">
                  <h3 className="text-sm text-white mb-1">{note.title}</h3>
                  {note.objective && <p className="text-xs text-white/50 mb-2">{note.objective}</p>}
                  {note.checklist.length > 0 && (
                    <div className="space-y-1">
                      {note.checklist.map((task, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-white/40">
                          <div className="w-3 h-3 border border-white/20 rounded-sm" />
                          <span>{task.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Formulario para nueva nota */}
          {isAdding ? (
            <div className="space-y-3 p-3 border border-electric-blue/30 rounded-lg bg-electric-blue/5">
              <input
                type="text"
                placeholder="Título de la nota"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-transparent border-b border-white/20 pb-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-electric-blue/50"
              />
              <input
                type="text"
                placeholder="Objetivo de etapa"
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="w-full bg-transparent border-b border-white/20 pb-2 text-xs text-white/70 placeholder:text-white/30 focus:outline-none focus:border-electric-blue/50"
              />
              <input
                type="text"
                placeholder="Hito de éxito"
                value={milestone}
                onChange={(e) => setMilestone(e.target.value)}
                className="w-full bg-transparent border-b border-white/20 pb-2 text-xs text-white/70 placeholder:text-white/30 focus:outline-none focus:border-electric-blue/50"
              />

              {/* Checklist */}
              <div className="space-y-2">
                <p className="text-xs text-white/40">Tareas:</p>
                {checklist.map((task, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-white/60">
                    <Check size={12} />
                    <span>{task}</span>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nueva tarea..."
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
                    className="flex-1 bg-transparent border-b border-white/10 pb-1 text-xs text-white/70 placeholder:text-white/30 focus:outline-none"
                  />
                  <button onClick={handleAddTask} className="text-electric-blue p-1">
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleSaveNote}
                  className="flex-1 py-2.5 text-xs tracking-wider bg-electric-blue/20 text-electric-blue border border-electric-blue/30 rounded hover:bg-electric-blue/30 transition-colors"
                >
                  GUARDAR
                </button>
                <button
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2.5 text-xs text-white/40 hover:text-white/60 transition-colors"
                >
                  CANCELAR
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full py-4 border border-dashed border-white/20 rounded-lg text-xs tracking-wider text-white/40 hover:border-electric-blue/30 hover:text-electric-blue/70 transition-all"
            >
              + NUEVA NOTA
            </button>
          )}
        </div>
      </aside>
    </>
  )
}
