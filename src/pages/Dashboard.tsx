import React from 'react';
import { useAuth } from '../contexts/AuthContext'; // ✅ use AuthContext instead
import Calendar from '../components/Calendar';
import ClassSchedule from '../components/ClassSchedule';
import SmartSuggestions from '../components/SmartSuggestions';
import AttendanceChart from '../components/AttendanceChart';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const { user } = useAuth(); // ✅ Replace useOutletContext with useAuth

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
