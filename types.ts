
export interface TechTime {
  tag: string;
  hours: number;
}

export interface LogEntry {
  date: string; // YYYY-MM-DD format
  hours: number;
  tags?: string[]; // Kept for backward compatibility with old data in localStorage
  techBreakdown?: TechTime[];
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