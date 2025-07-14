// src/components/Header.tsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAttendance } from '../contexts/AttendanceContext';
import { Button } from './ui/Button';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { calculatePercentage } = useAttendance();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-bg-secondary border-r dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
      <div className="px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
       
            <div className="hidden md:flex items-center space-x-2">
              <span className="text-sm text-white dark:text-gray-400">
                Current Attendance :
              </span>
              <span className={`text-sm font-semibold ${
                calculatePercentage() >= 75 ? 'text-green-600' : 'text-red-600'
              }`}>
                {calculatePercentage()}%
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <span className="text-sm text-white dark:text-gray-400">
                Welcome, {user?.name}
              </span>
            </div>
            <Button variant="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
        
        {/* Mobile attendance display */}
        <div className="md:hidden mt-2 flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Current Attendance:
          </span>
          <span className={`text-sm font-semibold ${
            calculatePercentage() >= 75 ? 'text-green-600' : 'text-red-600'
          }`}>
            {calculatePercentage()}%
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;