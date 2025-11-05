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
    id: 'hundred_logs',
    name: 'Century Mark',
    description: 'Log 100 different coding sessions.',
    icon: '🎯',
    isUnlocked: (logs) => logs.length >= 100,
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
    id: 'thousand_hours',
    name: '1K Hour Club',
    description: 'Log a total of 1000 hours of coding.',
    icon: '🌌',
    isUnlocked: (logs) => logs.reduce((sum, log) => sum + log.hours, 0) >= 1000,
  },
  {
    id: 'two_thousand_hours',
    name: 'Code Master',
    description: 'Log a total of 2000 hours of coding.',
    icon: '🧙',
    isUnlocked: (logs) => logs.reduce((sum, log) => sum + log.hours, 0) >= 2000,
  },
  {
    id: 'seven_day_streak',
    name: 'Perfect Week',
    description: 'Maintain a 7-day coding streak.',
    icon: '🗓️',
    isUnlocked: (_, streak) => streak >= 7,
  },
  {
    id: 'fourteen_day_streak',
    name: 'Two Week Warrior',
    description: 'Maintain a 14-day coding streak.',
    icon: '⚔️',
    isUnlocked: (_, streak) => streak >= 14,
  },
  {
    id: 'thirty_day_streak',
    name: 'Consistent Coder',
    description: 'Maintain a 30-day coding streak.',
    icon: '🧘',
    isUnlocked: (_, streak) => streak >= 30,
  },
  {
    id: 'hundred_day_streak',
    name: 'The Centurion',
    description: 'Maintain a 100-day coding streak.',
    icon: '🏛️',
    isUnlocked: (_, streak) => streak >= 100,
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
    id: 'weekend_champion',
    name: 'Weekend Champion',
    description: 'Log hours on four consecutive weekends.',
    icon: '🏅',
    isUnlocked: (logs) => {
        const weekendWeeks = new Set<number>();
        for (const log of logs) {
            const d = new Date(log.date + 'T00:00:00');
            const day = d.getDay();
            if (day === 0 || day === 6) {
                const sunday = new Date(d);
                sunday.setDate(d.getDate() - day);
                sunday.setHours(0, 0, 0, 0);
                weekendWeeks.add(sunday.getTime());
            }
        }
        if (weekendWeeks.size < 4) return false;
        const sortedWeeks = Array.from(weekendWeeks).sort((a, b) => a - b);
        const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
        for (let i = 0; i <= sortedWeeks.length - 4; i++) {
            if (sortedWeeks[i+3] - sortedWeeks[i] === 3 * ONE_WEEK_MS) {
                return true;
            }
        }
        return false;
    }
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
  },
  {
    id: 'monthly_marathon',
    name: 'Monthly Marathon',
    description: 'Log over 100 hours in a single calendar month.',
    icon: '🌕',
    isUnlocked: (logs) => {
      const monthMap = new Map<string, number>();
      logs.forEach(log => {
        const monthKey = log.date.substring(0, 7); // YYYY-MM
        monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + log.hours);
      });
      return Array.from(monthMap.values()).some(total => total > 100);
    }
  },
  {
    id: 'yearly_dedication',
    name: 'Yearly Dedication',
    description: 'Log over 1000 hours in a single calendar year.',
    icon: '🎇',
    isUnlocked: (logs) => {
      const yearMap = new Map<string, number>();
      logs.forEach(log => {
        const yearKey = log.date.substring(0, 4); // YYYY
        yearMap.set(yearKey, (yearMap.get(yearKey) || 0) + log.hours);
      });
      return Array.from(yearMap.values()).some(total => total > 1000);
    }
  },
  {
    id: 'full_week',
    name: 'Complete Week',
    description: 'Log hours every day of a single calendar week (Sun-Sat).',
    icon: '📅',
    isUnlocked: (logs) => {
        const weeks = new Map<number, Set<number>>();
        for (const log of logs) {
            const d = new Date(log.date + 'T00:00:00');
            const day = d.getDay();
            
            const sunday = new Date(d);
            sunday.setDate(d.getDate() - day);
            sunday.setHours(0, 0, 0, 0);

            if (!weeks.has(sunday.getTime())) {
                weeks.set(sunday.getTime(), new Set());
            }
            weeks.get(sunday.getTime())!.add(day);
        }
        for (const daysInWeek of weeks.values()) {
            if (daysInWeek.size === 7) return true;
        }
        return false;
    }
  },
  {
    id: 'all_week_long',
    name: 'All Week Long',
    description: 'Log hours on every day of the week (a Mon, a Tue, etc.).',
    icon: '🌐',
    isUnlocked: (logs) => {
        const days = new Set();
        for (const log of logs) {
            days.add(new Date(log.date + 'T00:00:00').getDay());
        }
        return days.size === 7;
    }
  },
  {
    id: 'tag_pro',
    name: 'Organized',
    description: 'Use at least 5 different tags.',
    icon: '🏷️',
    isUnlocked: (logs) => {
        const allTags = new Set<string>();
        logs.forEach(log => {
            if (log.techBreakdown) {
                log.techBreakdown.forEach(tech => allTags.add(tech.tag));
            } else if (log.tags) {
                log.tags.forEach(tag => allTags.add(tag));
            }
        });
        return allTags.size >= 5;
    }
  },
  {
    id: 'polyglot',
    name: 'Polyglot',
    description: 'Use at least 10 different technology tags.',
    icon: '🗣️',
    isUnlocked: (logs) => {
        const allTags = new Set<string>();
        logs.forEach(log => {
            if (log.techBreakdown) {
                log.techBreakdown.forEach(tech => allTags.add(tech.tag));
            } else if (log.tags) {
                log.tags.forEach(tag => allTags.add(tag));
            }
        });
        return allTags.size >= 10;
    }
  },
  {
    id: 'specialist',
    name: 'Specialist',
    description: 'Log over 100 hours with a single technology tag.',
    icon: '🔬',
    isUnlocked: (logs) => {
        const tagHours = new Map<string, number>();
        logs.forEach(log => {
            if (log.techBreakdown) {
                log.techBreakdown.forEach(tech => {
                    tagHours.set(tech.tag, (tagHours.get(tech.tag) || 0) + tech.hours);
                });
            } else if (log.tags) {
                const hoursPerTag = log.tags.length > 0 ? log.hours / log.tags.length : 0;
                log.tags.forEach(tag => {
                    tagHours.set(tag, (tagHours.get(tag) || 0) + hoursPerTag);
                });
            }
        });
        return Array.from(tagHours.values()).some(hours => hours >= 100);
    }
  },
  {
    id: 'elite_average',
    name: 'Elite Coder',
    description: 'Maintain a 10+ hour daily average over the last 30 days.',
    icon: '⭐',
    isUnlocked: (logs) => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        thirtyDaysAgo.setHours(0,0,0,0);
        
        const logsLast30Days = logs.filter(log => new Date(log.date) >= thirtyDaysAgo);
        const totalHours30 = logsLast30Days.reduce((sum, log) => sum + log.hours, 0);
        
        return (totalHours30 / 30) >= 10;
    }
  },
  {
    id: 'new_year_res',
    name: 'New Year\'s Resolution',
    description: 'Log hours on January 1st.',
    icon: '🎉',
    isUnlocked: (logs) => logs.some(log => log.date.endsWith('-01-01')),
  },
  {
    id: 'leap_day',
    name: 'Leap Day Coder',
    description: 'Log hours on February 29th.',
    icon: '🦎',
    isUnlocked: (logs) => logs.some(log => log.date.endsWith('-02-29')),
  },
];