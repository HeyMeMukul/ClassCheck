import React from 'react';

const StaticLetter = ({ letter }: { letter: string }) => {
  return (
    <div
      className="inline-block text-white text-3xl sm:text-5xl font-bold transition-transform duration-300 hover:rotate-6"
      style={{ userSelect: 'none' }}
    >
      {letter}
    </div>
  );
};

const Landing: React.FC = () => {
  const title = 'ClassCheck';

  return (
    <div className="bg-black text-white font-sans min-h-screen flex flex-col">
      {/* Logo */}
      <div className="pt-12 pb-4 flex justify-center overflow-x-auto whitespace-nowrap">
        {title.split('').map((char, i) => (
          <StaticLetter key={i} letter={char} />
        ))}
      </div>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-[4rem] sm:text-[5.5rem] max-sm:text-[2.25rem] font-extrabold leading-tight">
          One goal.<br />
          Enough attendance.<br />
          No surprises.
        </h1>
        <button
          className="mt-20 sm:mt-20 max-sm:mt-12 px-6 py-3 max-sm:px-4 max-sm:py-2 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition"
          onClick={() => window.location.href = '/login'}
        >
          Sign In / Log In
        </button>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-500 py-6">
        © 2025 ClassCheck
      </footer>
    </div>
  );
};

export default Landing;
