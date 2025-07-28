// Update src/contexts/AttendanceContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getOverallPercentage, getOverallAttendanceStats } from '../utils/attendanceUtils';
import { AttendanceRecord } from '../types/attendance';
import { getWeeklyStats as calculateWeeklyStats } from '../utils/attendanceUtils';


interface AttendanceContextType {
  records: AttendanceRecord[];
  addRecord: (record: AttendanceRecord) => void;
  updateRecord: (id: string, updates: Partial<AttendanceRecord>) => void;
  getRecordForDateAndSubject: (date: string, subject: string) => AttendanceRecord | undefined;
  calculatePercentage: () => number;
  getWeeklyStats: () => { attended: number; missed: number; cancelled: number };
  // Export utility functions through context
  getOverallPercentage: () => number;
  getOverallAttendanceStats: () => any;
  removeRecordsBySubject: (subject: string) => void;
  resetAllRecords: () => void;
  // NEW: Function to update subject names during migration
  updateSubjectNameInRecords: (oldName: string, newName: string) => void;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};

export const AttendanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);

  // LOADS from localStorage on mount
  useEffect(() => {
    const savedRecords = localStorage.getItem('attendance-records');
    if (savedRecords) {
      try {
        setRecords(JSON.parse(savedRecords));
      } catch (error) {
        console.error('Error parsing saved records:', error);
        setRecords([]);
      }
    }
  }, []);

  // SAVES to localStorage whenever 'records' change
  useEffect(() => {
    localStorage.setItem('attendance-records', JSON.stringify(records));
  }, [records]);

  // NEW: Function to update subject names within the attendance records
  const updateSubjectNameInRecords = (oldName: string, newName: string) => {
    setRecords(prevRecords => {
      // Map over previous records and update the subject name if it matches oldName
      const updated = prevRecords.map(record => {
        if (record.subject === oldName) {
          return { ...record, subject: newName };
        }
        return record;
      });
      console.log(`Updated attendance records for subject: ${oldName} -> ${newName}`);
      return updated;
    });
  };

  const addRecord = (record: AttendanceRecord) => {
    setRecords(prev => {
      // Assuming 'id' is unique for each record, or a combination of date and subject.
      // If 'id' is not provided, generate one.
      const recordId = record.id || `${record.date}-${record.subject}`; // Using a simple unique ID
      const existing = prev.find(r => r.id === recordId); // Find by unique ID

      if (existing) {
        // If a record for this date and subject already exists, update it
        return prev.map(r => r.id === recordId ? { ...r, ...record } : r);
      }
      // Otherwise, add the new record
      return [...prev, { ...record, id: recordId }];
    });
  };

  const updateRecord = (id: string, updates: Partial<AttendanceRecord>) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const getRecordForDateAndSubject = (date: string, subject: string) => {
    return records.find(r => r.date === date && r.subject === subject);
  };

  const calculatePercentage = () => {
    return getOverallPercentage(records);
  };

  const getWeeklyStats = () => calculateWeeklyStats(records);

  const removeRecordsBySubject = (subject: string) => {
    setRecords(prev => prev.filter(r => r.subject !== subject));
  };

  const resetAllRecords = () => {
    setRecords([]);
  };

  return (
    <AttendanceContext.Provider value={{
      records,
      addRecord,
      updateRecord,
      getRecordForDateAndSubject,
      calculatePercentage,
      getWeeklyStats,
      getOverallPercentage: () => getOverallPercentage(records),
      getOverallAttendanceStats: () => getOverallAttendanceStats(records),
      removeRecordsBySubject,
      resetAllRecords,
      updateSubjectNameInRecords // Expose the new function
    }}>
      {children}
    </AttendanceContext.Provider>
  );
};