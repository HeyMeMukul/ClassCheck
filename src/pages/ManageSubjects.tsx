// src/pages/ManageSubjects.tsx
import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useSchedule, WeeklySchedule } from '../contexts/ScheduleContext';

const ManageSubjects: React.FC = () => {
  const { user } = useOutletContext<{ user: any }>();
  const { schedule, addSubject, removeSubject, resetSchedule } = useSchedule();
  
  const [newSubject, setNewSubject] = useState('');
  const [selectedDay, setSelectedDay] = useState<keyof WeeklySchedule>('Monday');
  const [isEditing, setIsEditing] = useState(false);

  const weekdays: (keyof WeeklySchedule)[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const handleAddSubject = () => {
    if (newSubject.trim()) {
      addSubject(selectedDay, newSubject.trim());
      setNewSubject('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddSubject();
    }
  };

  const getTotalSubjects = () => {
    return Object.values(schedule).flat().length;
  };

  const getActiveDays = () => {
    return weekdays.filter(day => schedule[day].length > 0).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Manage Subjects
        </h1>
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Logged in as: {user?.name || 'User'}
          </p>
          <button
            onClick={resetSchedule}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
          >
            Reset All
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800 dark:text-blue-200">Total Subjects</h3>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {getTotalSubjects()}
          </p>
        </div>
        <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800 dark:text-green-200">Active Days</h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {getActiveDays()}
          </p>
        </div>
        <div className="bg-purple-100 dark:bg-purple-900 p-4 rounded-lg">
          <h3 className="font-semibold text-purple-800 dark:text-purple-200">Weekend Days</h3>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            Always Free
          </p>
        </div>
      </div>

      {/* Add Subject Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Add New Subject
        </h2>
        
        <div className="flex gap-3">
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value as keyof WeeklySchedule)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          
          <button
            onClick={handleAddSubject}
            disabled={!newSubject.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md font-medium"
          >
            Add Subject
          </button>
        </div>
      </div>

      {/* Weekly Schedule Display */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Weekly Schedule
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {weekdays.map(day => (
            <div key={day} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3 text-center">
                {day}
              </h3>
              
              <div className="space-y-2">
                {schedule[day].length > 0 ? (
                  schedule[day].map((subject, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between bg-white dark:bg-gray-600 p-2 rounded text-sm"
                    >
                      <span className="text-gray-900 dark:text-white">{subject}</span>
                      <button
                        onClick={() => removeSubject(day, subject)}
                        className="text-red-600 hover:text-red-800 font-bold ml-2"
                      >
                        ×
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm text-center py-4">
                    No subjects added
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekend Notice */}
      <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
        <div className="flex items-center">
          <div className="text-yellow-600 dark:text-yellow-400 mr-3">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-yellow-800 dark:text-yellow-200 font-medium">
              Weekend Policy
            </p>
            <p className="text-yellow-700 dark:text-yellow-300 text-sm">
              Saturday and Sunday are automatically treated as holidays. Only add subjects for Monday through Friday.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageSubjects;
