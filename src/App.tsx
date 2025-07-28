// src/App.tsx
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CalendarProvider } from './contexts/CalendarContext';
import { AttendanceProvider } from './contexts/AttendanceContext';
import { ScheduleProvider } from './contexts/ScheduleContext';
import { requireAuth, redirectIfAuthenticated } from './lib/auth-loaders';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ManageSubjects from './pages/ManageSubjects'; // New page
import Reports from './pages/Reports';
import HowTo from './pages/HowTo';

import NotFound from './pages/NotFound';
import ErrorBoundary from './components/ErrorBoundary';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
    loader: redirectIfAuthenticated,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/login',
    element: <Login />,
    loader: redirectIfAuthenticated,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/dashboard',
    element: <Layout />,
    loader: requireAuth,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      }
    ],
  },
  {
    path: '/subjects', // New route for manual subject management
    element: <Layout />,
    loader: requireAuth,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <ManageSubjects />,
      }
    ],
  },
  {
    path: '/reports',
    element: <Layout />,
    loader: requireAuth,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Reports />,
      }
    ],
  },
  {
    path: '/howto',
    element: <HowTo />, // How To page for new users
    errorElement: <ErrorBoundary />,
  },
  
  {
    path: '*',
    element: <NotFound />,
  },
]);

function App() {
  return (
    <AuthProvider>
      {/* AttendanceProvider now wraps ScheduleProvider */}
      <AttendanceProvider>
        <ScheduleProvider>
          <CalendarProvider>
            <RouterProvider router={router} />
          </CalendarProvider>
        </ScheduleProvider>
      </AttendanceProvider>
    </AuthProvider>
  );
}

export default App;
