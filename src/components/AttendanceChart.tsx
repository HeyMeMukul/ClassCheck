import React, { useState } from 'react';
import { useAttendance } from '../contexts/AttendanceContext';
import { getOverallAttendanceStats } from '../utils/attendanceUtils';
import { useSchedule } from '../contexts/ScheduleContext';

const AttendanceChart: React.FC = () => {
  const { records } = useAttendance();
  const { schedule } = useSchedule();

  // UI state: 'class' or 'lab'
  const [view, setView] = useState<'class' | 'lab'>('class');

  // Get all unique subjects
  const allSubjects = Object.values(schedule).flat();
  const classSubjects = allSubjects.filter(s => !s.isLab);
  const labSubjects = allSubjects.filter(s => s.isLab);
  const classSubjectNames = Array.from(new Set(classSubjects.map(s => s.name)));
  const labSubjectNames = Array.from(new Set(labSubjects.map(s => s.name)));

  // Filter records
  const classRecords = records.filter(r => classSubjectNames.includes(r.subject));
  const labRecords = records.filter(r => labSubjectNames.includes(r.subject));

  // Pick stats based on view
  const stats = view === 'class'
    ? getOverallAttendanceStats(classRecords)
    : getOverallAttendanceStats(labRecords);

  const chartData = [
    { label: 'Attended', value: stats.attended, color: 'bg-green-600' },
    { label: 'Missed', value: stats.missed, color: 'bg-red-227' },
    { label: 'Cancelled', value: stats.cancelled, color: 'bg-gray-500' },
  ];

  const maxValue = Math.max(...chartData.map(item => item.value), 1);

  return (
    //Button to toggle between class and lab
    <div className="bg-neutral-900 text-white rounded-2xl shadow-xl p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6"> 
        <h2 className="text-xl sm:text-2xl font-semibold">
          📊 {view === 'class' ? 'Class Attendance' : 'Lab Attendance'} Overview
        </h2>
        <button
          className="ml-2 p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 transition"
          title={view === 'class' ? 'Go to Lab Attendance' : 'Go to Class Attendance'}
          onClick={() => setView(view === 'class' ? 'lab' : 'class')}
        >
          {view === 'class' ? (
            <span className="inline-block rotate-90">➔</span>
          ) : (
            <span className="inline-block -rotate-90">➔</span>
          )}
        </button>
      </div>
      {/* Animated Bar Representation */}
      <div className="space-y-3 sm:space-y-4">
        {chartData.map(item => (
          <div key={item.label} className="flex items-center">
            <span className="w-16 sm:w-24 text-xs sm:text-sm text-gray-400 truncate">{item.label}</span>
            <div className="flex-1 bg-gray-800 rounded-full h-2 sm:h-3 mx-2 sm:mx-3">
              <div
                className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
            <span className="w-6 sm:w-8 text-xs sm:text-sm text-white text-right">{item.value}</span>
          </div>
        ))}
      </div>
      {/* Overall Percentage Footer */}
      <div className="mt-4 sm:mt-6 pt-4 border-t border-gray-700">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400 text-sm sm:text-base">Overall Percentage</span>
          <span className={`font-bold text-lg sm:text-xl ${
            stats.percentage >= 75 ? 'text-green-600' : 'text-red-227'
          }`}>
            {stats.percentage}%
          </span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              stats.percentage >= 75 ? 'bg-green-600' : 'bg-red-227'
            }`}
            style={{ width: `${stats.percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default AttendanceChart;
