// src/components/ClassSchedule.tsx
import React from 'react';
import { format, getDay } from 'date-fns';
import { useCalendar } from '../contexts/CalendarContext';
import { useSchedule } from '../contexts/ScheduleContext';
import { useAttendance } from '../contexts/AttendanceContext';

const ClassSchedule: React.FC = () => {
  const { selectedDate } = useCalendar();
  const { getSubjectsForDay, hasSchedule } = useSchedule();
  const { getRecordForDateAndSubject, addRecord } = useAttendance();

  const selectedDateObj = new Date(selectedDate);
  const dayIndex = getDay(selectedDateObj); // 0 = Sunday, 1 = Monday, etc.
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = weekdays[dayIndex];
  
  // Get subjects for the selected day (only for weekdays)
  const isWeekday = dayName !== 'Saturday' && dayName !== 'Sunday';
  const todaysSubjects = isWeekday && hasSchedule ? 
    getSubjectsForDay(dayName as keyof import('../contexts/ScheduleContext').WeeklySchedule) : [];

  const handleAttendanceChange = (subject: string, status: 'attended' | 'missed' | 'cancelled') => {
    const record = {
      id: `${selectedDate}-${subject}`,
      date: selectedDate,
      subject,
      status,
      userId: 'current-user'
    };
    
    addRecord(record);
  };

  const getAttendanceStatus = (subject: string) => {
    const record = getRecordForDateAndSubject(selectedDate, subject);
    return record?.status || 'none';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'attended': return 'bg-green-500 text-white';
      case 'missed': return 'bg-red-500 text-white';
      case 'cancelled': return 'bg-gray-500 text-white';
      default: return 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Classes for {format(selectedDateObj, 'PPP')}
      </h2>
      
      {!hasSchedule ? (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">📚</div>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No subjects added yet
          </p>
          <a 
            href="/subjects" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
          >
            Add Subjects
          </a>
        </div>
      ) : !isWeekday ? (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🎉</div>
          <p className="text-gray-500 dark:text-gray-400">
            It's {dayName}! No classes scheduled - enjoy your weekend!
          </p>
        </div>
      ) : todaysSubjects.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">☀️</div>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No classes scheduled for {dayName}
          </p>
          <a 
            href="/subjects" 
            className="text-blue-600 hover:text-blue-700 underline"
          >
            Add subjects for {dayName}
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {todaysSubjects.map((subject, index) => {
            const status = getAttendanceStatus(subject);
            
            return (
              <div key={`${subject}-${index}`} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{subject}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {dayName} • Class {index + 1}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
                    {status === 'none' ? 'Not marked' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAttendanceChange(subject, 'attended')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      status === 'attended' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-800'
                    }`}
                  >
                    ✅ Attended
                  </button>
                  <button
                    onClick={() => handleAttendanceChange(subject, 'missed')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      status === 'missed' 
                        ? 'bg-red-600 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-800'
                    }`}
                  >
                    ❌ Missed
                  </button>
                  <button
                    onClick={() => handleAttendanceChange(subject, 'cancelled')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      status === 'cancelled' 
                        ? 'bg-gray-600 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600'
                    }`}
                  >
                    ⚪ Cancelled
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ClassSchedule;
