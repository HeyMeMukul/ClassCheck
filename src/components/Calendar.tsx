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

  const firstDayIndex = getDay(monthStart);

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentMonth(newMonth);
  };

  const handleDateClick = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    setSelectedDate(dateString);
  };

  const getWeekdayName = (date: Date) => {
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][getDay(date)];
  };

  const getDayStatus = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const weekdayName = getWeekdayName(date);

    if (!hasSchedule) {
      return { type: 'no-schedule', color: 'bg-neutral-700', count: 0 };
    }
    if (weekdayName === 'Saturday' || weekdayName === 'Sunday') {
      return { type: 'weekend', color: 'bg-yellow-500', count: 0 };
    }

    const subjects = getSubjectsForDay(weekdayName as keyof import('../contexts/ScheduleContext').WeeklySchedule);
    const totalSubjects = subjects.length;

    if (totalSubjects === 0) {
      return { type: 'no-classes', color: 'bg-gray-600', count: 0 };
    }

    const dayRecords = records.filter(r => r.date === dateString);
    const attended = dayRecords.filter(r => r.status === 'attended').length;
    const missed = dayRecords.filter(r => r.status === 'missed').length;
    const cancelled = dayRecords.filter(r => r.status === 'cancelled').length;

    if (attended > 0 && missed === 0) return { type: 'attended', color: 'bg-green-600', count: totalSubjects };
    if (missed > 0 && attended === 0) return { type: 'missed', color: 'bg-red-600', count: totalSubjects };
    if (cancelled > 0 && attended === 0 && missed === 0) return { type: 'cancelled', color: 'bg-gray-400', count: totalSubjects };

    return { type: 'mixed', color: 'bg-yellow-600', count: totalSubjects };
  };

  return (
    <div className="bg-neutral-900 rounded-2xl p-4 sm:p-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-white">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="px-3 py-1 rounded bg-gray-700 text-white hover:bg-gray-600 transition text-sm sm:text-base"
          >
            ←
          </button>
          <button
            onClick={() => navigateMonth('next')}
            className="px-3 py-1 rounded bg-gray-700 text-white hover:bg-gray-600 transition text-sm sm:text-base"
          >
            →
          </button>
        </div>
      </div>

      {/* No schedule prompt */}
      {!hasSchedule && (
        <div className="mb-5 p-4 bg-neutral-800 rounded-lg text-center text-blue-300">
          <p className="text-sm sm:text-base">
            📅 No subjects added yet. <a href="/subjects" className="underline text-blue-200">Add subjects</a> to get started!
          </p>
        </div>
      )}

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-1 mb-3">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-xs sm:text-sm text-neutral-200 font-medium py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-2 ">
        {Array.from({ length: firstDayIndex }).map((_, i) => <div key={`empty-${i}`} />)}

        {daysInMonth.map(day => {
          const status = getDayStatus(day);
          const isSelected = selectedDate && isSameDay(day, new Date(selectedDate));
          const isCurrentDay = isToday(day);

          return (
            <button
              key={day.toISOString()}
              onClick={() => handleDateClick(day)}
              className={`
                flex flex-col items-center justify-center aspect-square rounded-lg text-xs sm:text-sm font-semibold transition
                ${status.color} text-white hover:opacity-90
                ${isCurrentDay ? 'ring-2 ring-blue-400' : ''}
                ${isSelected ? 'ring-2 ring-cyan-400' : ''}
                min-h-[2.5rem] sm:min-h-[3rem]
              `}
            >
              <span>{format(day, 'd')}</span>
              {status.count > 0 && <span className="text-[10px] sm:text-xs font-normal">{status.count}</span>}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 sm:mt-6 flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-300">
        {[
          ['bg-green-600', 'Attended'],
          ['bg-red-600', 'Missed'],
          ['bg-blue-500', 'Pending'],
          ['bg-yellow-500', 'Weekend'],
          ['bg-gray-600', 'No Classes']
        ].map(([color, label]) => (
          <div key={label} className="flex items-center gap-1 sm:gap-2">
            <div className={`w-3 h-3 rounded ${color}`} />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
