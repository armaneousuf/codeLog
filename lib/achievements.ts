import { Achievement, LogEntry } from '../types';

export const ALL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_log',
    name: 'First Step',
    description: 'Log your first coding session.',
    icon: '👟',
    isUnlocked: (logs) => logs.length >= 1,
  },
  {
    id: 'ten_logs',
    name: 'Getting Started',
    description: 'Log 10 different coding sessions.',
    icon: '🚀',
    isUnlocked: (logs) => logs.length >= 10,
  },
  {
    id: 'fifty_logs',
    name: 'Habit Builder',
    description: 'Log 50 different coding sessions.',
    icon: '🧱',
    isUnlocked: (logs) => logs.length >= 50,
  },
  {
    id: 'hundred_hours',
    name: '100 Hour Club',
    description: 'Log a total of 100 hours of coding.',
    icon: '💯',
    isUnlocked: (logs) => logs.reduce((sum, log) => sum + log.hours, 0) >= 100,
  },
  {
    id: 'five_hundred_hours',
    name: 'Code Machine',
    description: 'Log a total of 500 hours of coding.',
    icon: '🤖',
    isUnlocked: (logs) => logs.reduce((sum, log) => sum + log.hours, 0) >= 500,
  },
  {
    id: 'seven_day_streak',
    name: 'Perfect Week',
    description: 'Maintain a 7-day coding streak.',
    icon: '🗓️',
    isUnlocked: (_, streak) => streak >= 7,
  },
  {
    id: 'thirty_day_streak',
    name: 'Consistent Coder',
    description: 'Maintain a 30-day coding streak.',
    icon: '🧘',
    isUnlocked: (_, streak) => streak >= 30,
  },
  {
    id: 'weekend_warrior',
    name: 'Weekend Warrior',
    description: 'Log coding hours on a Saturday or Sunday.',
    icon: '🛡️',
    isUnlocked: (logs) => logs.some(log => {
      const day = new Date(log.date + 'T00:00:00').getDay();
      return day === 0 || day === 6;
    }),
  },
  {
    id: 'overachiever',
    name: 'Overachiever',
    description: 'Log more than 8 hours in a single day.',
    icon: '💪',
    isUnlocked: (logs) => logs.some(log => log.hours > 8),
  },
  {
    id: 'deep_work',
    name: 'Deep Work',
    description: 'Log more than 10 hours in a single day.',
    icon: '🧠',
    isUnlocked: (logs) => logs.some(log => log.hours > 10),
  },
  {
    id: 'the_grinder',
    name: 'The Grinder',
    description: 'Log more than 12 hours in a single day.',
    icon: '⚙️',
    isUnlocked: (logs) => logs.some(log => log.hours > 12),
  },
  {
    id: 'elite_average',
    name: 'Elite Coder',
    description: 'Maintain a 10+ hour daily average over the last 30 days.',
    icon: '⭐',
    isUnlocked: (logs) => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];
        
        const logsLast30Days = logs.filter(log => log.date >= thirtyDaysAgoStr);
        const totalHours30 = logsLast30Days.reduce((sum, log) => sum + log.hours, 0);
        
        return (totalHours30 / 30) >= 10;
    }
  },
  {
    id: 'tag_pro',
    name: 'Organized',
    description: 'Use at least 5 different tags.',
    icon: '🏷️',
    isUnlocked: (logs) => {
        const allTags = new Set<string>();
        logs.forEach(log => log.tags?.forEach(tag => allTags.add(tag)));
        return allTags.size >= 5;
    }
  },
  {
    id: 'note_taker',
    name: 'Detail Oriented',
    description: 'Write notes for at least 10 log entries.',
    icon: '📝',
    isUnlocked: (logs) => logs.filter(log => log.note && log.note.trim() !== '').length >= 10,
  },
  {
    id: 'marathoner',
    name: 'Marathoner',
    description: 'Log over 40 hours in a single week.',
    icon: '🏃',
    isUnlocked: (logs) => {
      const weekMap = new Map<string, number>();
      logs.forEach(log => {
        const d = new Date(log.date + 'T00:00:00');
        const firstDayOfYear = new Date(d.getFullYear(), 0, 1);
        const pastDaysOfYear = (d.getTime() - firstDayOfYear.getTime()) / 86400000;
        const weekNumber = `${d.getFullYear()}-${Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)}`;
        weekMap.set(weekNumber, (weekMap.get(weekNumber) || 0) + log.hours);
      });
      return Array.from(weekMap.values()).some(total => total > 40);
    }
  }
];