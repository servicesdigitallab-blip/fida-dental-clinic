import React, { useEffect, useState, useRef } from 'react';

export default function ProtectionShield() {
  const [isTampered, setIsTampered] = useState(false);
  const [isCloned, setIsCloned] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    // ==============================
    // 0. OBFUSCATED DOMAIN LOCK (Self-Destruct on Clone)
    // ==============================
    const authorizedKeys = [
      'bG9jYWxob3N0',                               // localhost
      'MTI3LjAuMC4x',                               // 127.0.0.1
      'ZmlkYWRlbi52ZXJjZWwuYXBw',                   // fidaden.vercel.app
      'ZmlkYS1kZW50YWwtY2xpbmljLnZlcmNlbC5hcHA=',   // fida-dental-clinic.vercel.app
      'ZmlkYS1kZW50YWwudmVyY2VsLmFwcA=='            // fida-dental.vercel.app
    ];

    const currentHostname = window.location.hostname;
    let isAuthorized = false;

    for (let key of authorizedKeys) {
      try {
        if (currentHostname === atob(key)) {
          isAuthorized = true;
          break;
        }
      } catch (e) {}
    }

    // Also support any local vercel preview or customized branch builds
    if (currentHostname.endsWith('.vercel.app') && currentHostname.includes('fida')) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      setIsCloned(true);
      document.body.innerHTML = '';
      return;
    }

    // ==============================
    // 1. IFRAME BUSTING
    // ==============================
    if (window.self !== window.top) {
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
    // 3. KEYBOARD SHORTCUT BLOCK & FLASH SHIELD
    // ==============================
    const flashOverlay = document.createElement('div');
    flashOverlay.id = 'fida-flash-overlay';
    flashOverlay.style.cssText = 'position:fixed;inset:0;background:#000;z-index:999999;pointer-events:none;opacity:0;transition:opacity 0.05s;';
    document.body.appendChild(flashOverlay);

    const flashBlack = () => {
      flashOverlay.style.opacity = '1';
      document.body.style.filter = 'blur(45px)';
      try { navigator.clipboard?.writeText?.(''); } catch (err) {}
      setTimeout(() => {
        try { navigator.clipboard?.writeText?.(''); } catch (err) {}
      }, 300);
      setTimeout(() => {
        flashOverlay.style.opacity = '0';
        document.body.style.filter = 'none';
      }, 2000);
    };

    const handleKeyDown = (e) => {
      // Intercept PrintScreen / Snipping Keys
      if (e.key === 'PrintScreen' || e.key === 'Snapshot') {
        e.preventDefault();
        flashBlack();
        return false;
      }
      if ((e.metaKey || e.key === 'Meta') && e.shiftKey && (e.key === 'S' || e.key === 's')) {
        e.preventDefault();
        flashBlack();
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

    const handleKeyUp = (e) => {
      if (e.key === 'PrintScreen' || e.key === 'Snapshot') {
        e.preventDefault();
        flashBlack();
        return false;
      }
    };

    // ==============================
    // 4. DRAG / COPY / CUT BLOCKS
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
    // 7. PAGE VISIBILITY API
    // ==============================
    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.body.style.filter = 'blur(25px)';
      } else {
        document.body.style.filter = 'none';
      }
    };

    // ==============================
    // 8. MOUSE BOUNDARY PROTECTION
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
    // 9. 10-SECOND INACTIVITY BLUR
    // ==============================
    let idleTimeout;
    const resetIdleTimer = () => {
      document.body.style.filter = 'none';
      document.body.style.transition = 'filter 0.3s ease';

      if (idleTimeout) clearTimeout(idleTimeout);
      idleTimeout = setTimeout(() => {
        document.body.style.filter = 'blur(30px)';
      }, 10000); // 10 seconds
    };
    resetIdleTimer();

    // ==============================
    // 10. CLIPBOARD CLEANER TASK
    // ==============================
    const clipboardInterval = setInterval(() => {
      try { navigator.clipboard?.writeText?.(''); } catch (err) {}
    }, 2000);

    // ==============================
    // 11. CONSOLE SECURITY WARNING
    // ==============================
    console.clear();
    console.log('%c⛔ STOP!', 'color:red;font-size:35px;font-weight:black;');
    console.log('%cSource code cloning or resource extraction is strictly prohibited.', 'color:gray;font-size:14px;');

    // REGISTER EVENT LISTENERS
    window.addEventListener('scroll', resetIdleTimer);
    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('mousedown', resetIdleTimer);
    window.addEventListener('keydown', resetIdleTimer);
    window.addEventListener('touchstart', resetIdleTimer);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', handleKeyUp, true);
    window.addEventListener('dragstart', handleDragStart);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCut);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);

    // INJECT INLINE SELECTION LOCK CSS
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
      window.removeEventListener('keyup', handleKeyUp, true);
      window.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCut);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
      const s = document.getElementById('fida-shield-css');
      if (s) document.head.removeChild(s);
      const fo = document.getElementById('fida-flash-overlay');
      if (fo) document.body.removeChild(fo);
    };
  }, []);

  // ==============================
  // DYNAMIC RENDER WATERMARK GRID CANVAS (Animates constantly)
  // ==============================
  useEffect(() => {
    if (isTampered || isCloned) return;

    let frameId;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      // Rotate the watermark pattern
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(-28 * Math.PI / 180);

      // Micro-shimmer/floating shift calculation to distort captures and recordings
      const timeOffset = (Date.now() / 25) % 360;
      const opacity = 0.05 + Math.sin(Date.now() / 300) * 0.015; // Shimmers between 0.035 and 0.065

      ctx.font = '900 11px Inter, sans-serif';
      ctx.fillStyle = `rgba(15, 23, 42, ${opacity})`;
      ctx.letterSpacing = '3px';

      const xGap = 350;
      const yGap = 130;

      for (let x = -canvas.width * 1.5; x < canvas.width * 1.5; x += xGap) {
        for (let y = -canvas.height * 1.5; y < canvas.height * 1.5; y += yGap) {
          // Floating pattern displacement
          ctx.fillText('FIDA DENTAL CLINIC — PROTECTED CONTENT', x + timeOffset, y);
        }
      }

      ctx.restore();
      frameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isTampered, isCloned]);

  // Unauthorized clone domain nuke screen
  if (isCloned) {
    return (
      <div className="fixed inset-0 z-[999999] bg-black flex flex-col items-center justify-center text-center p-6 select-none" style={{ pointerEvents: 'all' }}>
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-4 border border-red-500/20">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h2 className="text-xl font-black text-white uppercase tracking-tight font-sans">
          ⛔ Unauthorized Domain
        </h2>
        <p className="text-xs text-slate-400 mt-2 max-w-[320px] leading-relaxed">
          Hosting this site on unauthorized domains or clones is prohibited.
        </p>
      </div>
    );
  }

  // Developer tools detection screen
  if (isTampered) {
    return (
      <div className="fixed inset-0 z-[999999] bg-slate-950 flex flex-col items-center justify-center text-center p-6 select-none" style={{ pointerEvents: 'all' }}>
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

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-[9995] pointer-events-none select-none overflow-hidden"
    />
  );
}
