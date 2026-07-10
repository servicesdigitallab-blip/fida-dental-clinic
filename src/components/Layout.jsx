import React, { useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';
import { Menu, Phone, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Four-point inline sparkle component
const FloatSparkle = ({ className, style }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={`absolute pointer-events-none text-secondary fill-secondary/40 ${className}`} 
    style={style}
  >
    <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z" />
  </svg>
);

export default function Layout({ children }) {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [dotPos, setDotPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isServicesHovered, setIsServicesHovered] = useState(false);
  
  // Premium Mouse Interactive States
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [ripples, setRipples] = useState([]);
  
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const headerRef = useRef(null);

  const sections = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'services', label: 'Services', href: '#services' },
    { id: 'transformations', label: 'Smile Gallery', href: '#transformations' },
    { id: 'team', label: 'Our Team', href: '#team' },
    { id: 'testimonials', label: 'Testimonials', href: '#testimonials' },
    { id: 'booking', label: 'Contact', href: '#booking' },
  ];

  // Particles inside header that repel from the cursor
  const particlesBase = [
    { id: 1, base: { x: 15, y: 40 } },
    { id: 2, base: { x: 45, y: 30 } },
    { id: 3, base: { x: 85, y: 60 } },
  ];

  const getRepelledStyle = (particle) => {
    if (!isSticky || !isHeaderHovered || !headerRef.current) {
      return {
        left: `${particle.base.x}%`,
        top: `${particle.base.y}%`,
        transform: 'translate(-50%, -50%)',
        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      };
    }

    const rect = headerRef.current.getBoundingClientRect();
    const partPxX = (particle.base.x / 100) * rect.width;
    const partPxY = (particle.base.y / 100) * rect.height;

    const dx = partPxX - glowPos.x;
    const dy = partPxY - glowPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const repelRadius = 120;
    let offsetX = 0;
    let offsetY = 0;

    if (distance < repelRadius && distance > 0) {
      const force = (repelRadius - distance) / repelRadius;
      const strength = 30; // pixels to push away
      offsetX = (dx / distance) * force * strength;
      offsetY = (dy / distance) * force * strength;
    }

    return {
      left: `${particle.base.x}%`,
      top: `${particle.base.y}%`,
      transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`,
      transition: 'transform 0.1s ease-out',
    };
  };

  // Scroll detection to toggle sticky & active links
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track active section using IntersectionObserver to prevent layout thrashing on mobile
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -40% 0px',
      threshold: 0,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  // Smooth scroll initialization (Desktop only to prevent touch scrolling lag on mobile)
  useEffect(() => {
    if (window.innerWidth < 1024) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    return () => {
      lenis.destroy();
    };
  }, []);

  // Custom cursor movement
  useEffect(() => {
    const onMouseMove = (e) => {
      const { clientX, clientY } = e;
      setDotPos({ x: clientX, y: clientY });
      
      setTimeout(() => {
        setCursorPos({ x: clientX, y: clientY });
      }, 50);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      const isInteractive = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a') || 
        target.closest('.interactive-card') ||
        target.closest('input') ||
        target.closest('select') ||
        target.closest('textarea') ||
        target.classList.contains('slider-handle') ||
        target.closest('.slider-handle');
        
      setIsHovered(!!isInteractive);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  // Mouse tilt / interactive glow handlers
  const handleHeaderMouseMove = (e) => {
    if (!isSticky || !headerRef.current) return;
    const rect = headerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setGlowPos({ x, y });
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const tiltX = ((e.clientX - rect.left - centerX) / centerX) * 5;
    const tiltY = ((e.clientY - rect.top - centerY) / centerY) * 5;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleHeaderMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHeaderHovered(false);
  };

  // Smooth scroll and target section glow animation
  const handleLinkClick = (e, href) => {
    e.preventDefault();
    const targetId = href.substring(1);
    const element = document.getElementById(targetId);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });

      element.classList.add('glow-section');
      setTimeout(() => {
        element.classList.remove('glow-section');
      }, 2000);
    }
    setMobileMenuOpen(false);
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    const element = document.getElementById('home');
    if (element) {
      element.classList.add('glow-section');
      setTimeout(() => {
        element.classList.remove('glow-section');
      }, 2000);
    }
  };

  // Call button ripple click handler
  const handlePhoneClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
  };

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-800 antialiased font-sans select-none overflow-hidden">
      {/* Custom Cursor */}
      <div 
        ref={cursorRef}
        className={`custom-cursor hidden md:block ${isHovered ? 'hovered' : ''}`}
        style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}
      />
      <div 
        ref={dotRef}
        className="custom-cursor-dot hidden md:block"
        style={{ left: `${dotPos.x}px`, top: `${dotPos.y}px` }}
      />

      {/* Floating Background Blobs (Parallax & Ambient) */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[10%] left-[5%] w-96 h-96 rounded-full bg-blue-300/20 blur-3xl animate-float" />
        <div className="absolute top-[40%] right-[5%] w-[450px] h-[450px] rounded-full bg-sky-200/20 blur-3xl animate-float-delayed" />
        <div className="absolute bottom-[20%] left-[10%] w-[350px] h-[350px] rounded-full bg-blue-200/15 blur-3xl animate-float" />
        <div className="absolute top-[80%] right-[10%] w-[400px] h-[400px] rounded-full bg-indigo-200/15 blur-3xl animate-float-delayed" />
      </div>

      {/* Radial soft glow that follows the cursor */}
      <div 
        className="hidden md:block pointer-events-none fixed inset-0 z-10 transition-opacity duration-500"
        style={{
          background: `radial-gradient(400px at ${dotPos.x}px ${dotPos.y}px, rgba(0, 102, 255, 0.04), transparent 80%)`
        }}
      />

      {/* Outer Floating Wrapper */}
      <div className={`fixed z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isSticky 
          ? 'top-0 left-0 right-0 w-full' 
          : 'top-5 left-6 right-6 lg:left-16 lg:right-16 w-[calc(100%-3rem)] lg:w-[calc(100%-8rem)] max-w-7xl mx-auto animate-navbar-float'
      }`}>
        
        {/* Sparkles Floating around Hero Attached Navbar */}
        {!isSticky && (
          <>
            <FloatSparkle className="top-[-16px] left-[15%] w-4 h-4 animate-sparkle-rotate" style={{ animationDelay: '0s' }} />
            <FloatSparkle className="bottom-[-16px] left-[45%] w-3.5 h-3.5 animate-sparkle-rotate" style={{ animationDelay: '1.5s' }} />
            <FloatSparkle className="top-[30%] right-[-12px] w-3 h-3 animate-sparkle-rotate" style={{ animationDelay: '2.8s' }} />
            <FloatSparkle className="bottom-[10%] left-[-16px] w-4 h-4 animate-sparkle-rotate" style={{ animationDelay: '0.7s' }} />
          </>
        )}

        {/* Cinematic Header Container */}
        <motion.header
          ref={headerRef}
          onMouseMove={handleHeaderMouseMove}
          onMouseEnter={() => setIsHeaderHovered(true)}
          onMouseLeave={handleHeaderMouseLeave}
          animate={!isSticky ? {
            y: tilt.y,
            x: tilt.x,
            borderRadius: '24px',
            backgroundColor: 'rgba(255, 255, 255, 0.75)',
            borderColor: 'rgba(241, 245, 249, 1)',
            boxShadow: '0 4px 20px -2px rgba(0, 102, 255, 0.05)',
            paddingTop: '16px',
            paddingBottom: '16px',
            paddingLeft: '24px',
            paddingRight: '24px',
          } : {
            y: [-20, 0],
            borderRadius: '0px',
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            boxShadow: '0 0 30px rgba(0, 102, 255, 0.25)',
            paddingTop: '12px',
            paddingBottom: '12px',
            paddingLeft: '40px',
            paddingRight: '40px',
            x: 0,
          }}
          transition={{
            y: { duration: 0.5, ease: [0.85, 0, 0.15, 1] },
            borderRadius: { duration: 0.5, ease: [0.85, 0, 0.15, 1] },
            backgroundColor: { duration: 0.5, ease: [0.85, 0, 0.15, 1] },
            borderColor: { duration: 0.5, ease: [0.85, 0, 0.15, 1] },
            boxShadow: { duration: 0.5, ease: [0.85, 0, 0.15, 1] },
            padding: { duration: 0.5, ease: [0.85, 0, 0.15, 1] }
          }}
          className="relative w-full flex items-center justify-between border backdrop-blur-xl overflow-hidden"
        >
          {/* Subtle light sweep animation inside navbar */}
          {isSticky && (
            <div className="absolute inset-0 w-1/3 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none z-0 animate-reflection" />
          )}

          {/* Mouse interactive radial glow overlay */}
          {isSticky && isHeaderHovered && (
            <div 
              className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-0 bg-[radial-gradient(150px_at_var(--glow-x)_var(--glow-y),rgba(0,102,255,0.18),transparent)]"
              style={{
                '--glow-x': `${glowPos.x}px`,
                '--glow-y': `${glowPos.y}px`
              }}
            />
          )}

          {/* Repelling ambient particles inside header */}
          {isSticky && particlesBase.map((p) => (
            <div 
              key={p.id}
              className="absolute w-2 h-2 rounded-full bg-secondary/30 blur-[1px] pointer-events-none z-0"
              style={getRepelledStyle(p)}
            />
          ))}

          {/* Logo */}
          <a 
            href="#home" 
            onClick={handleLogoClick}
            className="flex items-center gap-3 group relative z-10"
          >
            <div className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-105 ${
              !isSticky ? 'bg-primary-light' : 'bg-white/10'
            }`}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                className={`w-6 h-6 transition-all duration-500 group-hover:rotate-[12deg] ${
                  !isSticky ? 'stroke-primary fill-primary/10 text-primary' : 'stroke-white fill-white/10 text-white'
                }`}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 3C9 3 10 4.5 12 4.5C14 4.5 15 3 17 3C19 3 21 5 21 8.5C21 12 19 14.5 18 16.5C17.2 18.1 16 19.5 15.5 21C15 22.5 13.5 22.5 12 21C10.5 22.5 9 22.5 8.5 21C8 19.5 6.8 18.1 6 16.5C5 14.5 3 12 3 8.5C3 5 5 3 7 3Z" />
              </svg>
              <Sparkles className={`absolute -top-1.5 -right-1.5 w-4 h-4 transition-all duration-500 group-hover:scale-110 ${
                !isSticky ? 'text-primary fill-primary/20' : 'text-secondary fill-secondary/20'
              } animate-sparkle-rotate`} />
            </div>
            <div>
              <div className={`text-xl font-bold tracking-tight leading-none transition-colors duration-500 ${
                !isSticky ? 'text-slate-800' : 'text-white'
              }`}>
                FIDA <span className={`transition-colors duration-500 ${
                  !isSticky ? 'text-primary' : 'text-secondary'
                }`}>DENTAL</span>
              </div>
              <div className={`text-[10px] font-medium tracking-wider uppercase transition-colors duration-500 ${
                !isSticky ? 'text-slate-400' : 'text-white/60'
              }`}>
                CLINIC
              </div>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 relative z-10">
            {sections.map((link, idx) => {
              const isActive = activeSection === link.id || (link.id === 'home' && activeSection === 'home');
              
              if (link.label === 'Services') {
                return (
                  <div 
                    key={idx}
                    className="relative py-4"
                    onMouseEnter={() => setIsServicesHovered(true)}
                    onMouseLeave={() => setIsServicesHovered(false)}
                  >
                    <motion.a 
                      href={link.href || `#${link.id}`}
                      onClick={(e) => handleLinkClick(e, link.href || `#${link.id}`)}
                      onMouseEnter={() => setHoveredIdx(idx)}
                      onMouseLeave={() => setHoveredIdx(null)}
                      className={`relative py-1 text-sm font-semibold transition-colors duration-500 flex items-center gap-1 group/link ${
                        isActive 
                          ? (!isSticky ? 'text-primary font-bold active-pulse' : 'text-secondary font-bold active-pulse') 
                          : (!isSticky ? 'text-slate-600 hover:text-primary' : 'text-white/80 hover:text-secondary')
                      }`}
                    >
                      <motion.span
                        whileHover={{ y: -2 }}
                        className="relative z-10"
                      >
                        Services
                      </motion.span>

                      {/* Sparkle pop up on hover */}
                      <AnimatePresence>
                        {hoveredIdx === idx && (
                          <motion.span 
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="absolute -top-1.5 -right-2 text-secondary z-20"
                          >
                            <Sparkles className="w-3 h-3 fill-secondary" />
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {/* Underline sliding left-right on hover */}
                      <span className="absolute bottom-0 left-0 w-full h-[2px] overflow-hidden pointer-events-none">
                        <span className={`absolute inset-0 transform -translate-x-full group-hover/link:translate-x-0 transition-transform duration-300 ease-out ${
                          !isSticky ? 'bg-primary' : 'bg-secondary'
                        }`} />
                      </span>

                      {/* Sliding active underline layout */}
                      {isActive && (
                        <motion.div 
                          layoutId="activeUnderline"
                          className={`absolute bottom-0 left-0 right-0 h-[2px] ${
                            !isSticky ? 'bg-primary shadow-[0_0_8px_#0066ff]' : 'bg-secondary shadow-[0_0_8px_#00c6ff]'
                          }`}
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </motion.a>
                    
                    {/* Services Dropdown Menu */}
                    <AnimatePresence>
                      {isServicesHovered && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                          className={`absolute top-full left-1/2 -translate-x-1/2 w-72 backdrop-blur-xl border rounded-2xl shadow-xl p-4 flex flex-col gap-1.5 z-50 ${
                            isSticky 
                              ? 'bg-slate-900/95 border-white/10 shadow-slate-950/50' 
                              : 'bg-white/95 border-blue-500/10 shadow-blue-500/5'
                          }`}
                        >
                          {[
                            { name: 'General Dentistry', desc: 'Family & preventive care' },
                            { name: 'Cosmetic Dentistry', desc: 'Aesthetic smile makeovers' },
                            { name: 'Dental Implants', desc: 'Permanent tooth replacements' },
                            { name: 'Orthodontics', desc: 'Braces & clear aligners' },
                            { name: 'Teeth Whitening', desc: 'Instant teeth brightening' }
                          ].map((service, sIdx) => (
                            <motion.a 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: sIdx * 0.04 }}
                              key={service.name}
                              href="#services"
                              onClick={(e) => {
                                setIsServicesHovered(false);
                                handleLinkClick(e, '#services');
                              }}
                              className={`group/item flex flex-col gap-0.5 p-2.5 rounded-xl transition-all duration-200 text-left border border-transparent ${
                                isSticky 
                                  ? 'hover:bg-white/10 hover:border-white/5' 
                                  : 'hover:bg-primary-light hover:border-blue-500/10'
                              }`}
                            >
                              <span className={`text-xs font-bold transition-colors flex items-center gap-1 ${
                                isSticky 
                                  ? 'text-white/90 group-hover/item:text-secondary' 
                                  : 'text-slate-800 group-hover/item:text-primary'
                              }`}>
                                {service.name}
                                <ArrowRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all" />
                              </span>
                              <span className={`text-[10px] leading-none ${
                                isSticky ? 'text-white/40' : 'text-slate-400'
                              }`}>{service.desc}</span>
                            </motion.a>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }
              
              return (
                <motion.a 
                  key={idx} 
                  href={link.href || `#${link.id}`}
                  onClick={(e) => handleLinkClick(e, link.href || `#${link.id}`)}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className={`relative py-1 text-sm font-semibold transition-colors duration-500 flex items-center gap-1 group/link ${
                    isActive 
                      ? (!isSticky ? 'text-primary font-bold active-pulse' : 'text-secondary font-bold active-pulse') 
                      : (!isSticky ? 'text-slate-600 hover:text-primary' : 'text-white/80 hover:text-secondary')
                  }`}
                >
                  <motion.span
                    whileHover={{ y: -2 }}
                    className="relative z-10"
                  >
                    {link.label}
                  </motion.span>

                  {/* Sparkle pop up on hover */}
                  <AnimatePresence>
                    {hoveredIdx === idx && (
                      <motion.span 
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute -top-1.5 -right-2 text-secondary z-20"
                      >
                        <Sparkles className="w-3 h-3 fill-secondary" />
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Underline sliding left-right on hover */}
                  <span className="absolute bottom-0 left-0 w-full h-[2px] overflow-hidden pointer-events-none">
                    <span className={`absolute inset-0 transform -translate-x-full group-hover/link:translate-x-0 transition-transform duration-300 ease-out ${
                      !isSticky ? 'bg-primary' : 'bg-secondary'
                    }`} />
                  </span>

                  {/* Sliding active underline layout */}
                  {isActive && (
                    <motion.div 
                      layoutId="activeUnderline"
                      className={`absolute bottom-0 left-0 right-0 h-[2px] ${
                        !isSticky ? 'bg-primary shadow-[0_0_8px_#0066ff]' : 'bg-secondary shadow-[0_0_8px_#00c6ff]'
                      }`}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.a>
              );
            })}
          </nav>

          {/* Right Action Menu */}
          <div className="flex items-center gap-4 relative z-10">
            <motion.a 
              href="tel:+923214043448" 
              onClick={handlePhoneClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`group relative overflow-hidden hidden sm:flex items-center gap-2.5 px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 border cursor-pointer ${
                !isSticky 
                  ? 'bg-primary text-white border-primary/10 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25 hover:bg-primary-dark' 
                  : 'bg-secondary text-slate-900 border-secondary/10 hover:bg-secondary/90 shadow-[0_0_15px_rgba(0,198,255,0.3)] hover:shadow-[0_0_25px_rgba(0,198,255,0.6)]'
              }`}
            >
              {/* Shine Sweep Overlay */}
              <div className="absolute top-0 -inset-full h-full w-1/2 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/30 opacity-40 group-hover:animate-shine pointer-events-none" />
              
              {/* Button Ripples */}
              {ripples.map((r) => (
                <span 
                  key={r.id}
                  className="absolute bg-white/30 rounded-full animate-ripple pointer-events-none"
                  style={{
                    left: r.x,
                    top: r.y,
                    width: 100,
                    height: 100,
                    transform: 'translate(-50%, -50%) scale(0)',
                  }}
                />
              ))}

              <Phone className="w-4 h-4 group-hover:rotate-[18deg] transition-transform duration-300" />
              <span>+92 321 4043448</span>
            </motion.a>
            
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-xl transition-colors cursor-pointer ${
                !isSticky ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </motion.header>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Dark blur backdrop overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-md lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            {/* Drawer Panel */}
            <motion.div 
              initial={{ x: '100%', opacity: 0.9 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0.9 }}
              transition={{ type: 'spring', damping: 26, stiffness: 180 }}
              className="fixed top-0 right-0 w-80 h-full bg-slate-900/90 backdrop-blur-2xl border-l border-white/10 shadow-2xl p-8 flex flex-col gap-6 z-50 lg:hidden text-left text-white"
            >
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <span className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-secondary fill-secondary/10" strokeWidth="2">
                    <path d="M7 3C9 3 10 4.5 12 4.5C14 4.5 15 3 17 3C19 3 21 5 21 8.5C21 12 19 14.5 18 16.5C17.2 18.1 16 19.5 15.5 21C15 22.5 13.5 22.5 12 21C10.5 22.5 9 22.5 8.5 21C8 19.5 6.8 18.1 6 16.5C5 14.5 3 12 3 8.5C3 5 5 3 7 3Z" />
                  </svg>
                  <span>FIDA DENTAL</span>
                </span>
                <motion.button 
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ✕
                </motion.button>
              </div>
              <nav className="flex flex-col gap-4 text-base font-semibold text-white/80">
                {sections.map((link, i) => (
                  <motion.a 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.35, ease: 'easeOut' }}
                    key={link.id}
                    href={link.href || `#${link.id}`} 
                    onClick={(e) => handleLinkClick(e, link.href || `#${link.id}`)} 
                    className={`hover:text-secondary py-2.5 border-b border-white/5 transition-colors flex items-center justify-between group ${
                      activeSection === link.id ? 'text-secondary font-bold text-shadow-sm' : ''
                    }`}
                  >
                    <span>{link.label}</span>
                    <span className="text-xs opacity-35 group-hover:translate-x-1 group-hover:text-secondary transition-all">→</span>
                  </motion.a>
                ))}
              </nav>
              
              <div className="mt-auto flex flex-col gap-3">
                <motion.a 
                  href="tel:+923214043448" 
                  onClick={handlePhoneClick}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative overflow-hidden flex items-center justify-center gap-2 px-5 py-3.5 bg-primary text-white rounded-xl shadow-lg shadow-blue-500/20 font-bold hover:shadow-blue-500/35 transition-all duration-300 cursor-pointer border border-primary/20"
                >
                  <div className="absolute top-0 -inset-full h-full w-1/2 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/20 opacity-40 group-hover:animate-shine pointer-events-none" />
                  <Phone className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  <span>Call Now</span>
                </motion.a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Page Content */}
      <main className="relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-slate-950 text-slate-400 py-20 px-6 lg:px-16 border-t border-slate-900 overflow-hidden">
        {/* Glow backdrop blobs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
        
        {/* Glow Top Accent Line */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
          {/* Brand Info */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="flex flex-col gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-primary">
                  <path d="M12 2C8.5 2 6 4.5 6 8c0 3.5 2.5 5 4 8.5 1 2.3.5 3.5 2 3.5s1-1.2 2-3.5c1.5-3.5 4-5 4-8.5 0-3.5-2.5-6-6-6zm0 8.5c-.8 0-1.5-.7-1.5-1.5S11.2 7.5 12 7.5s1.5.7 1.5 1.5-.7 1.5-1.5 1.5z" />
                </svg>
              </div>
              <span className="text-xl font-black text-white tracking-tight">FIDA DENTAL CLINIC</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-[280px]">
              Creating beautifully confident smiles using state-of-the-art dental technology and personalized premium treatments.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-white font-bold mb-5 text-sm tracking-wider uppercase">Quick Links</h4>
            <ul className="flex flex-col gap-3 text-xs">
              <li>
                <a href="#about" className="hover:text-primary transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3.5 h-3.5 text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  <span>About Practice</span>
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-primary transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3.5 h-3.5 text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  <span>Treatments & Services</span>
                </a>
              </li>
              <li>
                <a href="#transformations" className="hover:text-primary transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3.5 h-3.5 text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  <span>Before & After Gallery</span>
                </a>
              </li>
              <li>
                <a href="#team" className="hover:text-primary transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3.5 h-3.5 text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  <span>Expert Team</span>
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Hours */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <h4 className="text-white font-bold mb-5 text-sm tracking-wider uppercase">Working Hours</h4>
            <ul className="flex flex-col gap-3 text-xs">
              <li className="flex items-center gap-2 text-primary font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Open 24/7 Every Day</span>
              </li>
              <li>Monday - Sunday: 24 Hours Open</li>
              <li>Holidays: Emergency & General open</li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col gap-4"
          >
            <h4 className="text-white font-bold mb-1 text-sm tracking-wider uppercase">Clinic Address</h4>
            <p className="text-xs leading-relaxed max-w-[240px]">
              12A, Premium Health Square,<br />
              Phase 5, DHA, Lahore, Pakistan
            </p>
            <div className="mt-2 py-3 px-4 bg-slate-900/50 rounded-2xl border border-white/5 flex items-center gap-3 w-fit select-none">
              <Phone className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-white text-xs font-bold font-sans">+92 321 4043448</span>
            </div>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-500 relative z-10">
          <p>© 2026 FIDA DENTAL CLINIC. Protected by High-Security Protection Shield. All rights reserved.</p>
          <div className="flex items-center gap-1.5 text-slate-400 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span>SSL Secured Encryption</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
