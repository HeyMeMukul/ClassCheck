// src/contexts/ScheduleContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAttendance } from './AttendanceContext';
export interface WeeklySchedule {
  Monday: string[];
  Tuesday: string[];
  Wednesday: string[];
  Thursday: string[];
  Friday: string[];
}

interface ScheduleContextType {
  schedule: WeeklySchedule;
  setSchedule: (schedule: WeeklySchedule) => void;
  addSubject: (day: keyof WeeklySchedule, subject: string) => void;
  removeSubject: (day: keyof WeeklySchedule, subject: string) => void;
  getSubjectsForDay: (day: keyof WeeklySchedule) => string[];
  hasSchedule: boolean;
  resetSchedule: () => void;
}

const defaultSchedule: WeeklySchedule = {
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: []
};

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
};

export const ScheduleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [schedule, setScheduleState] = useState<WeeklySchedule>(() => {
    const saved = localStorage.getItem('classcheck_schedule');
    return saved ? JSON.parse(saved) : defaultSchedule;
  });

  useEffect(() => {
    localStorage.setItem('classcheck_schedule', JSON.stringify(schedule));
  }, [schedule]);

  const setSchedule = (newSchedule: WeeklySchedule) => {
    setScheduleState(newSchedule);
  };
  
  const addSubject = (day: keyof WeeklySchedule, subject: string) => {
    const trimmedSubject = subject.trim();
    if (trimmedSubject && !schedule[day].includes(trimmedSubject)) {
      setScheduleState(prev => ({
        ...prev,
        [day]: [...prev[day], trimmedSubject]
      }));
    }
  };

  const removeSubject = (day: keyof WeeklySchedule, subject: string) => {
    setScheduleState(prev => ({
      ...prev,
      [day]: prev[day].filter(s => s !== subject)
    }));
  };

  const getSubjectsForDay = (day: keyof WeeklySchedule) => {
    return schedule[day] || [];
  };

  const resetSchedule = () => {
    setScheduleState(defaultSchedule);
    localStorage.removeItem('classcheck_schedule');
  };

  const hasSchedule = Object.values(schedule).some(subjects => subjects.length > 0);

  return (
    <ScheduleContext.Provider value={{
      schedule,
      setSchedule,
      addSubject,
      removeSubject,
      getSubjectsForDay,
      hasSchedule,
      resetSchedule
    }}>
      {children}
    </ScheduleContext.Provider>
  );
};
