// src/components/Calendar.tsx
import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, getDay } from 'date-fns';
import { useCalendar } from '../contexts/CalendarContext';
import { useSchedule } from '../contexts/ScheduleContext';
import { useAttendance } from '../contexts/AttendanceContext';

const Calendar: React.FC = () => {
  const { selectedDate, setSelectedDate, currentMonth, setCurrentMonth } = useCalendar();
  const { getSubjectsForDay, hasSchedule } = useSchedule();
  const { records } = useAttendance();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // --- Fix: Calculate how many empty cells before the first day of the month
  const firstDayIndex = getDay(monthStart); // 0=Sunday, 1=Monday, ..., 6=Saturday

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const handleDateClick = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    setSelectedDate(dateString);
  };

  const getWeekdayName = (date: Date) => {
    const dayIndex = getDay(date); // 0 = Sunday, 1 = Monday, etc.
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return weekdays[dayIndex];
  };

  const getDayStatus = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const weekdayName = getWeekdayName(date);

    if (!hasSchedule) {
      return { type: 'no-schedule', color: 'bg-gray-300 dark:bg-gray-600', count: 0 };
    }
    if (weekdayName === 'Saturday' || weekdayName === 'Sunday') {
      return { type: 'weekend', color: 'bg-yellow-400 dark:bg-yellow-600', count: 0 };
    }
    const subjects = getSubjectsForDay(weekdayName as keyof import('../contexts/ScheduleContext').WeeklySchedule);
    if (subjects.length === 0) {
      return { type: 'no-classes', color: 'bg-gray-300 dark:bg-gray-600', count: 0 };
    }
    const dayRecords = records.filter(r => r.date === dateString);
    if (dayRecords.length === 0) {
      return { type: 'pending', color: 'bg-blue-400 dark:bg-blue-500', count: subjects.length };
    }
    const attended = dayRecords.filter(r => r.status === 'attended').length;
    const missed = dayRecords.filter(r => r.status === 'missed').length;
    const cancelled = dayRecords.filter(r => r.status === 'cancelled').length;
    if (attended > 0 && missed === 0) {
      return { type: 'attended', color: 'bg-green-500 dark:bg-green-600', count: subjects.length };
    }
    if (missed > 0 && attended === 0) {
      return { type: 'missed', color: 'bg-red-500 dark:bg-red-600', count: subjects.length };
    }
    if (cancelled > 0 && attended === 0 && missed === 0) {
      return { type: 'cancelled', color: 'bg-gray-500 dark:bg-gray-600', count: subjects.length };
    }
    return { type: 'mixed', color: 'bg-yellow-500 dark:bg-yellow-600', count: subjects.length };
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => navigateMonth('prev')}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
          >
            ←
          </button>
          <button 
            onClick={() => navigateMonth('next')}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
          >
            →
          </button>
        </div>
      </div>

      {/* Show schedule prompt if no schedule */}
      {!hasSchedule && (
        <div className="mb-4 p-4 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <p className="text-blue-800 dark:text-blue-200 text-center">
            📅 No subjects added yet. 
            <a href="/subjects" className="underline ml-1 font-medium">Add subjects</a> to get started!
          </p>
        </div>
      )}

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* --- Add empty cells before the first day of the month --- */}
        {Array.from({ length: firstDayIndex }).map((_, idx) => (
          <div key={`empty-${idx}`} />
        ))}

        {/* --- Render actual days --- */}
        {daysInMonth.map(day => {
          const status = getDayStatus(day);
          const isSelected = selectedDate && isSameDay(day, new Date(selectedDate));
          const isCurrentDay = isToday(day);

          return (
            <button
              key={day.toISOString()}
              onClick={() => handleDateClick(day)}
              className={`
                aspect-square flex flex-col items-center justify-center text-sm rounded-lg transition-all duration-200
                ${status.color}
                ${isSelected ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}
                ${isCurrentDay ? 'ring-2 ring-blue-300 dark:ring-blue-500' : ''}
                hover:opacity-80 text-white relative
              `}
            >
              <span className="font-medium">{format(day, 'd')}</span>
              {status.count > 0 && (
                <span className="text-xs opacity-75">{status.count}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-gray-700 dark:text-gray-300">Attended</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span className="text-gray-700 dark:text-gray-300">Missed</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-400 rounded"></div>
          <span className="text-gray-700 dark:text-gray-300">Pending</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-yellow-400 rounded"></div>
          <span className="text-gray-700 dark:text-gray-300">Weekend</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-gray-400 rounded"></div>
          <span className="text-gray-700 dark:text-gray-300">No Classes</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
