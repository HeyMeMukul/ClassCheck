// src/pages/Reports.tsx
import React, { useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  endOfMonth,
  startOfMonth,
  eachDayOfInterval,
  format,
  getDay,
} from 'date-fns';
import { useAttendance } from '../contexts/AttendanceContext';
import { useSchedule } from '../contexts/ScheduleContext';

const Reports: React.FC = () => {
  const { user } = useOutletContext<{ user: any }>();
  const { records } = useAttendance();
  const { schedule, hasSchedule } = useSchedule();

  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);

  const getWeekdayName = (date: Date) => {
    const dayIndex = getDay(date);
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return weekdays[dayIndex];
  };

  const stats = useMemo(() => {
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const monthRecords = records.filter(r =>
      new Date(r.date) >= monthStart && new Date(r.date) <= monthEnd
    );

    const attended = monthRecords.filter(r => r.status === 'attended').length;
    const missed = monthRecords.filter(r => r.status === 'missed').length;
    const cancelled = monthRecords.filter(r => r.status === 'cancelled').length;

    const totalPlanned = daysInMonth.reduce((sum, day) => {
      const weekdayName = getWeekdayName(day);
      if (weekdayName === 'Saturday' || weekdayName === 'Sunday') return sum;
      const subjectsForDay = hasSchedule ? schedule[weekdayName as keyof typeof schedule] || [] : [];
      return sum + subjectsForDay.length;
    }, 0);

    const attendanceRate = totalPlanned === 0 ? 100 : Math.round((attended / totalPlanned) * 100);
    return { attended, missed, cancelled, attendanceRate, totalPlanned };
  }, [records, schedule, hasSchedule, monthStart, monthEnd]);

  const subjectStats = useMemo(() => {
    if (!hasSchedule) return [];
    const allSubjects = Object.values(schedule).flat();
    const uniqueSubjects = [...new Set(allSubjects)];

    return uniqueSubjects.map(subject => {
      const subjectRecords = records.filter(r =>
        r.subject === subject && new Date(r.date) >= monthStart && new Date(r.date) <= monthEnd
      );
      const attended = subjectRecords.filter(r => r.status === 'attended').length;
      const missed = subjectRecords.filter(r => r.status === 'missed').length;
      const cancelled = subjectRecords.filter(r => r.status === 'cancelled').length;
      const total = attended + missed + cancelled;
      const rate = total === 0 ? 0 : Math.round((attended / total) * 100);
      return { subject, attended, missed, cancelled, total, rate };
    });
  }, [records, schedule, hasSchedule, monthStart, monthEnd]);

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
    <div className="min-h-screen bg-black px-4 py-6 space-y-8 text-white sm:px-6 md:px-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Attendance Reports</h1>
        <p className="text-sm text-gray-400">Logged in as: {user?.name || 'User'}</p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <input
          type="month"
          value={format(selectedMonth, 'yyyy-MM')}
          onChange={e => setSelectedMonth(new Date(e.target.value + '-01'))}
          className="bg-gray-900 text-white px-4 py-2 rounded-md border border-gray-600 focus:outline-none"
        />
        <span className="text-gray-400 text-sm">Showing {format(monthStart, 'MMMM yyyy')}</span>
      </div>

      {!hasSchedule && (
        <div className="bg-blue-900 p-4 rounded-lg text-sm">
          <p className="text-blue-200">
            📚 No subjects added yet.
            <a href="/subjects" className="underline ml-1 font-medium">Add subjects</a> to view attendance reports.
          </p>
        </div>
      )}

      <div className="bg-gray-900 rounded-xl shadow-md p-5 space-y-6">
        <h2 className="text-lg sm:text-xl font-semibold">Monthly Summary</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Attended" value={stats.attended} color="green" />
          <StatCard label="Missed" value={stats.missed} color="red" />
          <StatCard label="Cancelled" value={stats.cancelled} color="gray" />
          <StatCard label="Attendance Rate" value={`${stats.attendanceRate}%`} color="blue" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-700 text-sm">
          <div>
            <span className="text-gray-400">Total Planned Classes:</span>
            <span className="ml-2 font-semibold">{stats.totalPlanned}</span>
          </div>
          <div>
            <span className="text-gray-400">Classes Recorded:</span>
            <span className="ml-2 font-semibold">
              {stats.attended + stats.missed + stats.cancelled}
            </span>
          </div>
        </div>
      </div>

      {hasSchedule && subjectStats.length > 0 && (
        <div className="bg-gray-900 rounded-xl shadow-md p-5 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h2 className="text-lg sm:text-xl font-semibold">Subject-wise Breakdown</h2>
            <button
              onClick={exportAsCSV}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md text-sm"
            >
              Export CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2 px-3">Subject</th>
                  <th className="text-center py-2 px-3">Attended</th>
                  <th className="text-center py-2 px-3">Missed</th>
                  <th className="text-center py-2 px-3">Cancelled</th>
                  <th className="text-center py-2 px-3">Total</th>
                  <th className="text-center py-2 px-3">Rate</th>
                </tr>
              </thead>
              <tbody>
                {subjectStats.map((stat, index) => (
                  <tr key={index} className="border-b border-gray-800">
                    <td className="py-2 px-3 font-medium">{stat.subject}</td>
                    <td className="py-2 px-3 text-center text-green-400">{stat.attended}</td>
                    <td className="py-2 px-3 text-center text-red-400">{stat.missed}</td>
                    <td className="py-2 px-3 text-center text-gray-400">{stat.cancelled}</td>
                    <td className="py-2 px-3 text-center">{stat.total}</td>
                    <td className="py-2 px-3 text-center">
                      <span className={`font-medium ${
                        stat.rate >= 75 ? 'text-green-400' :
                        stat.rate >= 50 ? 'text-yellow-400' : 'text-red-400'
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

      {hasSchedule && (
        <div className="bg-gray-900 rounded-xl shadow-md p-5 space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold">Weekly Schedule Overview</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-sm">
            {(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const).map(day => (
              <div key={day} className="bg-gray-800 p-3 rounded-lg">
                <h3 className="font-medium text-center mb-2">{day}</h3>
                <div className="space-y-1">
                  {schedule[day].length > 0 ? (
                    schedule[day].map((subject, index) => (
                      <div key={index} className="bg-gray-700 px-3 py-1 rounded text-center">
                        {subject}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-2">No subjects</p>
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

interface StatProps {
  label: string;
  value: string | number;
  color: 'green' | 'red' | 'gray' | 'blue';
}

const StatCard: React.FC<StatProps> = ({ label, value, color }) => (
  <div className={`bg-${color}-900 p-4 rounded-xl text-center`}>
    <h3 className={`text-${color}-200 font-medium mb-1`}>{label}</h3>
    <p className={`text-xl font-bold text-${color}-400`}>{value}</p>
  </div>
);

export default Reports;
