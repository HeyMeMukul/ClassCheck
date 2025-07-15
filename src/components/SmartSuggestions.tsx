import React from 'react';
import { useAttendance } from '../contexts/AttendanceContext';
import { generateSmartSuggestions, getOverallPercentage } from '../utils/attendanceUtils';

const SmartSuggestions: React.FC = () => {
  const { records } = useAttendance();
  
  const percentage = getOverallPercentage(records);
  const suggestions = generateSmartSuggestions(records);

  return (
    <div className="bg-gray-900 text-white rounded-2xl shadow-xl p-6">
      <h2 className="text-2xl font-semibold mb-6">
        💡 Smart Suggestions
      </h2>
      
      {/* Attendance Overview */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Current Attendance</span>
          <span className={`font-bold text-xl ${
            percentage >= 75 ? 'text-green-400' : 'text-red-400'
          }`}>
            {percentage}%
          </span>
        </div>
        <div className="h-2 mt-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              percentage >= 75 ? 'bg-green-500' : 'bg-red-500'
            }`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>

      {/* Suggestion List */}
      <div className="space-y-3">
        {suggestions.length > 0 ? (
          suggestions.map((suggestion, index) => {
            const lower = suggestion.toLowerCase();
            let bgColor = 'bg-blue-900/30 border-blue-400 text-blue-300';
            if (lower.includes('missed') || lower.includes('need to attend')) {
              bgColor = 'bg-red-900/30 border-red-400 text-red-300';
            } else if (lower.includes('excellent') || lower.includes('doing well')) {
              bgColor = 'bg-green-900/30 border-green-400 text-green-300';
            }

            return (
              <div
                key={index}
                className={`p-4 border-l-4 rounded-md ${bgColor} backdrop-blur-sm`}
              >
                <p className="text-sm leading-relaxed">{suggestion}</p>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p>📝 No suggestions available. Start marking your attendance!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartSuggestions;
