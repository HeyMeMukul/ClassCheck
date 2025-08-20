// src/contexts/ScheduleContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAttendance } from './AttendanceContext'; // Import useAttendance

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
  const { updateSubjectNameInRecords } = useAttendance(); // Get the function from AttendanceContext

  const [schedule, setScheduleState] = useState<WeeklySchedule>(() => {
    const saved = localStorage.getItem('classcheck_schedule');
    return saved ? JSON.parse(saved) : defaultSchedule;
  });

  // Effect to save schedule to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('classcheck_schedule', JSON.stringify(schedule));
  }, [schedule]);

  // --- NEW: One-time migration useEffect ---
  useEffect(() => {
    const HAS_RUN_LAB_NAME_MIGRATION_KEY = 'has_run_lab_name_migration'; // Unique key for this migration
    const hasRunMigration = localStorage.getItem(HAS_RUN_LAB_NAME_MIGRATION_KEY);

    if (!hasRunMigration) {
      console.log('Running lab name migration for schedule and attendance records...');
      let updatedSchedule = { ...schedule }; // Create a mutable copy of the schedule

      // Array to store changes needed for attendance records
      const attendanceUpdates: { oldName: string; newName: string }[] = [];

      // Iterate over each day in the schedule
      for (const day of Object.keys(updatedSchedule) as (keyof WeeklySchedule)[]) {
        updatedSchedule[day] = updatedSchedule[day].map((subject: Subject) => {
          // Check if it's a lab AND its name doesn't already contain '(L)'
          if (subject.isLab && !subject.name.includes('(Lab)')) {
            const oldName = subject.name;
            const newName = `${oldName} (Lab)`;

            // Store the change for attendance records
            attendanceUpdates.push({ oldName, newName });

            // Return the subject with the updated name
            return { ...subject, name: newName };
          }
          return subject; // Return subject unchanged if no update needed
        });
      }

      // After updating the local schedule object, update the state
      setScheduleState(updatedSchedule);

      // Now, update the attendance records using the collected changes
      attendanceUpdates.forEach(({ oldName, newName }) => {
        updateSubjectNameInRecords(oldName, newName);
      });

      // Set the flag in local storage to prevent running again
      localStorage.setItem(HAS_RUN_LAB_NAME_MIGRATION_KEY, 'true');
      console.log('Lab name migration complete.');
    }
  }, []); // Empty dependency array means this effect runs only once on mount
  // --- END NEW: One-time migration useEffect ---


  const setSchedule = (newSchedule: WeeklySchedule) => {
    setScheduleState(newSchedule);
  };

  // Update addSubject to accept a Subject object
  const addSubject = (day: keyof WeeklySchedule, subject: Subject) => {
    const trimmedName = subject.name.trim();
    // Assuming the calling component (ManageSubjects) already handles adding (Lab) to name if it's a lab
    if (trimmedName && !schedule[day].some(s => s.name === trimmedName)) {
      setScheduleState(prev => ({
        ...prev,
        [day]: [...prev[day], { ...subject, name: trimmedName }] // Use trimmedName which might already contain (L)
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
    // Important: Also remove the migration flag if resetting everything
    localStorage.removeItem('has_run_lab_name_migration');
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