import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

const Landing: React.FC = () => {
  // Smooth scroll function
  const smoothScrollTo = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navigation */}
      <br></br>
            <br></br>
      <br></br>

      <nav className="absolute top-0 left-0 w-full z-50 p-6">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-md">
              <span className="text-white text-lg">📅</span>
            </div>
            <span className="text-xl font-bold">Class Check</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <button 
              onClick={() => smoothScrollTo('features')}
              className="text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              Features
            </button>
            <button 
              onClick={() => smoothScrollTo('how-it-works')}
              className="text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              How it Works
            </button>
            <Link to="/login" className="text-gray-400 hover:text-white transition-colors">Sign In</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        {/* 3D Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-bl from-indigo-600/10 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 text-center max-w-6xl mx-auto">
          {/* Main Title */}
          <div className="mb-8">
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold mb-6 tracking-tight">
              <span className="inline-block transform hover:scale-105 transition-transform duration-300">Class</span>
              <span className="inline-block transform hover:scale-105 transition-transform duration-300 delay-100">Check</span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-8"></div>
            <p className="text-xl sm:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto">
              Smart Attendance Tracking for College Students
            </p>
            <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
              Track your attendance, stay above 75%, and get smart suggestions to succeed. 
              Never miss the minimum requirement again.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link to="/login">
              <button className="px-8 py-4 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
                Get Started
              </button>
            </Link>
       
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">75%+</div>
              <div className="text-sm text-gray-400">Attendance Target</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">Real-time</div>
              <div className="text-sm text-gray-400">Analytics</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">Smart</div>
              <div className="text-sm text-gray-400">Suggestions</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">Why ClassCheck?</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Designed specifically for college students who want to stay on top of their attendance
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group">
              <div className="bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-800 hover:border-gray-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">📅</div>
                <h3 className="text-2xl font-semibold mb-4">Smart Calendar</h3>
                <p className="text-gray-400 mb-6">
                  Visual calendar interface with color-coded attendance status. See your progress at a glance.
                </p>
                <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </div>
            </div>

            <div className="group">
              <div className="bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-800 hover:border-gray-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">📊</div>
                <h3 className="text-2xl font-semibold mb-4">Real-time Analytics</h3>
                <p className="text-gray-400 mb-6">
                  Track your percentage and get instant feedback on your progress with detailed insights.
                </p>
                <div className="w-full h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </div>
            </div>

            <div className="group">
              <div className="bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-800 hover:border-gray-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">💡</div>
                <h3 className="text-2xl font-semibold mb-4">Smart Suggestions</h3>
                <p className="text-gray-400 mb-6">
                  Get personalized advice on when to attend or skip classes based on your current standing.
                </p>
                <div className="w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-20 px-6 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">How It Works</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Simple steps to get started with ClassCheck
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">1</div>
              <h3 className="text-xl font-semibold mb-4">Enter Subjects</h3>
              <p className="text-gray-400">
                Enter your class schedule and set up your subjects
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">2</div>
              <h3 className="text-xl font-semibold mb-4">Mark Attendance</h3>
              <p className="text-gray-400">
                Quick one-click attendance marking for each class
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">3</div>
              <h3 className="text-xl font-semibold mb-4">Stay on Track</h3>
              <p className="text-gray-400">
                Get insights and suggestions to maintain 75%+ attendance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl p-12 border border-gray-800">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Join thousands of students who never miss their attendance target
            </p>
            <Link to="/login">
              <button className="px-12 py-4 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg text-lg">
                Sign Up Now
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 flex items-center justify-center bg-gray-800 rounded-md">
                <span className="text-white text-sm">📅</span>
              </div>
              <span className="text-lg font-bold">ClassCheck</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2025 ClassCheck. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;