"use client"

import { useState } from "react"
import { X, Plus, Check, Trash2, Edit2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Note, Stage, DrawerFilter } from "@/lib/types"

interface RightDrawerProps {
  isOpen: boolean
  onClose: () => void
  allNotes: Note[]      // Agregado para coincidir con ProjectLab
  weekNotes: Note[]     // Agregado para coincidir con ProjectLab
  onAddNote: (note: Note) => void
  onUpdateNote: (note: Note) => Promise<void> // Agregado
  onDeleteNote: (id: string) => Promise<void> // Agregado
  selectedWeek: number
  currentStage: Stage
  drawerFilter: DrawerFilter // Agregado
}

export function RightDrawer({ 
  isOpen, 
  onClose, 
  allNotes, 
  weekNotes, 
  onAddNote, 
  onUpdateNote,
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

  // Filtrar las notas a mostrar según el filtro del Drawer
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
      const note: Note = {
        id: crypto.randomUUID(),
        week: selectedWeek,
        stage: drawerFilter.stage || currentStage,
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
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />}

      <aside
        className={cn(
          "fixed right-0 top-0 h-full w-full sm:w-80 bg-black/95 border-l border-white/10 z-50 transform transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-xs tracking-[0.2em] text-white/70 uppercase">
            {drawerFilter.stage ? `NOTAS: ${drawerFilter.stage}` : 'PLANIFICADOR'}
          </h2>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors p-1">
            <X
