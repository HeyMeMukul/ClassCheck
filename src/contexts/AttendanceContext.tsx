// Update src/contexts/AttendanceContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getOverallPercentage, getOverallAttendanceStats } from '../utils/attendanceUtils';
import { AttendanceRecord } from '../types/attendance';
import { getWeeklyStats as calculateWeeklyStats } from '../utils/attendanceUtils';
// Context code...


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
  const removeRecordsBySubject = (subject: string) => {
    setRecords(prev => prev.filter(r => r.subject !== subject));
  };
  
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

  const addRecord = (record: AttendanceRecord) => {
    setRecords(prev => {
      const existing = prev.find(r => r.date === record.date && r.subject === record.subject);
      if (existing) {
        return prev.map(r => r.id === existing.id ? { ...r, ...record } : r);
      }
      return [...prev, { ...record, id: record.id || Date.now().toString() }];
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
      removeRecordsBySubject
    }}>
      {children}
    </AttendanceContext.Provider>
  );
};
