import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { useAuth } from '../contexts/AuthContext'; 
import Calendar from '../components/Calendar';
import ClassSchedule from '../components/ClassSchedule';
import SmartSuggestions from '../components/SmartSuggestions';
import AttendanceChart from '../components/AttendanceChart';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const { user } = useAuth(); 

  // State to manage the visibility of the update note
  const [showUpdateNote, setShowUpdateNote] = useState(() => {
    // Check local storage if the user has already dismissed the note
    const dismissed = localStorage.getItem('lab_update_note_dismissed');
    return dismissed !== 'true'; // Show if not dismissed
  });

  // Effect to automatically dismiss the note after a few days (optional, good for temporary notes)
  useEffect(() => {
    if (showUpdateNote) {
      const dismissDate = localStorage.getItem('lab_update_note_dismiss_date');
      const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000; // 7 days

      if (!dismissDate) {
        // Set the dismissal date if it's the first time seeing the note
        localStorage.setItem('lab_update_note_dismiss_date', Date.now().toString());
      } else if (Date.now() - parseInt(dismissDate) > sevenDaysInMs) {
        // Automatically dismiss after 7 days
        handleDismissNote();
      }
    }
  }, [showUpdateNote]);

  const handleDismissNote = () => {
    setShowUpdateNote(false);
    localStorage.setItem('lab_update_note_dismissed', 'true'); // Persist dismissal
    localStorage.removeItem('lab_update_note_dismiss_date'); // Clear the date as it's dismissed
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <motion.div
        className="p-4 sm:p-6 lg:p-8 space-y-6"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        {/* Header */}
        <div></div>
        <br></br>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Dashboard
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Welcome back, {user?.name || 'User'}!
          </p>
        </div>

        {/* --- Update Note Section (NEW) --- */}
        {showUpdateNote && (
          <motion.div
            className="bg-blue-900 border border-blue-700 p-4 sm:p-5 rounded-xl flex items-start gap-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7, ease:'easeOut' }}
          >
            <svg className="w-6 h-6 mt-0.5 text-blue-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2h2a1 1 0 000-2H9zm1 4a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-blue-200 font-semibold text-lg sm:text-xl mb-1">Important Update!</h3>
              <p className="text-blue-300 text-sm sm:text-base">
                
                We've resolved an issue where your attendance records for different subjects (like "Physics" and "Physics Lab") could get mixed up if their names weren't unique.
                We've automatically updated your existing lab records to reflect this change, ensuring accurate tracking and clearer distinctions for all your classes.</p>
              <button
                onClick={handleDismissNote}
                className="mt-3 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-blue-900 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Got It!
              </button>
            </div>
          </motion.div>
        )}
        {/* --- End Update Note Section --- */}

        {/* Main Grid - Calendar and Schedule */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="order-1 xl:order-1">
            <Calendar />
          </div>
          <div className="order-2 xl:order-2">
            <ClassSchedule />
          </div>
        </div>

        {/* Secondary Grid - Suggestions and Chart */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="order-3 xl:order-3">
            <SmartSuggestions />
          </div>
          <div className="order-4 xl:order-4">
            <AttendanceChart />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;