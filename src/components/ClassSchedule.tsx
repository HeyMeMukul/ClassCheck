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
  const dayIndex = getDay(selectedDateObj);
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = weekdays[dayIndex];

  const isWeekday = dayName !== 'Saturday' && dayName !== 'Sunday';
  const todaysSubjects = isWeekday && hasSchedule
    ? getSubjectsForDay(dayName as keyof import('../contexts/ScheduleContext').WeeklySchedule)
    : [];

  const handleAttendanceChange = (subject: string, status: 'attended' | 'missed' | 'cancelled') => {
    const record = {
      id: `${selectedDate}-${subject}`,
      date: selectedDate,
      subject,
      status,
      userId: 'current-user',
    };
    addRecord(record);
  };

  const getAttendanceStatus = (subject: string) => {
    const record = getRecordForDateAndSubject(selectedDate, subject);
    return record?.status || 'none';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'attended': return 'bg-green-600 text-white';
      case 'missed': return 'bg-red-600 text-white';
      case 'cancelled': return 'bg-gray-500 text-white';
      default: return 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="bg-neutral-900 text-white rounded-2xl shadow-xl p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
        <span className="hidden sm:inline">📖 Classes for {format(selectedDateObj, 'PPP')}</span>
        <span className="sm:hidden">📖 {format(selectedDateObj, 'MMM d, yyyy')}</span>
      </h2>

      {!hasSchedule ? (
        <div className="text-center py-8 sm:py-10">
          <div className="text-4xl sm:text-6xl mb-3">📚</div>
          <p className="text-gray-400 mb-4 text-sm sm:text-base">No subjects added yet.</p>
          <a
            href="/subjects"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium text-sm sm:text-base"
          >
            Add Subjects
          </a>
        </div>
      ) : !isWeekday ? (
        <div className="text-center py-8 sm:py-10">
          <div className="text-4xl sm:text-6xl mb-3">🎉</div>
          <p className="text-gray-400 text-sm sm:text-base">
            It's {dayName}! No classes scheduled — enjoy your weekend!
          </p>
        </div>
      ) : todaysSubjects.length === 0 ? (
        <div className="text-center py-8 sm:py-10">
          <div className="text-4xl sm:text-6xl mb-3">☀️</div>
          <p className="text-gray-400 mb-2 text-sm sm:text-base">
            No classes scheduled for {dayName}.
          </p>
          <a
            href="/subjects"
            className="text-blue-400 hover:text-blue-500 underline font-medium text-sm sm:text-base"
          >
            Add subjects for {dayName}
          </a>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {todaysSubjects.map((subject, index) => {
            const status = getAttendanceStatus(subject);

            return (
              <div
                key={`${subject}-${index}`}
                className="bg-gray-800 border border-gray-700 rounded-xl p-3 sm:p-4 transition-shadow hover:shadow-md"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-sm sm:text-base">{subject}</h3>
                    <p className="text-xs sm:text-sm text-gray-400">
                      {dayName} • Class {index + 1}
                    </p>
                  </div>
                  <div className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(status)}`}>
                    {status === 'none' ? 'Not marked' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => handleAttendanceChange(subject, 'attended')}
                    className={`flex-1 px-3 sm:px-4 py-2 rounded text-xs sm:text-sm font-medium transition ${
                      status === 'attended'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-green-700'
                    }`}
                  >
                    ✅ Attended
                  </button>
                  <button
                    onClick={() => handleAttendanceChange(subject, 'missed')}
                    className={`flex-1 px-3 sm:px-4 py-2 rounded text-xs sm:text-sm font-medium transition ${
                      status === 'missed'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-red-700'
                    }`}
                  >
                    ❌ Missed
                  </button>
                  <button
                    onClick={() => handleAttendanceChange(subject, 'cancelled')}
                    className={`flex-1 px-3 sm:px-4 py-2 rounded text-xs sm:text-sm font-medium transition ${
                      status === 'cancelled'
                        ? 'bg-gray-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
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
