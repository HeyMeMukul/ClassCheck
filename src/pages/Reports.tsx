import React, { useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { endOfMonth, startOfMonth, eachDayOfInterval, format, getDay } from 'date-fns';
import { useAttendance } from '../contexts/AttendanceContext';
import { useSchedule, Subject } from '../contexts/ScheduleContext';
import { motion } from 'framer-motion';

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
    const allSubjects: Subject[] = Object.values(schedule).flat();
    const uniqueSubjects: Subject[] = allSubjects.filter(
      (s, idx, arr) => arr.findIndex(ss => ss.name === s.name) === idx
    );
    return uniqueSubjects.map(subject => {
      const subjectRecords = records.filter(r =>
        r.subject === subject.name && new Date(r.date) >= monthStart && new Date(r.date) <= monthEnd
      );
      const attended = subjectRecords.filter(r => r.status === 'attended').length;
      const missed = subjectRecords.filter(r => r.status === 'missed').length;
      const cancelled = subjectRecords.filter(r => r.status === 'cancelled').length;
      const total = attended + missed; // exclude cancelled
      const rate = total === 0 ? 100 : Math.round((attended / total) * 100);
      return { subject: subject.name, isLab: subject.isLab, attended, missed, cancelled, total, rate };
    });
  }, [records, schedule, hasSchedule, monthStart, monthEnd]);

  const classSubjectStats = subjectStats.filter(s => false ? s.isLab : !s.isLab);
  const labSubjectStats = subjectStats.filter(s => true ? s.isLab : !s.isLab);
  const exportAsCSV = () => {
    const csvContent = [
      ['Subject', 'Attended', 'Missed', 'Cancelled', 'Total', 'Attendance Rate'].join(','),
      ...subjectStats.map(stat =>
        [stat.subject, stat.attended, stat.missed, stat.cancelled, stat.attended+ stat.missed+ stat.cancelled, `${stat.rate}%`].join(',')
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
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        {/* Header */}
                <div></div>
        <br></br>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
            📊 Attendance Reports
          </h1>
          <p className="text-sm sm:text-base text-neutral-400">
            Logged in as: <span className="font-medium">{user?.name || 'User'}</span>
          </p>
        </div>

        {/* Month Selector */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <input
            type="month"
            value={format(selectedMonth, 'yyyy-MM')}
            onChange={e => setSelectedMonth(new Date(e.target.value + '-01'))}
            className="w-full sm:w-auto bg-neutral-800 text-white border border-neutral-600 px-3 sm:px-4 py-2 sm:py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
          />
          <span className="text-neutral-400 text-sm sm:text-base">
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

        

        {/* Class-wise Breakdown */}
        {hasSchedule && subjectStats.length > 0 && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-6">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold">
                📚 Class-wise Breakdown
              </h2>
              <button
                onClick={exportAsCSV}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base font-medium rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                💾 Export as CSV
              </button>
            </div>

            <div className="overflow-x-auto rounded-lg border border-neutral-700">
              <table className="min-w-full text-sm sm:text-base">
                <thead className="bg-neutral-800 border-b border-neutral-700">
                  <tr>
                    <th className="text-left px-3 sm:px-4 lg:px-6 py-3 sm:py-4 font-semibold text-neutral-200">
                      Subject
                    </th>
                    <th className="text-center px-3 sm:px-4 lg:px-6 py-3 sm:py-4 font-semibold text-neutral-200">
                      Attended
                    </th>
                    <th className="text-center px-3 sm:px-4 lg:px-6 py-3 sm:py-4 font-semibold text-neutral-200">
                      Missed
                    </th>
                    <th className="text-center px-3 sm:px-4 lg:px-6 py-3 sm:py-4 font-semibold text-neutral-200">
                      Cancelled
                    </th>
                    <th className="text-center px-3 sm:px-4 lg:px-6 py-3 sm:py-4 font-semibold text-neutral-200">
                      Total
                    </th>
                    <th className="text-center px-3 sm:px-4 lg:px-6 py-3 sm:py-4 font-semibold text-neutral-200">
                      Rate
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {classSubjectStats.map((stat, index) => (
                    <tr 
                      key={index} 
                      className="border-b border-neutral-700 hover:bg-neutral-800/50 transition-colors duration-150"
                    >
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 font-medium text-white break-words">
                        {stat.subject}
                      </td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-center text-green-600 font-medium">
                        {stat.attended}
                      </td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-center text-red-227 font-medium">
                        {stat.missed}
                      </td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-center text-neutral-400 font-medium">
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
        {/* Lab-wise Breakdown */}
        {hasSchedule && subjectStats.length > 0 && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-6">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold">
                📚 Lab-wise Breakdown
              </h2>
              <button
                onClick={exportAsCSV}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base font-medium rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                💾 Export as CSV
              </button>
            </div>

            <div className="overflow-x-auto rounded-lg border border-neutral-700">
              <table className="min-w-full text-sm sm:text-base">
                <thead className="bg-neutral-800 border-b border-neutral-700">
                  <tr>
                    <th className="text-left px-3 sm:px-4 lg:px-6 py-3 sm:py-4 font-semibold text-neutral-200">
                      Subject
                    </th>
                    <th className="text-center px-3 sm:px-4 lg:px-6 py-3 sm:py-4 font-semibold text-neutral-200">
                      Attended
                    </th>
                    <th className="text-center px-3 sm:px-4 lg:px-6 py-3 sm:py-4 font-semibold text-neutral-200">
                      Missed
                    </th>
                    <th className="text-center px-3 sm:px-4 lg:px-6 py-3 sm:py-4 font-semibold text-neutral-200">
                      Cancelled
                    </th>
                    <th className="text-center px-3 sm:px-4 lg:px-6 py-3 sm:py-4 font-semibold text-neutral-200">
                      Total
                    </th>
                    <th className="text-center px-3 sm:px-4 lg:px-6 py-3 sm:py-4 font-semibold text-neutral-200">
                      Rate
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {labSubjectStats.map((stat, index) => (
                    <tr 
                      key={index} 
                      className="border-b border-neutral-700 hover:bg-neutral-800/50 transition-colors duration-150"
                    >
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 font-medium text-white break-words">
                        {stat.subject}
                      </td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-center text-green-600 font-medium">
                        {stat.attended}
                      </td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-center text-red-227 font-medium">
                        {stat.missed}
                      </td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-center text-neutral-400 font-medium">
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

        
      </motion.div>
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
    <div className="text-xs sm:text-sm text-neutral-400 mb-1 sm:mb-2 font-medium">
      {label}
    </div>
    <div className={`text-xl sm:text-2xl lg:text-3xl font-bold ${colorClass}`}>
      {value}
    </div>
  </div>
);

export default Reports;
