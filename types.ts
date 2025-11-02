
export interface LogEntry {
  date: string; // YYYY-MM-DD format
  hours: number;
  note?: string;
  tags?: string[];
  projectId?: string;
}

export interface Project {
  id: string;
  name: string;
  color: string;
}

export interface Goals {
  weekly: number;
  monthly: number;
  yearly: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  isUnlocked: (logs: LogEntry[], streak: number) => boolean;
}

export type UnlockedAchievements = Record<string, { date: string }>;