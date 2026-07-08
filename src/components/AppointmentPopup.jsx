import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';

export default function AppointmentPopup() {
  const [show, setShow] = useState(false);
  const [hasShown30, setHasShown30] = useState(false);
  const [hasShown60, setHasShown60] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const scrollPercent = (scrollTop / docHeight) * 100;

      if (scrollPercent >= 30 && scrollPercent < 60 && !hasShown30) {
        setShow(true);
        setHasShown30(true);
      } else if (scrollPercent >= 60 && !hasShown60) {
        setShow(true);
        setHasShown60(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasShown30, hasShown60]);

  const handleYes = () => {
    setShow(false);
    window.dispatchEvent(new CustomEvent('open-chatbot-book'));
  };

  const handleNo = () => {
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 50 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="fixed bottom-24 left-6 z-[9997] max-w-sm w-[calc(100vw-3rem)] bg-white rounded-3xl p-6 shadow-2xl border border-slate-100/80 flex flex-col gap-4 text-left"
        >
          {/* Close Button */}
          <button
            onClick={handleNo}
            className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full bg-slate-50 hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Content */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
              <Sparkles className="w-5 h-5 fill-primary/10" />
            </div>
            <div className="flex flex-col gap-1 pr-4">
              <span className="text-[10px] font-bold text-primary tracking-wider uppercase">FIDA DENTAL CLINIC</span>
              <h3 className="text-[15px] font-black text-slate-800 leading-tight uppercase tracking-tight font-sans">
                Are you interested to book an appointment?
              </h3>
            </div>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-1">
            <button
              onClick={handleNo}
              className="py-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 text-slate-500 hover:text-slate-700 font-bold text-xs transition-colors cursor-pointer text-center"
            >
              No, Thanks
            </button>
            <button
              onClick={handleYes}
              className="py-2.5 rounded-xl bg-primary text-white hover:bg-primary-dark font-bold text-xs shadow-md shadow-blue-500/10 hover:shadow-blue-500/25 transition-all cursor-pointer text-center"
            >
              Yes, Book Now
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
