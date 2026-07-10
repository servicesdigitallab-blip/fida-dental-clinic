import React, { useEffect, useState } from 'react';

export default function ProtectionShield() {
  const [isTampered, setIsTampered] = useState(false);

  useEffect(() => {
    // 1. Disable Right Click (Context Menu)
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    // 2. Disable Keyboard Shortcuts (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+S, Ctrl+A, Ctrl+C)
    const handleKeyDown = (e) => {
      if (
        e.key === 'F12' ||
        e.key === 'PrintScreen' ||
        e.key === 'Snapshot' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c' || e.key === 'K' || e.key === 'k')) ||
        (e.ctrlKey && (e.key === 'U' || e.key === 'u' || e.key === 'S' || e.key === 's' || e.key === 'A' || e.key === 'a' || e.key === 'C' || e.key === 'c' || e.key === 'P' || e.key === 'p')) ||
        (e.metaKey && (e.key === 'Option' || e.key === 'I' || e.key === 'i' || e.key === 'U' || e.key === 'u'))
      ) {
        e.preventDefault();
        if (e.key === 'PrintScreen' || e.key === 'Snapshot') {
          try { navigator.clipboard?.writeText?.(''); } catch(err) {}
          setIsTampered(true);
        }
        return false;
      }
    };

    // 3. Prevent Drag and Drop of Images/Content
    const handleDragStart = (e) => {
      e.preventDefault();
    };

    // 4. DevTools Detection Loop (Using Debugger statement)
    const detectDevTools = () => {
      const startTime = Date.now();
      debugger; 
      const endTime = Date.now();
      if (endTime - startTime > 100) {
        setIsTampered(true);
      }
    };

    // Run DevTools detection every 500ms
    const interval = setInterval(detectDevTools, 500);

    // 5. Focus/Blur anti-capture protection (Blurs screen when user shifts focus or snipping tool activates)
    const handleBlur = () => {
      document.body.style.filter = 'blur(20px)';
      document.body.style.transition = 'filter 0.15s ease';
    };
    const handleFocus = () => {
      document.body.style.filter = 'none';
    };

    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('dragstart', handleDragStart);

    // Apply CSS to prevent text selection globally
    const style = document.createElement('style');
    style.innerHTML = `
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-user-drag: none !important;
      }
      @media print {
        body { display: none !important; }
      }
    `;
    document.head.appendChild(style);

    return () => {
      clearInterval(interval);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('dragstart', handleDragStart);
      document.head.removeChild(style);
    };
  }, []);

  if (isTampered) {
    return (
      <div className="fixed inset-0 z-[999999] bg-slate-900 flex flex-col items-center justify-center text-center p-6 select-none pointer-events-none">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-4 border border-red-500/20 animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h2 className="text-xl font-black text-white uppercase tracking-tight font-sans">
          Security Alert: Inspection Detected
        </h2>
        <p className="text-xs text-slate-400 mt-2 max-w-[280px] leading-relaxed">
          Source code inspection and developer tools access is strictly prohibited on this website for security reasons.
        </p>
      </div>
    );
  }

  return null;
}
