export type AttendanceStatus = 'attended' | 'missed' | 'cancelled';

export interface AttendanceRecord {
  id: string;
  date: string;      // YYYY-MM-DD format
  subject: string;
  status: AttendanceStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface AttendanceStats {
  totalClasses: number;
  attended: number;
  missed: number;
  cancelled: number;
  percentage: number;
}

export interface WeeklyStats {
  attended: number;
  missed: number;
  cancelled: number;
  percentage: number;
}

export interface MonthlyStats {
  month: string;
  attended: number;
  missed: number;
  cancelled: number;
  percentage: number;
}

export interface SubjectStats {
  subject: string;
  attended: number;
  missed: number;
  cancelled: number;
  percentage: number;
}
