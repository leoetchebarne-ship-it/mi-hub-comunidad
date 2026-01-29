"use client"

import { useState } from "react"
import { X, Plus, Check, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Note, Stage, DrawerFilter } from "@/lib/types"

interface RightDrawerProps {
  isOpen: boolean
  onClose: () => void
  allNotes: Note[]
  weekNotes: Note[]
  onAddNote: (note: Note) => void
  onUpdateNote: (note: Note) => Promise<void>
  onDeleteNote: (id: string) => Promise<void>
  selectedWeek: number
  currentStage: Stage
  drawerFilter: DrawerFilter
}

export function RightDrawer({ 
  isOpen, 
  onClose, 
  allNotes, 
  weekNotes, 
  onAddNote, 
  onUpdateNote, // Agregado para evitar errores de desestructuración
  onDeleteNote,
  selectedWeek, 
  currentStage,
  drawerFilter
}: RightDrawerProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [title, setTitle] = useState("")
  const [objective, setObjective] = useState("")
  const [milestone, setMilestone] = useState("")
  const [checklist, setChecklist] = useState<string[]>([])
  const [newTask, setNewTask] = useState("")

  const displayNotes = drawerFilter.stage 
    ? allNotes.filter(n => n.stage === drawerFilter.stage)
    : weekNotes;

  const handleAddTask = () => {
    if (newTask.trim()) {
      setChecklist((prev) => [...prev, newTask.trim()])
      setNewTask("")
    }
  }

  const handleSaveNote = () => {
    if (title.trim()) {
      const newNote: Note = {
        id: crypto.randomUUID(),
        week: selectedWeek,
        stage: drawerFilter.stage || currentStage,
        title: title.trim(),
        objective: objective.trim(),
        milestone: milestone.trim(),
        checklist: checklist.map((task) => ({ text: task, completed: false })),
        createdAt: new Date().toISOString(),
      }
      onAddNote(newNote)
      setTitle("")
      setObjective("")
      setMilestone("")
      setChecklist([])
      setIsAdding(false)
    }
  }

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />}
      <aside className={cn(
        "fixed right-0 top-0 h-full w-full sm:w-80 bg-black/95 border-l border-white/10 z-50 transform transition-transform duration-300",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-xs tracking-[0.2em] text-white/70 uppercase">
            {drawerFilter.stage ? `NOTAS: ${drawerFilter.stage}` : 'PLANIFICADOR'}
          </h2>
          <button onClick={onClose} className="text-white/40 hover:text-white p-1">
            <X size={20} /> {/* CORREGIDO: Tag cerrado correctamente */}
          </button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-60px)]">
          <div className="text-xs text-white/40">
            Semana {selectedWeek} • {currentStage}
          </div>

          <div className="space-y-3">
            {displayNotes.map((note) => (
              <div key={note.id} className="group p-3 border border-white/10 rounded-lg bg-white/5 relative">
                <button onClick={() => onDeleteNote(note.id)} className="absolute top-2 right-2 text-red-500/50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={14} />
                </button>
                <h3 className="text-sm text-white mb-1">{note.title}</h3>
                <div className="space-y-1">
                  {note.checklist.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-white/40">
                      <div className="w-2 h-2 border border-white/20 rounded-full" />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {isAdding ? (
            <div className="space-y-3 p-3 border border-electric-blue/30 rounded-lg bg-electric-blue/5">
              <input
                type="text"
                placeholder="Título..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-transparent border-b border-white/20 pb-1 text-sm text-white focus:outline-none"
              />
              <div className="flex gap-2">
                <button onClick={handleSaveNote} className="flex-1 py-2 bg-electric-blue/20 text-electric-blue border border-electric-blue/30 rounded text-xs">GUARDAR</button>
                <button onClick={() => setIsAdding(false)} className="px-3 text-xs text-white/40">CANCELAR</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setIsAdding(true)} className="w-full py-4 border border-dashed border-white/20 rounded-lg text-xs text-white/40 hover:text-electric-blue/70">
              + NUEVA NOTA
            </button>
          )}
        </div>
      </aside>
    </>
  )
}
