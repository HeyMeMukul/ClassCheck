import React, { useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { endOfMonth, startOfMonth, eachDayOfInterval, format, getDay } from 'date-fns';
import { useAttendance } from '../contexts/AttendanceContext';
import { useSchedule } from '../contexts/ScheduleContext';

const Reports: React.FC = () => {
  const { user } = useAuth();
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
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
            📊 Attendance Reports
          </h1>
          <p className="text-sm sm:text-base text-gray-400">
            Logged in as: <span className="font-medium">{user?.name || 'User'}</span>
          </p>
        </div>

        {/* Month Selector */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <input
            type="month"
            value={format(selectedMonth, 'yyyy-MM')}
            onChange={e => setSelectedMonth(new Date(e.target.value + '-01'))}
            className="w-full sm:w-auto bg-gray-800 text-white border border-gray-600 px-3 sm:px-4 py-2 sm:py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
          />
          <span className="text-gray-400 text-sm sm:text-base">
            Showing <span className="font-medium">{format(monthStart, 'MMMM yyyy')}</span>
          </span>
        </div>

        {/* No Schedule Warning */}
        {!hasSchedule && (
          <div className="p-4 sm:p-6 bg-blue-900/20 border border-blue-700 rounded-xl">
            <p className="text-blue-200 text-sm sm:text-base">
              📚 No subjects added yet. 
              <a href="/subjects" className="underline font-medium hover:text-blue-100 ml-1">
                Add subjects
              </a> to view attendance reports.
            </p>
          </div>
        )}

        {/* Monthly Summary */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-6">
            Monthly Summary
          </h2>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <StatCard 
              label="Classes Attended" 
              value={stats.attended} 
              icon="✅"
              colorClass="text-green-400"
              bgClass="bg-green-900/20 border-green-700"
            />
            <StatCard 
              label="Classes Missed" 
              value={stats.missed} 
              icon="❌"
              colorClass="text-red-400"
              bgClass="bg-red-900/20 border-red-700"
            />
            <StatCard 
              label="Classes Cancelled" 
              value={stats.cancelled} 
              icon="⚪"
              colorClass="text-gray-400"
              bgClass="bg-gray-700/20 border-gray-600"
            />
            <StatCard 
              label="Attendance Rate" 
              value={`${stats.attendanceRate}%`} 
              icon="📈"
              colorClass={stats.attendanceRate >= 75 ? "text-green-400" : "text-red-400"}
              bgClass={stats.attendanceRate >= 75 ? "bg-green-900/20 border-green-700" : "bg-red-900/20 border-red-700"}
            />
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-4 sm:pt-6 border-t border-gray-700">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <span className="text-gray-400 text-sm sm:text-base">Total Planned Classes:</span>
              <span className="font-bold text-white text-lg sm:text-xl">{stats.totalPlanned}</span>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <span className="text-gray-400 text-sm sm:text-base">Classes Recorded:</span>
              <span className="font-bold text-white text-lg sm:text-xl">
                {stats.attended + stats.missed + stats.cancelled}
              </span>
            </div>
          </div>
        </div>

        {/* Subject-wise Breakdown */}
        {hasSchedule && subjectStats.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-6">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold">
                📚 Subject-wise Breakdown
              </h2>
              <button
                onClick={exportAsCSV}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base font-medium rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                💾 Export as CSV
              </button>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-700">
              <table className="min-w-full text-sm sm:text-base">
                <thead className="bg-gray-800 border-b border-gray-700">
                  <tr>
                    <th className="text-left px-3 sm:px-4 lg:px-6 py-3 sm:py-4 font-semibold text-gray-200">
                      Subject
                    </th>
                    <th className="text-center px-3 sm:px-4 lg:px-6 py-3 sm:py-4 font-semibold text-gray-200">
                      Attended
                    </th>
                    <th className="text-center px-3 sm:px-4 lg:px-6 py-3 sm:py-4 font-semibold text-gray-200">
                      Missed
                    </th>
                    <th className="text-center px-3 sm:px-4 lg:px-6 py-3 sm:py-4 font-semibold text-gray-200">
                      Cancelled
                    </th>
                    <th className="text-center px-3 sm:px-4 lg:px-6 py-3 sm:py-4 font-semibold text-gray-200">
                      Total
                    </th>
                    <th className="text-center px-3 sm:px-4 lg:px-6 py-3 sm:py-4 font-semibold text-gray-200">
                      Rate
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {subjectStats.map((stat, index) => (
                    <tr 
                      key={index} 
                      className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors duration-150"
                    >
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 font-medium text-white break-words">
                        {stat.subject}
                      </td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-center text-green-400 font-medium">
                        {stat.attended}
                      </td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-center text-red-400 font-medium">
                        {stat.missed}
                      </td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-center text-gray-400 font-medium">
                        {stat.cancelled}
                      </td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-center text-white font-medium">
                        {stat.total}
                      </td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-center font-bold">
                        <span className={`px-2 py-1 rounded-full text-xs sm:text-sm ${
                          stat.rate >= 75 
                            ? 'bg-green-900/50 text-green-400 border border-green-700' 
                            : stat.rate >= 50 
                            ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-700' 
                            : 'bg-red-900/50 text-red-400 border border-red-700'
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

        {/* Weekly Schedule Overview */}
        {hasSchedule && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-6">
              🗓️ Weekly Schedule Overview
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
              {(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const).map(day => (
                <div key={day} className="bg-gray-800 border border-gray-700 rounded-xl p-3 sm:p-4 lg:p-5 shadow-lg hover:shadow-xl transition-shadow duration-200">
                  <h3 className="text-center font-bold text-white mb-2 sm:mb-3 text-sm sm:text-base lg:text-lg">
                    {day}
                  </h3>
                  <div className="space-y-1 sm:space-y-2">
                    {schedule[day].length > 0 ? (
                      schedule[day].map((subject, idx) => (
                        <div
                          key={idx}
                          className="bg-gray-700 text-center text-xs sm:text-sm text-white px-2 sm:px-3 py-1 sm:py-2 rounded-md break-words hover:bg-gray-600 transition-colors duration-150"
                        >
                          {subject}
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-400 text-center text-xs sm:text-sm py-3 sm:py-4 italic">
                        No subjects
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* Enhanced StatCard Component */
interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  colorClass: string;
  bgClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, colorClass, bgClass }) => (
  <div className={`${bgClass} border rounded-xl p-4 sm:p-6 text-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105`}>
    <div className="text-2xl sm:text-3xl lg:text-4xl mb-2 sm:mb-3">{icon}</div>
    <div className="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2 font-medium">
      {label}
    </div>
    <div className={`text-xl sm:text-2xl lg:text-3xl font-bold ${colorClass}`}>
      {value}
    </div>
  </div>
);

export default Reports;
