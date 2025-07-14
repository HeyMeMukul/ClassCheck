// src/pages/Reports.tsx
import React, { useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { endOfMonth, startOfMonth, eachDayOfInterval, format, getDay } from 'date-fns';
import { useAttendance } from '../contexts/AttendanceContext';
import { useSchedule } from '../contexts/ScheduleContext';

const Reports: React.FC = () => {
  const { user } = useOutletContext<{ user: any }>();
  const { records } = useAttendance();
  const { schedule, hasSchedule } = useSchedule();

  // Month picker state
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);

  // Helper function to get weekday name
  const getWeekdayName = (date: Date) => {
    const dayIndex = getDay(date);
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return weekdays[dayIndex];
  };

  // Compute monthly statistics
  const stats = useMemo(() => {
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const monthRecords = records.filter(r =>
      new Date(r.date) >= monthStart && new Date(r.date) <= monthEnd
    );

    const attended = monthRecords.filter(r => r.status === 'attended').length;
    const missed = monthRecords.filter(r => r.status === 'missed').length;
    const cancelled = monthRecords.filter(r => r.status === 'cancelled').length;

    // Calculate total planned classes for the month
    const totalPlanned = daysInMonth.reduce((sum, day) => {
      const weekdayName = getWeekdayName(day);
      
      // Only count weekdays (Monday-Friday)
      if (weekdayName === 'Saturday' || weekdayName === 'Sunday') {
        return sum;
      }
      
      // Get subjects for this weekday
      const subjectsForDay = hasSchedule ? 
        schedule[weekdayName as keyof typeof schedule] || [] : [];
      
      return sum + subjectsForDay.length;
    }, 0);

    const attendanceRate = totalPlanned === 0 ? 100 : Math.round((attended / totalPlanned) * 100);

    return { attended, missed, cancelled, attendanceRate, totalPlanned };
  }, [records, schedule, hasSchedule, monthStart, monthEnd]);

  // Get subject-wise statistics
  const subjectStats = useMemo(() => {
    if (!hasSchedule) return [];

    const allSubjects = Object.values(schedule).flat();
    const uniqueSubjects = [...new Set(allSubjects)];

    return uniqueSubjects.map(subject => {
      const subjectRecords = records.filter(r => 
        r.subject === subject &&
        new Date(r.date) >= monthStart && 
        new Date(r.date) <= monthEnd
      );

      const attended = subjectRecords.filter(r => r.status === 'attended').length;
      const missed = subjectRecords.filter(r => r.status === 'missed').length;
      const cancelled = subjectRecords.filter(r => r.status === 'cancelled').length;
      const total = attended + missed + cancelled;
      const rate = total === 0 ? 0 : Math.round((attended / total) * 100);

      return {
        subject,
        attended,
        missed,
        cancelled,
        total,
        rate
      };
    });
  }, [records, schedule, hasSchedule, monthStart, monthEnd]);

  // Export data as CSV (simple client-side)
  const exportAsCSV = () => {
    const csvContent = [
      ['Subject', 'Attended', 'Missed', 'Cancelled', 'Total', 'Attendance Rate'].join(','),
      ...subjectStats.map(stat => 
        [stat.subject, stat.attended, stat.missed, stat.cancelled, stat.total, `${stat.rate}%`].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `attendance-report-${format(selectedMonth, 'yyyy-MM')}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Attendance Reports
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Logged in as: {user?.name || 'User'}
        </p>
      </div>

      {/* Month selector */}
      <div className="flex items-center gap-2">
        <input
          type="month"
          value={format(selectedMonth, 'yyyy-MM')}
          onChange={e => setSelectedMonth(new Date(e.target.value + '-01'))}
          className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-1 rounded-md focus:outline-none border border-gray-300 dark:border-gray-600"
        />
        <span className="text-gray-600 dark:text-gray-400 text-sm">
          Showing {format(monthStart, 'MMMM yyyy')}
        </span>
      </div>

      {/* No schedule message */}
      {!hasSchedule && (
        <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
          <p className="text-blue-800 dark:text-blue-200">
            📚 No subjects added yet. 
            <a href="/subjects" className="underline ml-1 font-medium">Add subjects</a> to view attendance reports.
          </p>
        </div>
      )}

      {/* Monthly summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Monthly Summary
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            label="Classes Attended"
            value={stats.attended}
            color="green"
          />
          <StatCard
            label="Classes Missed"
            value={stats.missed}
            color="red"
          />
          <StatCard
            label="Cancelled"
            value={stats.cancelled}
            color="gray"
          />
          <StatCard
            label="Attendance Rate"
            value={`${stats.attendanceRate}%`}
            color="blue"
          />
        </div>

        {/* Additional stats */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Total Planned Classes:</span>
              <span className="ml-2 font-semibold text-gray-900 dark:text-white">{stats.totalPlanned}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Classes Recorded:</span>
              <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                {stats.attended + stats.missed + stats.cancelled}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Subject-wise breakdown */}
      {hasSchedule && subjectStats.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Subject-wise Breakdown
            </h2>
            <button
              onClick={exportAsCSV}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded text-sm"
            >
              Export as CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2 px-3 font-medium text-gray-900 dark:text-white">Subject</th>
                  <th className="text-center py-2 px-3 font-medium text-gray-900 dark:text-white">Attended</th>
                  <th className="text-center py-2 px-3 font-medium text-gray-900 dark:text-white">Missed</th>
                  <th className="text-center py-2 px-3 font-medium text-gray-900 dark:text-white">Cancelled</th>
                  <th className="text-center py-2 px-3 font-medium text-gray-900 dark:text-white">Total</th>
                  <th className="text-center py-2 px-3 font-medium text-gray-900 dark:text-white">Rate</th>
                </tr>
              </thead>
              <tbody>
                {subjectStats.map((stat, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                    <td className="py-2 px-3 text-gray-900 dark:text-white font-medium">{stat.subject}</td>
                    <td className="py-2 px-3 text-center text-green-600 dark:text-green-400">{stat.attended}</td>
                    <td className="py-2 px-3 text-center text-red-600 dark:text-red-400">{stat.missed}</td>
                    <td className="py-2 px-3 text-center text-gray-600 dark:text-gray-400">{stat.cancelled}</td>
                    <td className="py-2 px-3 text-center text-gray-900 dark:text-white">{stat.total}</td>
                    <td className="py-2 px-3 text-center">
                      <span className={`font-medium ${
                        stat.rate >= 75 ? 'text-green-600 dark:text-green-400' :
                        stat.rate >= 50 ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-red-600 dark:text-red-400'
                      }`}>
                        {stat.rate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Weekly schedule overview */}
      {hasSchedule && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Weekly Schedule Overview
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const).map(day => (
              <div key={day} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2 text-center">{day}</h3>
                <div className="space-y-1">
                  {schedule[day].length > 0 ? (
                    schedule[day].map((subject, index) => (
                      <div key={index} className="bg-white dark:bg-gray-600 p-2 rounded text-sm text-center">
                        <span className="text-gray-900 dark:text-white">{subject}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm text-center py-2">No subjects</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* Helper Stat Card Component */
interface StatProps {
  label: string;
  value: string | number;
  color: 'green' | 'red' | 'gray' | 'blue';
}

const StatCard: React.FC<StatProps> = ({ label, value, color }) => (
  <div className={`bg-${color}-100 dark:bg-${color}-900 p-4 rounded-lg`}>
    <h3 className={`font-semibold text-${color}-800 dark:text-${color}-200`}>
      {label}
    </h3>
    <p className={`text-2xl font-bold text-${color}-600 dark:text-${color}-400`}>
      {value}
    </p>
  </div>
);

export default Reports;
