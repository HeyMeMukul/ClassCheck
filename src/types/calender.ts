export interface ScheduleEntry {
  id: string;
  day: string;        // Monday, Tuesday, etc.
  startTime: string;  // HH:MM format
  endTime: string;    // HH:MM format
  subject: string;
  instructor?: string;
  room?: string;
  color?: string;
}

export interface AcademicCalendar {
  id: string;
  title: string;
  startDate: string;  // YYYY-MM-DD
  endDate: string;    // YYYY-MM-DD
  type: 'holiday' | 'exam' | 'break' | 'event';
  description?: string;
}

export interface CalendarDay {
  date: string;       // YYYY-MM-DD
  classes: ScheduleEntry[];
  isHoliday?: boolean;
  isExam?: boolean;
}
