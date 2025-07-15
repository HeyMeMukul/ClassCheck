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
    <div className="bg-gray-900 text-white rounded-2xl shadow-xl p-6">
      <h2 className="text-2xl font-semibold mb-6">📊 Attendance Overview</h2>

      {/* Quick Stat Display */}
      <div className="grid grid-cols-3 gap-6 mb-6 text-center">
        {chartData.map(item => (
          <div key={item.label}>
            <div className={`h-2 w-full mb-2 rounded-full ${item.color}`}></div>
            <p className="text-3xl font-bold">{item.value}</p>
            <p className="text-sm text-gray-400">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Animated Bar Representation */}
      <div className="space-y-4">
        {chartData.map(item => (
          <div key={item.label} className="flex items-center">
            <span className="w-24 text-sm text-gray-400">{item.label}</span>
            <div className="flex-1 bg-gray-800 rounded-full h-3 mx-3">
              <div
                className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              ></div>
            </div>
            <span className="w-8 text-sm text-white text-right">{item.value}</span>
          </div>
        ))}
      </div>

      {/* Overall Percentage Footer */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Overall Percentage</span>
          <span className={`font-bold text-xl ${
            stats.percentage >= 75 ? 'text-green-400' : 'text-red-400'
          }`}>
            {stats.percentage}%
          </span>
        </div>
        <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              stats.percentage >= 75 ? 'bg-green-500' : 'bg-red-500'
            }`}
            style={{ width: `${stats.percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceChart;
