export type Stage = "planificacion" | "diseno" | "ejecucion" | "monitoreo" | "ajuste" | "cierre"

export type ActionBlockType = "task" | "milestone" | "issue"

export interface ActionBlock {
  id: string
  type: ActionBlockType
  content: string
  completed?: boolean // solo para tasks
}

export interface Session {
  id: string
  week: number
  stage: Stage
  duration: number // en segundos
  startedAt: string
  endedAt: string
  noteId?: string // ID de la nota activa durante la sesión
}

// Tracking de tiempo por nota
export interface NoteTimeStats {
  noteId: string
  totalTime: number // en segundos
  sessionsCount: number
}

export interface ChecklistItem {
  text: string
  completed: boolean
}

export interface Note {
  id: string
  week: number | null // null = sin asignar a semana específica
  stage: Stage
  title: string
  objective: string
  milestone: string
  checklist: ChecklistItem[]
  actionBlocks: ActionBlock[] // Bloques de acción dinámicos
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  name: string
  avatarUrl?: string
  currentStage: Stage
  isActive: boolean
}

export interface DrawerFilter {
  stage: Stage | null
  fromCommunity: boolean
}

// Proyecto/Operativo
export interface Project {
  id: string
  name: string
  objective: string
  activeStages: Stage[]
  weekMilestones: Record<number, string> // semana -> hito
  createdAt: string
  startDate: string
}

// Heatmap data
export interface ActivityDay {
  date: string
  minutes: number
  level: 0 | 1 | 2 | 3 | 4 // intensidad de actividad
}
