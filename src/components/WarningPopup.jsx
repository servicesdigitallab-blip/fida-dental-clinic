import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, AlertTriangle, Lock, ExternalLink } from 'lucide-react';

export default function WarningPopup() {
  const [visible, setVisible] = useState(true);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[99999] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          {/* Dark overlay background */}
          <div className="absolute inset-0 bg-[#0a0a0a]/95 backdrop-blur-md" />

          {/* Warning Card */}
          <motion.div
            className="relative z-10 w-[92%] max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl"
            initial={{ scale: 0.85, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.85, y: 30, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Red top bar */}
            <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 px-6 py-5 flex flex-col items-center gap-3 relative overflow-hidden">
              {/* Animated scan line */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                  className="absolute w-full h-[2px] bg-white/10"
                  style={{
                    animation: 'scanline 2.5s linear infinite',
                  }}
                />
              </div>

              {/* Shield icon with pulse */}
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
                <div className="relative w-16 h-16 bg-white/15 rounded-full flex items-center justify-center border-2 border-white/30 backdrop-blur-sm">
                  <ShieldAlert className="w-8 h-8 text-white drop-shadow-lg" />
                </div>
              </div>

              <h2 className="text-white font-extrabold text-lg tracking-tight text-center leading-tight">
                ⚠️ Security Warning
              </h2>
              <p className="text-red-100 text-[11px] font-medium text-center leading-relaxed max-w-xs">
                This website contains advanced dental clinic content. Proceed only if you trust this source.
              </p>
            </div>

            {/* Body content */}
            <div className="bg-[#1a1a1a] px-6 py-5 flex flex-col gap-4">
              {/* Warning details */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-red-300/90 leading-relaxed font-medium">
                    The content ahead may contain interactive dental booking forms and medical imagery.
                  </p>
                </div>

                <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                  <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Your connection to <span className="text-white font-bold">FIDA DENTAL CLINIC</span> is secured and encrypted.
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-2.5 mt-1">
                {/* Open Anyway button */}
                <motion.button
                  onClick={() => setVisible(false)}
                  className="group w-full py-3.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white rounded-xl font-bold text-sm tracking-wide shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden cursor-pointer"
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="absolute top-0 -inset-full h-full w-1/2 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/15 opacity-50 group-hover:animate-shine pointer-events-none" />
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Anyway</span>
                </motion.button>

                {/* Back to safety text */}
                <p className="text-center text-[10px] text-slate-600 font-medium">
                  Powered by FIDA DENTAL CLINIC Security
                </p>
              </div>
            </div>

            {/* Bottom red accent line */}
            <div className="h-1 bg-gradient-to-r from-red-600 via-amber-500 to-red-600" />
          </motion.div>

          {/* Inline scanline keyframe */}
          <style>{`
            @keyframes scanline {
              0% { top: -2px; }
              100% { top: 100%; }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
