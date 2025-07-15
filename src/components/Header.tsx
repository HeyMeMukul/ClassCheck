// src/components/Header.tsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAttendance } from '../contexts/AttendanceContext';
import { Button } from './ui/Button';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { calculatePercentage } = useAttendance();

  const attendancePercentage = calculatePercentage();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-gray-900 dark:bg-gray-800 shadow-sm border-b border-gray-700 w-full">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-0">
          {/* Left: Attendance Info */}
          <div className="flex items-center gap-2 flex-wrap text-sm">
            <span className="text-gray-100 dark:text-gray-400">
              Current Attendance:
            </span>
            <span
              className={`font-semibold ${
                attendancePercentage >= 75
                  ? 'text-green-500 dark:text-green-400'
                  : 'text-red-500 dark:text-red-400'
              }`}
            >
              {attendancePercentage}%
            </span>
          </div>

          {/* Right: User Info + Logout */}
          <div className="flex items-center gap-3 flex-wrap text-sm">
            <span className="text-gray-100 dark:text-gray-400">
              Welcome, {user?.name || 'User'}
            </span>
            <Button variant="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
