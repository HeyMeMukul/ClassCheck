import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
      <div className="text-center space-y-6">
        <h1 className="text-7xl font-extrabold text-blue-500">404</h1>
        <p className="text-2xl font-semibold text-white">
          Page Not Found
        </p>
        <p className="text-gray-400">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/dashboard"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2 rounded-md transition"
        >
          ⬅ Go Back DashBoard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
