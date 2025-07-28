import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSchedule, WeeklySchedule, Subject } from '../contexts/ScheduleContext';
import { useAttendance } from '../contexts/AttendanceContext';
import { motion } from 'framer-motion';

const ManageSubjects: React.FC = () => {
  const { user } = useAuth();
  const { schedule, addSubject, resetSchedule } = useSchedule();
  const { removeSubject } = useSchedule();
  const { removeRecordsBySubject, resetAllRecords } = useAttendance();

  const handleRemoveSubject = (day: keyof WeeklySchedule, subject: string) => {
      removeSubject(day, subject);
      removeRecordsBySubject(subject); // also clears attendance
  };
  const [newSubject, setNewSubject] = useState('');
  const [isLab, setIsLab] = useState(false);
  const [selectedDay, setSelectedDay] = useState<keyof WeeklySchedule>('Monday');

  const weekdays: (keyof WeeklySchedule)[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const handleAddSubject = () => {
    if (newSubject.trim()) {
      // Keep this logic: it adds '(L)' to the name when adding a new lab subject
      const subjectName = isLab ? `${newSubject.trim()} (Lab)` : newSubject.trim();
      addSubject(selectedDay, { name: subjectName, isLab });
      setNewSubject('');
      setIsLab(false);
    }
  };
  const handleResetSchedule=()=>{
    resetSchedule();
    resetAllRecords();
  }
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAddSubject();
  };

  const getTotalClassSubjects = () => {
    // This logic relies on 'isLab' flag, not necessarily '(L)' in name
    return Object.values(schedule).flat().filter((s: Subject) => !s.isLab).length;
  };
  const getTotalLabSubjects = () => {
    // This logic relies on 'isLab' flag
    return Object.values(schedule).flat().filter((s: Subject) => s.isLab).length;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <motion.div
        className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        {/* Header */}
        <div></div>
        <br></br>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">📚 Manage Subjects</h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <p className="text-sm text-neutral-400">
              Logged in as: <span className="font-medium">{user?.name || 'User'}</span>
            </p>
            <button
              onClick={handleResetSchedule}
              className="bg-red-227 hover:bg-red-300 transition-all duration-150 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              🗑️ Reset All
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <StatCard label="Classes" value={getTotalClassSubjects()} color="blue" />
          <StatCard label="Labs" value={getTotalLabSubjects()} color="green" />
          <StatCard label="Weekend Days" value="Always Free" color="purple" />
        </div>

        {/* Add New Subject */}
        <div className="bg-neutral-900 rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 border-b border-neutral-700 pb-3">
            ➕ Add New Subject
          </h2>
          
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value as keyof WeeklySchedule)}
                className="w-full sm:w-48 px-3 py-2 rounded-md bg-neutral-700 border border-neutral-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="flex-1 px-3 py-2 rounded-md bg-neutral-800 border border-neutral-600 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Lab toggle */}
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={isLab}
                  onChange={e => setIsLab(e.target.checked)}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                Lab
              </label>
            </div>

            <button
              onClick={handleAddSubject}
              disabled={!newSubject.trim()}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-500 text-white px-6 py-2 rounded-md font-medium transition-all"
            >
              Add Subject
            </button>
          </div>
        </div>

        {/* Weekly Schedule */}
        <div className="bg-neutral-900 rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 border-b border-neutral-700 pb-3">
            📆 Weekly Schedule
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {weekdays.map(day => (
              <div key={day} className="bg-neutral-800 p-3 sm:p-4 rounded-lg">
                <h3 className="font-medium text-center text-base sm:text-lg text-white mb-3">
                  {day}
                </h3>
                <div className="space-y-2">
                  {schedule[day].length > 0 ? (
                    schedule[day].map((subject: Subject, idx: number) => {
                      let baseName = subject.name;
                      let labSuffix = null;

                      // Check if it's a lab and if the name explicitly contains '(L)'
                      // We use subject.isLab as the primary indicator, and then check the string
                      if (subject.isLab && subject.name.endsWith(' (Lab)')) {
                        // Extract base name by removing ' (L)'
                        baseName = subject.name.substring(0, subject.name.length - ' (Lab)'.length);
                        labSuffix = <span className="ml-1 text-blue-400">(Lab)</span>;
                      }

                      return (
                        <div key={idx} className="flex items-center justify-between bg-neutral-700 p-2 rounded text-sm">
                          {/* Display base name and then the colored (L) suffix */}
                          <span className="text-white truncate mr-2">
                            {baseName}
                            {labSuffix}
                          </span>
                          <button
                            onClick={() => handleRemoveSubject(day, subject.name)}
                            className="text-red-227 hover:text-red-300 font-bold text-lg leading-none flex-shrink-0"
                          >
                            ×
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-neutral-400 text-sm text-center py-4">No subjects added</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekend Notice */}
        <div className="bg-yellow-900 border border-yellow-700 p-4 sm:p-5 rounded-xl">
          <div className="flex items-start gap-3 sm:gap-4">
            <svg className="w-5 h-5 mt-1 text-yellow-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-yellow-200 font-medium text-sm sm:text-base">Weekend Policy</p>
              <p className="text-yellow-300 text-xs sm:text-sm mt-1">
                Saturday and Sunday are automatically considered holidays. You can only add subjects for Monday through Friday.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

/* StatCard Component */
interface StatProps {
  label: string;
  value: string | number;
  color: 'blue' | 'green' | 'purple';
}

const StatCard: React.FC<StatProps> = ({ label, value, color }) => (
  <div className={`bg-${color}-950 border border-${color}-700 p-4 sm:p-6 rounded-xl text-center`}>
    <h3 className={`text-${color}-300 font-medium mb-2 text-sm sm:text-base`}>{label}</h3>
    <p className={`text-xl sm:text-2xl font-bold text-${color}-400`}>{value}</p>
  </div>
);

export default ManageSubjects;