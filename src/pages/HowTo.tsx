import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
// @ts-ignore
import addSubjectPic from '../components/static/addSubjectPic.png';
// @ts-ignore
import addSubLabPage from '../components/static/addSubLabPage.png';
// @ts-ignore
import CalendarClasses from '../components/static/CalendarClasses.png';
// @ts-ignore
import reportPage from '../components/static/reportPage.png';
// @ts-ignore
import SmartSuggestion from '../components/static/SmartSuggestion.png';
// Removed BackgroundBeamsWithCollision import
import { BackgroundBeamsWithCollision } from '../components/BackgroundBeamsWithCollision';
import { Lens } from "@/components/ui/lens";
import { useNavigate } from 'react-router-dom';

const steps = [
  {
    title: 'Step 1: Add Your Subjects & Labs',
    description: 'In the dashboard page , you will find this section, tap on it so you can start adding subjects!!',
    img: addSubjectPic,
    alt: 'Add Subject',
    color: 'text-red-227',
  },
  {
    title: 'Step 2: Customize Your Schedule',
    description: 'Easily change the day, mark whether a class is a lab, and view a clear breakdown of your daily schedule below in Manage Subjects page.',
    img: addSubLabPage,
    alt: 'Add Sub Lab Page',
    color: 'text-green-500',
  },
  {
    title: 'Step 3: Track Attendance in the Calendar',
    description: 'Once your classes are set up, they’ll appear in your calendar. Tap each day to mark it as Attended, Missed, or Cancelled!',
    img: CalendarClasses,
    alt: 'Calendar Classes',
    color: 'text-blue-400',
  },
  {
    title: 'Step 4: Analyze & Export Reports',
    description: 'Head to the Reports page to see detailed attendance stats for each subject. You can even export your data as a CSV for your records.',
    img: reportPage,
    alt: 'Report Page',
    color: 'text-yellow-400',
  },
  {
    title: 'Step 5: Get Smart Suggestions',
    description: 'Our Smart Suggestions feature helps you stay above 75% attendance, showing you exactly how many classes you’ve attended or missed this month—and what you can do to improve!',
    img: SmartSuggestion,
    alt: 'Smart Suggestion',
    color: 'text-gray-300',
  },
];

// Add Beams SVG for background effect
const Beams = () => (
  <svg
    width="380"
    height="315"
    viewBox="0 0 380 315"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="absolute top-0 left-1/2 -translate-x-1/2 w-full pointer-events-none z-0"
  >
    <g filter="url(#filter0_f_120_7473)">
      <circle cx="34" cy="52" r="114" fill="#6925E7" />
    </g>
    <g filter="url(#filter1_f_120_7473)">
      <circle cx="332" cy="24" r="102" fill="#8A4BFF" />
    </g>
    <g filter="url(#filter2_f_120_7473)">
      <circle cx="191" cy="53" r="102" fill="#802FE3" />
    </g>
    <defs>
      <filter
        id="filter0_f_120_7473"
        x="-192"
        y="-174"
        width="452"
        height="452"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feGaussianBlur
          stdDeviation="56"
          result="effect1_foregroundBlur_120_7473"
        />
      </filter>
      <filter
        id="filter1_f_120_7473"
        x="70"
        y="-238"
        width="524"
        height="524"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feGaussianBlur
          stdDeviation="80"
          result="effect1_foregroundBlur_120_7473"
        />
      </filter>
      <filter
        id="filter2_f_120_7473"
        x="-71"
        y="-209"
        width="524"
        height="524"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feGaussianBlur
          stdDeviation="80"
          result="effect1_foregroundBlur_120_7473"
        />
      </filter>
    </defs>
  </svg>
);

const HowTo: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for next, -1 for back
  const step = steps[currentStep];
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep === steps.length - 1) {
      navigate('/dashboard');
    } else {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    }
  };
  const handleBack = () => {
    setDirection(-1);
    setCurrentStep((prev) => prev - 1);
  };

  return (
    <div className="bg-black text-white font-sans min-h-screen flex flex-col relative overflow-hidden">
      <BackgroundBeamsWithCollision className="absolute inset-0 z-0" />
      {/* Logo/Title */}
      

      {/* Main Card */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 text-center relative z-10">
        <div className="relative w-full flex flex-col items-center">
          <div className="shadow-2xl rounded-2xl py-10 px-8 max-w-2xl w-full flex flex-col items-center animate-slideup relative z-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 text-white">How to Use ClassCheck</h1>
            <div className="flex flex-col items-center w-full min-h-[420px]">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentStep}
                  custom={direction}
                  initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 40, duration: 0.4 }}
                  className="flex flex-col items-center w-full"
                >
                  <span className={`font-bold mb-2 text-2xl sm:text-3xl ${step.color}`}>{step.title}</span>
                  <span className="mb-4 text-lg text-gray-200">{step.description}</span>
                  <Lens>
                    <img src={step.img} alt={step.alt} className="rounded-lg shadow-lg w-full max-w-lg sm:max-w-xl border border-gray-700 mb-8" />
                  </Lens>
                </motion.div>
              </AnimatePresence>
              <div className="flex justify-between w-full max-w-md mt-2 items-center">
                <button
                  className="px-4 py-2 rounded-full bg-gray-700 text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-600 transition text-2xl"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  aria-label="Back"
                >
                  &#8592;
                </button>
                <div className="flex items-center gap-2">
                  {steps.map((_, idx) => (
                    <span
                      key={idx}
                      className={`inline-block w-3 h-3 rounded-full transition-all duration-300 ${idx === currentStep ? 'bg-blue-400' : 'bg-gray-600'}`}
                    />
                  ))}
                </div>
                <button
                  className="px-4 py-2 rounded-full bg-blue-600 text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-500 transition text-2xl"
                  onClick={handleNext}
                  disabled={false}
                  aria-label={currentStep === steps.length - 1 ? 'Go to Dashboard' : 'Next'}
                >
                  &#8594;
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-500 py-6 relative z-10">
        © 2025 ClassCheck
      </footer>
    </div>
  );
};

export default HowTo; 