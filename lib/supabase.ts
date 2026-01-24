import { createClient } from "@supabase/supabase-js"
import type { Session, Note, Project, NoteTimeStats } from "@/lib/types"

// Supabase client configuration using environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if Supabase is configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

// Create Supabase client only if configured
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null

// Database types for Supabase tables
export interface DbSession {
  id: string
  user_id?: string
  week: number
  stage: string
  duration: number
  started_at: string
  ended_at: string
  note_id?: string
  created_at?: string
}

export interface DbNote {
  id: string
  user_id?: string
  week: number | null
  stage: string
  title: string
  objective: string
  milestone: string
  checklist: string // JSON string
  action_blocks: string // JSON string
  created_at: string
  updated_at: string
}

export interface DbProject {
  id: string
  user_id?: string
  name: string
  objective: string
  active_stages: string // JSON string
  week_milestones: string // JSON string
  created_at: string
  start_date: string
}

export interface DbNoteTimeStats {
  id?: string
  note_id: string
  user_id?: string
  total_time: number
  sessions_count: number
}

// Helper functions for database operations

/**
 * Insert a new session into Supabase
 */
export async function insertSession(session: Session): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    console.log("[v0] Supabase not configured - session saved locally only")
    return { success: true }
  }

  try {
    const dbSession: DbSession = {
      id: session.id,
      week: session.week,
      stage: session.stage,
      duration: session.duration,
      started_at: session.startedAt,
      ended_at: session.endedAt,
      note_id: session.noteId,
    }

    const { error } = await supabase.from("sessions").insert(dbSession)

    if (error) {
      console.error("[v0] Error inserting session:", error.message)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error("[v0] Exception inserting session:", message)
    return { success: false, error: message }
  }
}

/**
 * Insert a new note into Supabase
 */
export async function insertNote(note: Note): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    console.log("[v0] Supabase not configured - note saved locally only")
    return { success: true }
  }

  try {
    const dbNote: DbNote = {
      id: note.id,
      week: note.week,
      stage: note.stage,
      title: note.title,
      objective: note.objective,
      milestone: note.milestone,
      checklist: JSON.stringify(note.checklist),
      action_blocks: JSON.stringify(note.actionBlocks),
      created_at: note.createdAt,
      updated_at: note.updatedAt,
    }

    const { error } = await supabase.from("notes").insert(dbNote)

    if (error) {
      console.error("[v0] Error inserting note:", error.message)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error("[v0] Exception inserting note:", message)
    return { success: false, error: message }
  }
}

/**
 * Update an existing note in Supabase
 */
export async function updateNote(note: Note): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    console.log("[v0] Supabase not configured - note updated locally only")
    return { success: true }
  }

  try {
    const dbNote: Partial<DbNote> = {
      week: note.week,
      stage: note.stage,
      title: note.title,
      objective: note.objective,
      milestone: note.milestone,
      checklist: JSON.stringify(note.checklist),
      action_blocks: JSON.stringify(note.actionBlocks),
      updated_at: note.updatedAt,
    }

    const { error } = await supabase.from("notes").update(dbNote).eq("id", note.id)

    if (error) {
      console.error("[v0] Error updating note:", error.message)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error("[v0] Exception updating note:", message)
    return { success: false, error: message }
  }
}

/**
 * Delete a note from Supabase
 */
export async function deleteNote(noteId: string): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    console.log("[v0] Supabase not configured - note deleted locally only")
    return { success: true }
  }

  try {
    const { error } = await supabase.from("notes").delete().eq("id", noteId)

    if (error) {
      console.error("[v0] Error deleting note:", error.message)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error("[v0] Exception deleting note:", message)
    return { success: false, error: message }
  }
}

/**
 * Insert or update note time stats in Supabase
 */
export async function upsertNoteTimeStats(
  stats: NoteTimeStats,
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    console.log("[v0] Supabase not configured - stats saved locally only")
    return { success: true }
  }

  try {
    const dbStats: DbNoteTimeStats = {
      note_id: stats.noteId,
      total_time: stats.totalTime,
      sessions_count: stats.sessionsCount,
    }

    const { error } = await supabase.from("note_time_stats").upsert(dbStats, {
      onConflict: "note_id",
    })

    if (error) {
      console.error("[v0] Error upserting note time stats:", error.message)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error("[v0] Exception upserting note time stats:", message)
    return { success: false, error: message }
  }
}

/**
 * Insert a new project into Supabase
 */
export async function insertProject(project: Project): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    console.log("[v0] Supabase not configured - project saved locally only")
    return { success: true }
  }

  try {
    const dbProject: DbProject = {
      id: project.id,
      name: project.name,
      objective: project.objective,
      active_stages: JSON.stringify(project.activeStages),
      week_milestones: JSON.stringify(project.weekMilestones),
      created_at: project.createdAt,
      start_date: project.startDate,
    }

    const { error } = await supabase.from("projects").insert(dbProject)

    if (error) {
      console.error("[v0] Error inserting project:", error.message)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error("[v0] Exception inserting project:", message)
    return { success: false, error: message }
  }
}

/**
 * Fetch all notes from Supabase
 */
export async function fetchNotes(): Promise<{ data: Note[] | null; error?: string }> {
  if (!supabase) {
    return { data: null }
  }

  try {
    const { data, error } = await supabase.from("notes").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching notes:", error.message)
      return { data: null, error: error.message }
    }

    const notes: Note[] = (data || []).map((dbNote: DbNote) => ({
      id: dbNote.id,
      week: dbNote.week,
      stage: dbNote.stage as Note["stage"],
      title: dbNote.title,
      objective: dbNote.objective,
      milestone: dbNote.milestone,
      checklist: JSON.parse(dbNote.checklist || "[]"),
      actionBlocks: JSON.parse(dbNote.action_blocks || "[]"),
      createdAt: dbNote.created_at,
      updatedAt: dbNote.updated_at,
    }))

    return { data: notes }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error("[v0] Exception fetching notes:", message)
    return { data: null, error: message }
  }
}

/**
 * Fetch all sessions from Supabase
 */
export async function fetchSessions(): Promise<{ data: Session[] | null; error?: string }> {
  if (!supabase) {
    return { data: null }
  }

  try {
    const { data, error } = await supabase.from("sessions").select("*").order("ended_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching sessions:", error.message)
      return { data: null, error: error.message }
    }

    const sessions: Session[] = (data || []).map((dbSession: DbSession) => ({
      id: dbSession.id,
      week: dbSession.week,
      stage: dbSession.stage as Session["stage"],
      duration: dbSession.duration,
      startedAt: dbSession.started_at,
      endedAt: dbSession.ended_at,
      noteId: dbSession.note_id,
    }))

    return { data: sessions }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error("[v0] Exception fetching sessions:", message)
    return { data: null, error: message }
  }
}
