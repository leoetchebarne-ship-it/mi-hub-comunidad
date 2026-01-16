export type Stage = "planificacion" | "diseno" | "ejecucion" | "monitoreo" | "ajuste" | "cierre";

export interface Session {
  id: string;
  week: number;
  stage: Stage;
  duration: number;
  startedAt: string;
  endedAt: string;
}

export interface Note {
  id: string;
  week: number;
  stage: Stage;
  title: string;
  objective?: string;
  milestone?: string;
  checklist: { text: string; completed: boolean }[];
  createdAt: string;
}
