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
    <div className="bg-gray-900 text-white rounded-2xl shadow-xl p-6">
      <h2 className="text-2xl font-semibold mb-6">
        📖 Classes for {format(selectedDateObj, 'PPP')}
      </h2>

      {!hasSchedule ? (
        <div className="text-center py-10">
          <div className="text-6xl mb-3">📚</div>
          <p className="text-gray-400 mb-4">No subjects added yet.</p>
          <a
            href="/subjects"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium"
          >
            Add Subjects
          </a>
        </div>
      ) : !isWeekday ? (
        <div className="text-center py-10">
          <div className="text-6xl mb-3">🎉</div>
          <p className="text-gray-400">
            It’s {dayName}! No classes scheduled — enjoy your weekend!
          </p>
        </div>
      ) : todaysSubjects.length === 0 ? (
        <div className="text-center py-10">
          <div className="text-6xl mb-3">☀️</div>
          <p className="text-gray-400 mb-2">
            No classes scheduled for {dayName}.
          </p>
          <a
            href="/subjects"
            className="text-blue-400 hover:text-blue-500 underline font-medium"
          >
            Add subjects for {dayName}
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {todaysSubjects.map((subject, index) => {
            const status = getAttendanceStatus(subject);

            return (
              <div
                key={`${subject}-${index}`}
                className="bg-gray-800 border border-gray-700 rounded-xl p-4 transition-shadow hover:shadow-md"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-white">{subject}</h3>
                    <p className="text-sm text-gray-400">
                      {dayName} • Class {index + 1}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
                    {status === 'none' ? 'Not marked' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleAttendanceChange(subject, 'attended')}
                    className={`px-4 py-1 rounded text-sm font-medium transition ${
                      status === 'attended'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-green-700'
                    }`}
                  >
                    ✅ Attended
                  </button>
                  <button
                    onClick={() => handleAttendanceChange(subject, 'missed')}
                    className={`px-4 py-1 rounded text-sm font-medium transition ${
                      status === 'missed'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-red-700'
                    }`}
                  >
                    ❌ Missed
                  </button>
                  <button
                    onClick={() => handleAttendanceChange(subject, 'cancelled')}
                    className={`px-4 py-1 rounded text-sm font-medium transition ${
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
