// Definición de las etapas del proyecto
export type Stage = "planificacion" | "diseno" | "ejecucion" | "monitoreo" | "ajuste" | "cierre"

export type ActionBlockType = "task" | "milestone" | "issue"

export interface ActionBlock {
  id: string
  type: ActionBlockType
  content: string
  completed?: boolean
}

export interface Session {
  id: string
  week: number
  stage: Stage
  duration: number
  startedAt: string
  endedAt: string
  noteId?: string
}

export interface NoteTimeStats {
  noteId: string
  totalTime: number
  sessionsCount: number
}

export interface ChecklistItem {
  text: string
  completed: boolean
}

// Interfaz Note corregida para ser compatible con el formulario de creación
export interface Note {
  id: string
  week: number | null
  stage: Stage
  title: string
  objective?: string    // Ahora es opcional
  milestone?: string    // Ahora es opcional
  checklist: ChecklistItem[]
  actionBlocks?: ActionBlock[] // Opcional para evitar errores al crear notas nuevas
  createdAt: string
  updatedAt?: string    // Opcional porque no existe en el momento de creación
}

export interface User {
  id: string
  name: string
  avatarUrl?: string
  currentStage: Stage
  isActive: boolean
}

// Interfaz para el filtrado del cajón lateral
export interface DrawerFilter {
  stage: Stage | null
  fromCommunity: boolean
}

export interface Project {
  id: string
  name: string
  objective: string
  activeStages: Stage[]
  weekMilestones: Record<number, string>
  createdAt: string
  startDate: string
}

export interface ActivityDay {
  date: string
  minutes: number
  level: 0 | 1 | 2 | 3 | 4
}
