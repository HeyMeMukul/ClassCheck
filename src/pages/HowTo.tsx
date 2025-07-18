import React, { useState, useRef, useEffect } from 'react';
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
  const currentStepRef = useRef(0);
  useEffect(() => { currentStepRef.current = currentStep; }, [currentStep]);
  const [direction, setDirection] = useState(0); // 1 for next, -1 for back
  const step = steps[currentStep];
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  // Scroll/keyboard/touch navigation
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isScrolling) return;
      if (Math.abs(e.deltaY) < 30) return; // ignore tiny scrolls
      setIsScrolling(true);
      e.preventDefault();
      const step = currentStepRef.current;
      if (e.deltaY > 0 && step < steps.length - 1) {
        setDirection(1);
        setCurrentStep(step + 1);
      } else if (e.deltaY < 0 && step > 0) {
        setDirection(-1);
        setCurrentStep(step - 1);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling) return;
      setIsScrolling(true);
      const step = currentStepRef.current;
      if ((e.key === 'ArrowDown' || e.key === 'PageDown') && step < steps.length - 1) {
        setDirection(1);
        setCurrentStep(step + 1);
      } else if ((e.key === 'ArrowUp' || e.key === 'PageUp') && step > 0) {
        setDirection(-1);
        setCurrentStep(step - 1);
      }
    };
    // Touch swipe support for mobile
    let touchStartY = 0;
    let touchEndY = 0;
    let touchStartTime = 0;
    const MIN_SWIPE_DISTANCE = 40;
    const MAX_SWIPE_TIME = 500; // ms
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 1) return; // ignore multi-touch
      touchStartY = e.touches[0].clientY;
      touchEndY = touchStartY; // always initialize to start value
      touchStartTime = Date.now();
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 1) return;
      touchEndY = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      if (isScrolling) return;
      const step = currentStepRef.current;
      const endY = touchEndY || touchStartY;
      const deltaY = touchStartY - endY;
      const elapsed = Date.now() - touchStartTime;
      if (Math.abs(deltaY) > MIN_SWIPE_DISTANCE && elapsed < MAX_SWIPE_TIME) {
        setIsScrolling(true);
        if (deltaY > 0 && step < steps.length - 1) {
          setDirection(1);
          setCurrentStep(step + 1);
        } else if (deltaY < 0 && step > 0) {
          setDirection(-1);
          setCurrentStep(step - 1);
        }
        e.preventDefault();
      }
    };
    const ref = containerRef.current;
    if (ref) {
      ref.addEventListener('wheel', handleWheel, { passive: false });
      ref.addEventListener('touchstart', handleTouchStart, { passive: true });
      ref.addEventListener('touchmove', handleTouchMove, { passive: true });
      ref.addEventListener('touchend', handleTouchEnd, { passive: false });
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      if (ref) {
        ref.removeEventListener('wheel', handleWheel);
        ref.removeEventListener('touchstart', handleTouchStart);
        ref.removeEventListener('touchmove', handleTouchMove);
        ref.removeEventListener('touchend', handleTouchEnd);
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentStep, isScrolling]);

  // Debounce/cooldown for scroll
  useEffect(() => {
    if (isScrolling) {
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => setIsScrolling(false), 700);
    }
  }, [isScrolling]);

  return (
    <div ref={containerRef} className="bg-black text-white font-sans min-h-screen flex flex-col relative overflow-hidden">
      <BackgroundBeamsWithCollision className="absolute inset-0 z-0" />
      {/* Logo/Title */}
    
      {/* Main Card - Animated Step */}
      <main className="flex-grow flex flex-col items-center justify-center px-2 sm:px-6 text-center relative z-10">
        <div className="relative w-full flex flex-col mb-4 items-center min-h-[340px] sm:min-h-[420px] max-w-full sm:max-w-2xl mx-auto" style={{height: '70vh', outline: 'none'}}>
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 text-white">How to Use ClassCheck</h1>
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
                <img src={step.img} alt={step.alt} className="rounded-lg shadow-lg w-full max-w-xs sm:max-w-lg md:max-w-xl border border-gray-700 mb-8 object-contain" />
              </Lens>
              {currentStep === steps.length - 1 && (
                <button
                  className="mt-4 px-6 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-500 transition text-lg"
                  onClick={() => navigate('/dashboard')}
                >
                  Go to Dashboard
                </button>
              )}
            </motion.div>
          </AnimatePresence>
          
        </div>
        <div className="flex items-center gap-2 mt-4">
            {steps.map((_, dotIdx) => (
              <span
                key={dotIdx}
                className={`inline-block w-3 h-3 rounded-full transition-all duration-300 ${dotIdx === currentStep ? 'bg-blue-400' : 'bg-gray-600'}`}
              />
            ))}
            
          </div>
          <div className='mt-4 text-center text-xs text-gray-500'>Scroll down</div>
          <div className='mt-4 text-center text-xs text-gray-500 block sm:hidden'>Touch to zoom</div>
      </main>
      {/* Footer */}
      <footer className="text-center text-xs text-gray-500 py-6 relative z-10">
        © 2025 ClassCheck
      </footer>
    </div>
  );
};

export default HowTo; 