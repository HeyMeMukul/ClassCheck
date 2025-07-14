import React from 'react';
import { useAttendance } from '../contexts/AttendanceContext';
import { AttendanceRecord } from '../types/attendance';
import { generateSmartSuggestions, getOverallPercentage } from '../utils/attendanceUtils';

const SmartSuggestions: React.FC = () => {
  const { records } = useAttendance();
  
  const percentage = getOverallPercentage(records);
  const suggestions = generateSmartSuggestions(records);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Smart Suggestions
      </h2>
      
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-400">Current Attendance</span>
          <span className={`font-bold text-lg ${
            percentage >= 75 ? 'text-green-600' : 'text-red-600'
          }`}>
            {percentage}%
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {suggestions.length > 0 ? (
          suggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border-l-4 ${
                suggestion.includes('need to attend') || suggestion.includes('missed')
                  ? 'bg-red-50 border-red-500 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                  : suggestion.includes('Excellent') || suggestion.includes('doing well')
                  ? 'bg-green-50 border-green-500 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                  : 'bg-blue-50 border-blue-500 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
              }`}
            >
              <p className="text-sm">{suggestion}</p>
            </div>
          ))
        ) : (
          <div className="text-gray-500 dark:text-gray-400 text-center py-4">
            <p>No suggestions available. Start marking your attendance!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartSuggestions;
