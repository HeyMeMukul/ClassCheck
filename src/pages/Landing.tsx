// src/pages/Landing.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
              ClassCheck
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Smart Attendance Tracking for College Students
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
              Track your attendance, stay above 75%, and get smart suggestions to succeed. 
              Upload your timetable, mark attendance with a click, and never miss the minimum requirement again.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Smart Calendar
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Visual calendar interface with color-coded attendance status
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Real-time Analytics
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Track your percentage and get instant feedback on your progress
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Smart Suggestions
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get personalized advice on when to attend or skip classes
              </p>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
      
      
        
            <Link to="/login">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;