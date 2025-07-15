import React from 'react';
import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';

const ErrorBoundary: React.FC = () => {
  const error = useRouteError();

  const renderError = (title: string, message: string, actionLink: string, actionText: string) => (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-bold text-white">{title}</h1>
        <p className="text-gray-400">{message}</p>
        <Link
          to={actionLink}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2 rounded-md transition"
        >
          {actionText}
        </Link>
      </div>
    </div>
  );

  if (isRouteErrorResponse(error)) {
    if (error.status === 401) {
      return renderError(
        'Authentication Required',
        'Please log in to access this page.',
        '/login',
        '🔐 Go to Login'
      );
    }

    if (error.status === 404) {
      return renderError(
        'Page Not Found',
        'The page you are looking for does not exist.',
        '/',
        '🏠 Go Home'
      );
    }
  }

  return renderError(
    'Oops! Something went wrong.',
    error instanceof Error ? error.message : 'An unexpected error occurred.',
    '/',
    '↩ Back to Home'
  );
};

export default ErrorBoundary;
