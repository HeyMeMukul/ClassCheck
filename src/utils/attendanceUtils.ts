import { AttendanceRecord, AttendanceStats, WeeklyStats } from '../types/attendance';


export const getOverallPercentage = (records: AttendanceRecord[]): number => {
  if (!records || records.length === 0) return 100;
  
  // Only count attended and missed classes (exclude cancelled)
  const validRecords = records.filter(r => r.status === 'attended' || r.status === 'missed');
  if (validRecords.length === 0) return 100;
  
  const attended = validRecords.filter(r => r.status === 'attended').length;
  return Math.round((attended / validRecords.length) * 100);
};

export const getOverallAttendanceStats = (records: AttendanceRecord[]): AttendanceStats => {
  if (!records || records.length === 0) {
    return {
      totalClasses: 0,
      attended: 0,
      missed: 0,
      cancelled: 0,
      percentage: 100
    };
  }

  const stats = {
    totalClasses: records.length,
    attended: records.filter(r => r.status === 'attended').length,
    missed: records.filter(r => r.status === 'missed').length,
    cancelled: records.filter(r => r.status === 'cancelled').length,
    percentage: 0
  };

  // Calculate percentage based on attended vs (attended + missed)
  const validClasses = stats.attended + stats.missed;
  stats.percentage = validClasses > 0 ? Math.round((stats.attended / validClasses) * 100) : 100;

  return stats;
};

export const getWeeklyStats = (records: AttendanceRecord[]): WeeklyStats => {
  const now = new Date();
  const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
  const weekEnd = new Date(now.setDate(now.getDate() - now.getDay() + 6));
  
  const weekRecords = records.filter(r => {
    const recordDate = new Date(r.date);
    return recordDate >= weekStart && recordDate <= weekEnd;
  });

  const attended = weekRecords.filter(r => r.status === 'attended').length;
  const missed = weekRecords.filter(r => r.status === 'missed').length;
  const cancelled = weekRecords.filter(r => r.status === 'cancelled').length;
  
  const validClasses = attended + missed;
  const percentage = validClasses > 0 ? Math.round((attended / validClasses) * 100) : 100;

  return { attended, missed, cancelled, percentage };
};

export const generateSmartSuggestions = (records: AttendanceRecord[], targetPercentage: number = 75): string[] => {
  const stats = getOverallAttendanceStats(records);
  const suggestions: string[] = [];

  if (stats.percentage < targetPercentage) {
    const needed = Math.ceil((targetPercentage * (stats.attended + stats.missed)) / 100) - stats.attended;
    suggestions.push(`You need to attend ${needed} more class${needed !== 1 ? 'es' : ''} to reach ${targetPercentage}%.`);
  } else if (stats.percentage >= 90) {
    suggestions.push('Excellent attendance! Keep up the great work.');
  } else if (stats.percentage >= targetPercentage) {
    const canMiss = Math.floor(stats.attended / (targetPercentage / 100)) - (stats.attended + stats.missed);
    if (canMiss > 0) {
      suggestions.push(`You're doing well! If you miss ${canMiss} more class${canMiss !== 1 ? 'es' : ''} and still maintain ${targetPercentage}%.`);
    }
  }

  // Weekly analysis
  const weeklyStats = getWeeklyStats(records);
  if (weeklyStats.missed >= 2) {
    suggestions.push(`You've missed ${weeklyStats.missed} classes this week. Try to attend all upcoming classes.`);
  }

  return suggestions;
};
