import React from "react";
import { BackgroundBeamsWithCollision } from "../components/BackgroundBeamsWithCollision"; // adjust path
import { motion } from 'framer-motion';


const Landing: React.FC = () => {
  const title = "ClassCheck";

  return (

    <div className="bg-black text-white font-sans min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Animation */}
      <BackgroundBeamsWithCollision className="absolute inset-0 -z-11" />

      {/* Logo */}
      <div className="pt-12 pb-4 text-[2rem] sm:text-[3.5rem] max-sm:text-[2rem] font-bold flex justify-center overflow-x-auto whitespace-nowrap relative z-10">
        ClassCheck
      </div>

      {/* Hero Section */}
      <motion.main
        className="flex-grow flex flex-col items-center justify-center px-6 text-center relative z-10"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <h1 className="text-[4rem] sm:text-[5.5rem] max-sm:text-[2rem] font-extrabold leading-tight">
          One goal.
          <br />
          Enough attendance.
          <br /> 
          No surprises.
        </h1>
        <button
          className="mt-20 sm:mt-20 max-sm:mt-12 px-6 py-3 max-sm:px-4 max-sm:py-2 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition"
          onClick={() => (window.location.href = "/login")}
        >
          Sign In / Log In
        </button>
      </motion.main>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-500 py-6 relative z-10">
        © 2025 ClassCheck
      </footer>
    </div>
  );
};

export default Landing;
