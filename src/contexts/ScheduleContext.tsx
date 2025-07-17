// src/contexts/ScheduleContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAttendance } from './AttendanceContext';

// Add Subject type
export interface Subject {
  name: string;
  isLab: boolean;
}

export interface WeeklySchedule {
  Monday: Subject[];
  Tuesday: Subject[];
  Wednesday: Subject[];
  Thursday: Subject[];
  Friday: Subject[];
}

interface ScheduleContextType {
  schedule: WeeklySchedule;
  setSchedule: (schedule: WeeklySchedule) => void;
  addSubject: (day: keyof WeeklySchedule, subject: Subject) => void;
  removeSubject: (day: keyof WeeklySchedule, subjectName: string) => void;
  getSubjectsForDay: (day: keyof WeeklySchedule) => Subject[];
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
  
  // Update addSubject to accept a Subject object
  const addSubject = (day: keyof WeeklySchedule, subject: Subject) => {
    const trimmedName = subject.name.trim();
    if (trimmedName && !schedule[day].some(s => s.name === trimmedName)) {
      setScheduleState(prev => ({
        ...prev,
        [day]: [...prev[day], { ...subject, name: trimmedName }]
      }));
    }
  };

  // Update removeSubject to use subject name
  const removeSubject = (day: keyof WeeklySchedule, subjectName: string) => {
    setScheduleState(prev => ({
      ...prev,
      [day]: prev[day].filter(s => s.name !== subjectName)
    }));
  };

  // Update getSubjectsForDay to return Subject[]
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
