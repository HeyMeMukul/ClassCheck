import React from 'react';
import { useAttendance } from '../contexts/AttendanceContext';
import { getAttendanceStats } from '../utils/attendanceUtils';

const AttendanceChart: React.FC = () => {
  const { records } = useAttendance();
  const stats = getAttendanceStats(records);

  const chartData = [
    { label: 'Attended', value: stats.attended, color: 'bg-green-500' },
    { label: 'Missed', value: stats.missed, color: 'bg-red-500' },
    { label: 'Cancelled', value: stats.cancelled, color: 'bg-gray-500' },
  ];

  const maxValue = Math.max(...chartData.map(item => item.value), 1);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Attendance Overview
      </h2>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        {chartData.map((item) => (
          <div key={item.label} className="text-center">
            <div className={`w-full h-2 ${item.color} rounded-full mb-2`}></div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{item.value}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {chartData.map((item) => (
          <div key={item.label} className="flex items-center">
            <span className="w-20 text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3 mx-3">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${item.color}`}
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              ></div>
            </div>
            <span className="w-8 text-sm text-gray-900 dark:text-white text-right">{item.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Overall Percentage</span>
          <span className={`font-bold text-lg ${
            stats.percentage >= 75 ? 'text-green-600' : 'text-red-600'
          }`}>
            {stats.percentage}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceChart;
