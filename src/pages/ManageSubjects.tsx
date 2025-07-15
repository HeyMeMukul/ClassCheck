import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useSchedule, WeeklySchedule } from '../contexts/ScheduleContext';

const ManageSubjects: React.FC = () => {
  const { user } = useOutletContext<{ user: any }>();
  const { schedule, addSubject, removeSubject, resetSchedule } = useSchedule();

  const [newSubject, setNewSubject] = useState('');
  const [selectedDay, setSelectedDay] = useState<keyof WeeklySchedule>('Monday');

  const weekdays: (keyof WeeklySchedule)[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const handleAddSubject = () => {
    if (newSubject.trim()) {
      addSubject(selectedDay, newSubject.trim());
      setNewSubject('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAddSubject();
  };

  const getTotalSubjects = () => Object.values(schedule).flat().length;
  const getActiveDays = () => weekdays.filter(day => schedule[day].length > 0).length;

  return (
    <div className="min-h-screen px-6 py-10 bg-black text-white space-y-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-white">Manage Subjects</h1>
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-400">Logged in as: <span className="font-medium">{user?.name || 'User'}</span></p>
          <button
            onClick={resetSchedule}
            className="bg-red-600 hover:bg-red-700 transition-all duration-150 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Reset All
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Stat label="Total Subjects" value={getTotalSubjects()} color="blue" />
        <Stat label="Active Days" value={getActiveDays()} color="green" />
        <Stat label="Weekend Days" value="Always Free" color="purple" />
      </div>

      {/* Add New Subject */}
      <div className="bg-gray-900 rounded-2xl shadow-xl p-8">
        <h2 className="text-xl font-semibold mb-6 border-b border-gray-700 pb-3">➕ Add New Subject</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value as keyof WeeklySchedule)}
            className="w-full sm:w-48 px-3 py-2 rounded-md bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-1 focus:ring-gray-400"
          >
            {weekdays.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>

          <input
            type="text"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter subject name..."
            className="flex-1 px-3 py-2 rounded-md bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
          />

          <button
            onClick={handleAddSubject}
            disabled={!newSubject.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white px-6 py-2 rounded-md font-medium transition-all"
          >
            Add Subject
          </button>
        </div>
      </div>

      {/* Weekly Schedule */}
      <div className="bg-gray-900 rounded-2xl shadow-xl p-8">
        <h2 className="text-xl font-semibold mb-6 border-b border-gray-700 pb-3">📆 Weekly Schedule</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {weekdays.map(day => (
            <div key={day} className="bg-gray-800 p-4 rounded-lg">
              <h3 className="font-medium text-center text-lg text-white mb-3">{day}</h3>
              <div className="space-y-2">
                {schedule[day].length > 0 ? (
                  schedule[day].map((subject, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-700 p-2 rounded text-sm">
                      <span className="text-white">{subject}</span>
                      <button
                        onClick={() => removeSubject(day, subject)}
                        className="text-red-500 hover:text-red-700 font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm text-center py-2">No subjects added</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekend Notice */}
      <div className="bg-yellow-900 border border-yellow-700 p-5 rounded-xl flex items-start gap-4">
        <svg className="w-5 h-5 mt-1 text-yellow-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        <div>
          <p className="text-yellow-200 font-medium">Weekend Policy</p>
          <p className="text-yellow-300 text-sm">
            Saturday and Sunday are automatically considered holidays. You can only add subjects for Monday to Friday.
          </p>
        </div>
      </div>
    </div>
  );
};

/* Stat Card Component */
interface StatProps {
  label: string;
  value: string | number;
  color: 'blue' | 'green' | 'purple';
}

const Stat: React.FC<StatProps> = ({ label, value, color }) => (
  <div className={`bg-${color}-950 border border-${color}-700 p-6 rounded-xl`}>
    <h3 className={`text-${color}-300 font-medium mb-1`}>{label}</h3>
    <p className={`text-2xl font-bold text-${color}-400`}>{value}</p>
  </div>
);

export default ManageSubjects;
