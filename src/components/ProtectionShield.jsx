import React, { useEffect, useState } from 'react';

export default function ProtectionShield() {
  const [isTampered, setIsTampered] = useState(false);
  const [isCloned, setIsCloned] = useState(false);

  useEffect(() => {
    // ==============================
    // 0. DOMAIN LOCK (Self-Destruct)
    // ==============================
    const allowedHosts = [
      'localhost',
      '127.0.0.1',
      'fidaden.vercel.app',
      'fida-dental-clinic.vercel.app',
      'fida-dental.vercel.app'
    ];
    const currentHost = window.location.hostname;
    // Also allow any *.vercel.app subdomain containing "fida"
    const isVercelFida = currentHost.endsWith('.vercel.app') && currentHost.includes('fida');
    if (!allowedHosts.includes(currentHost) && !isVercelFida) {
      setIsCloned(true);
      // Nuke the DOM so scrapers get nothing
      document.body.innerHTML = '';
      return;
    }

    // ==============================
    // 1. IFRAME BUSTING
    // ==============================
    if (window.self !== window.top) {
      // We are inside an iframe — break out or destroy
      try { window.top.location = window.self.location; } catch (e) {
        setIsCloned(true);
        document.body.innerHTML = '';
        return;
      }
    }

    // ==============================
    // 2. RIGHT-CLICK DISABLED
    // ==============================
    const handleContextMenu = (e) => e.preventDefault();

    // ==============================
    // 3. KEYBOARD SHORTCUT BLOCK
    // ==============================
    const handleKeyDown = (e) => {
      // Block PrintScreen
      if (e.key === 'PrintScreen' || e.key === 'Snapshot') {
        e.preventDefault();
        try { navigator.clipboard?.writeText?.(''); } catch (err) {}
        document.body.style.filter = 'blur(30px)';
        setTimeout(() => { document.body.style.filter = 'none'; }, 1500);
        return false;
      }
      // Block Win+Shift+S (Windows Snip & Sketch) — catches the 's' with meta+shift
      if ((e.metaKey || e.key === 'Meta') && e.shiftKey && (e.key === 'S' || e.key === 's')) {
        e.preventDefault();
        document.body.style.filter = 'blur(30px)';
        setTimeout(() => { document.body.style.filter = 'none'; }, 1500);
        return false;
      }
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && /^[IJCKijck]$/.test(e.key)) ||
        (e.ctrlKey && /^[USACPusacp]$/.test(e.key)) ||
        (e.metaKey && /^[IiUu]$/.test(e.key))
      ) {
        e.preventDefault();
        return false;
      }
    };

    // ==============================
    // 4. DRAG & DROP BLOCK
    // ==============================
    const handleDragStart = (e) => e.preventDefault();
    const handleCopy = (e) => e.preventDefault();
    const handleCut = (e) => e.preventDefault();

    // ==============================
    // 5. DEVTOOLS DETECTION
    // ==============================
    const detectDevTools = () => {
      const el = new Image();
      Object.defineProperty(el, 'id', {
        get: () => { setIsTampered(true); }
      });
      console.log('%c', el);
    };
    const devToolsInterval = setInterval(detectDevTools, 1000);

    // ==============================
    // 6. FOCUS/BLUR ANTI-CAPTURE
    // ==============================
    const handleBlur = () => {
      document.body.style.filter = 'blur(25px)';
      document.body.style.transition = 'filter 0.1s ease';
    };
    const handleFocus = () => {
      document.body.style.filter = 'none';
      document.body.style.transition = 'filter 0.3s ease';
    };

    // ==============================
    // 7. PAGE VISIBILITY API (Tab Switch / Minimize)
    // ==============================
    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.body.style.filter = 'blur(25px)';
      } else {
        document.body.style.filter = 'none';
      }
    };

    // ==============================
    // 8. MOUSE LEAVE WINDOW (Cursor exits browser — snipping tool, etc.)
    // ==============================
    const handleMouseLeave = () => {
      document.body.style.filter = 'blur(20px)';
      document.body.style.transition = 'filter 0.15s ease';
    };
    const handleMouseEnter = () => {
      document.body.style.filter = 'none';
      document.body.style.transition = 'filter 0.3s ease';
    };

    // ==============================
    // 9. 10-SECOND INACTIVITY AUTO-BLUR
    // ==============================
    let idleTimeout;
    const resetIdleTimer = () => {
      // Unblur immediately when user shows activity
      document.body.style.filter = 'none';
      document.body.style.transition = 'filter 0.3s ease';

      if (idleTimeout) clearTimeout(idleTimeout);
      idleTimeout = setTimeout(() => {
        document.body.style.filter = 'blur(30px)';
      }, 10000); // 10 seconds
    };

    // Initialize timer
    resetIdleTimer();

    // Attach listeners for all user activities
    window.addEventListener('scroll', resetIdleTimer);
    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('mousedown', resetIdleTimer);
    window.addEventListener('keydown', resetIdleTimer);
    window.addEventListener('touchstart', resetIdleTimer);

    // ==============================
    // 10. CLIPBOARD CLEARING LOOP (Wipe clipboard every 2 seconds)
    // ==============================
    const clipboardInterval = setInterval(() => {
      try { navigator.clipboard?.writeText?.(''); } catch (err) {}
    }, 2000);

    // ==============================
    // 11. CONSOLE CLEAR + WARNING
    // ==============================
    console.clear();
    console.log(
      '%c⛔ STOP! This is a protected website.',
      'color:red;font-size:30px;font-weight:bold;'
    );
    console.log(
      '%cSource code inspection is strictly prohibited. All activity is monitored.',
      'color:gray;font-size:14px;'
    );

    // ==============================
    // REGISTER ALL EVENT LISTENERS
    // ==============================
    window.addEventListener('scroll', resetIdleTimer);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('dragstart', handleDragStart);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCut);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);

    // ==============================
    // INJECT GLOBAL CSS PROTECTION
    // ==============================
    const style = document.createElement('style');
    style.id = 'fida-shield-css';
    style.innerHTML = `
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-user-drag: none !important;
        -webkit-touch-callout: none !important;
      }
      img, video, canvas, svg {
        pointer-events: none !important;
        -webkit-user-drag: none !important;
      }
      @media print {
        html, body { display: none !important; visibility: hidden !important; }
      }
    `;
    document.head.appendChild(style);

    // ==============================
    // CLEANUP
    // ==============================
    return () => {
      clearInterval(devToolsInterval);
      clearInterval(clipboardInterval);
      if (idleTimeout) clearTimeout(idleTimeout);
      window.removeEventListener('scroll', resetIdleTimer);
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('mousedown', resetIdleTimer);
      window.removeEventListener('keydown', resetIdleTimer);
      window.removeEventListener('touchstart', resetIdleTimer);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCut);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
      const s = document.getElementById('fida-shield-css');
      if (s) document.head.removeChild(s);
    };
  }, []);

  // ==============================
  // RENDER: CLONE BLOCK SCREEN
  // ==============================
  if (isCloned) {
    return (
      <div className="fixed inset-0 z-[999999] bg-black flex flex-col items-center justify-center text-center p-6 select-none" style={{ pointerEvents: 'all' }}>
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-4 border border-red-500/20">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h2 className="text-xl font-black text-white uppercase tracking-tight font-sans">
          ⛔ Unauthorized Access
        </h2>
        <p className="text-xs text-slate-400 mt-2 max-w-[320px] leading-relaxed">
          This website is licensed exclusively to FIDA DENTAL CLINIC. Hosting on unauthorized servers is strictly prohibited and monitored.
        </p>
      </div>
    );
  }

  // ==============================
  // RENDER: DEVTOOLS TAMPER BLOCK
  // ==============================
  if (isTampered) {
    return (
      <div className="fixed inset-0 z-[999999] bg-slate-900 flex flex-col items-center justify-center text-center p-6 select-none" style={{ pointerEvents: 'all' }}>
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-4 border border-red-500/20 animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h2 className="text-xl font-black text-white uppercase tracking-tight font-sans">
          🛡️ Security Alert: Inspection Detected
        </h2>
        <p className="text-xs text-slate-400 mt-2 max-w-[280px] leading-relaxed">
          Developer tools access is strictly prohibited. This incident has been logged.
        </p>
      </div>
    );
  }

  // ==============================
  // RENDER: WATERMARK OVERLAY (visible in screenshots/recordings)
  // ==============================
  return (
    <div className="fixed inset-0 z-[9995] pointer-events-none select-none overflow-hidden opacity-[0.06]" style={{ transform: 'rotate(-30deg)', transformOrigin: 'center center' }}>
      <div className="absolute inset-[-50%] flex flex-wrap gap-16 p-8 font-sans font-black text-[11px] text-slate-900 tracking-[0.3em] uppercase leading-loose">
        {Array.from({ length: 120 }).map((_, i) => (
          <div key={i} className="whitespace-nowrap px-8">
            FIDA DENTAL CLINIC — PROTECTED CONTENT
          </div>
        ))}
      </div>
    </div>
  );
}
