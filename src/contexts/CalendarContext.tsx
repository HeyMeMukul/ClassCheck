import React, { createContext, useContext, useState, ReactNode } from 'react';

// Context shape
interface CalendarContextType {
  selectedDate: string; // 'YYYY-MM-DD'
  setSelectedDate: (date: string) => void;
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
}

// Create context
const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

// Hook for easy usage
export const useCalendar = () => {
  const ctx = useContext(CalendarContext);
  if (!ctx) throw new Error('useCalendar must be used within a CalendarProvider');
  return ctx;
};

// Provider
export const CalendarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Default to today
  const todayStr = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  return (
    <CalendarContext.Provider
      value={{ selectedDate, setSelectedDate, currentMonth, setCurrentMonth }}
    >
      {children}
    </CalendarContext.Provider>
  );
};
