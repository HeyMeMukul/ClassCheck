import React from 'react';
import { useOutletContext } from 'react-router-dom';
import Calendar from '../components/Calendar';
import ClassSchedule from '../components/ClassSchedule';
import SmartSuggestions from '../components/SmartSuggestions';
import AttendanceChart from '../components/AttendanceChart';

const Dashboard: React.FC = () => {
  const { user } = useOutletContext<{ user: any }>();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-white-600 dark:text-gray-300">
          Welcome back, {user?.name || 'User'}!
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Calendar />
        <ClassSchedule />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SmartSuggestions />
        <AttendanceChart />
      </div>
    </div>
  );
};

export default Dashboard;
