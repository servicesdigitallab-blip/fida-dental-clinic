import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Star, Sparkles, Shield, Calendar, Sparkle } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 50, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.85,
      ease: [0.16, 1, 0.3, 1], // easeOutExpo
    },
  },
};

const cardStaggerVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function Hero() {
  return (
    <section id="home" className="relative min-h-[90vh] flex flex-col justify-between pt-8 lg:pt-16 pb-12 px-6 lg:px-16 overflow-hidden">
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid opacity-70 pointer-events-none" />
      
      {/* Floating Elements (Visual Polish) */}
      <div className="absolute top-[15%] left-[45%] w-8 h-8 text-primary/20 animate-float pointer-events-none">
        <Sparkle className="w-full h-full fill-primary/10" />
      </div>
      <div className="absolute bottom-[35%] left-[8%] w-10 h-10 text-secondary/30 animate-float-delayed pointer-events-none">
        <Sparkle className="w-full h-full fill-secondary/10" />
      </div>
      <div className="absolute top-[40%] right-[42%] w-7 h-7 text-primary/30 animate-float pointer-events-none">
        <Shield className="w-full h-full" />
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center z-10">
        
        {/* Left Side: Copywriting & CTAs */}
        <motion.div 
          className="lg:col-span-7 flex flex-col gap-6 text-left"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
        >
          {/* Badge */}
          <motion.div 
            variants={fadeUpVariants}
            className="self-start flex items-center gap-2 px-4 py-1.5 bg-primary-light text-primary rounded-full text-xs font-bold tracking-wide uppercase shadow-sm border border-primary/10"
          >
            <Sparkles className="w-3.5 h-3.5 fill-primary/10" />
            <span>Your Smile, Our Passion</span>
          </motion.div>

          {/* Heading */}
          <motion.h1 
            variants={fadeUpVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-[1.1] tracking-tight"
          >
            Healthy Smile,<br />
            <span className="text-gradient drop-shadow-sm relative">
              Confident You!
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-secondary/40 fill-none" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0,5 Q50,10 100,5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>
          </motion.h1>

          {/* Subheading Description */}
          <motion.p 
            variants={fadeUpVariants}
            className="text-base sm:text-lg text-slate-500 max-w-xl leading-relaxed"
          >
            FIDA DENTAL CLINIC is dedicated to providing exceptional dental services with care, comfort, and advanced technology. Your smile is our main goal.
          </motion.p>

          {/* Call To Actions */}
          <motion.div 
            variants={fadeUpVariants}
            className="flex flex-wrap items-center gap-4 sm:gap-6 mt-2"
          >
            <a 
              href="#booking" 
              className="group relative flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-full font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              {/* Shine Sweep Overlay */}
              <div className="absolute top-0 -inset-full h-full w-1/2 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/20 opacity-40 group-hover:animate-shine" />
              
              <span>Book Appointment</span>
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center group-hover:translate-x-1.5 transition-transform duration-300">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </a>

            <button 
              className="flex items-center gap-3 px-6 py-4 rounded-full font-bold text-slate-700 hover:text-primary hover:bg-slate-100/80 transition-all duration-300"
            >
              <div className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                <Play className="w-4 h-4 fill-primary" />
              </div>
              <span>Watch Video</span>
            </button>
          </motion.div>

          {/* Patient Reviews Badging */}
          <motion.div 
            variants={fadeUpVariants}
            className="flex flex-wrap items-center gap-4 mt-4 pt-6 border-t border-slate-100"
          >
            {/* Avatars */}
            <div className="flex -space-x-3">
              {[
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100',
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
                'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100',
              ].map((src, i) => (
                <img 
                  key={i} 
                  src={src} 
                  alt="Patient Avatar" 
                  className="w-10 h-10 rounded-full border-2 border-white object-cover" 
                />
              ))}
            </div>

            {/* Score */}
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1">
                <span className="font-bold text-slate-800 text-sm">4.9</span>
                <div className="flex text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                </div>
              </div>
              <span className="text-xs text-slate-400 font-medium">Trusted by 1000+ Happy Patients</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Side: Dentist 3D Image & Parallax blobs */}
        <div className="lg:col-span-5 relative flex justify-center items-center h-[400px] sm:h-[500px]">
          {/* Rotating Backing circle */}
          <div className="absolute w-[80%] aspect-square bg-gradient-to-tr from-primary/10 to-sky-300/20 rounded-full animate-spin-slow blur-sm pointer-events-none" />
          
          {/* Solid glass ring backing */}
          <div className="absolute w-[70%] aspect-square rounded-full border border-white/50 glass-card shadow-inner flex items-center justify-center overflow-hidden">
            {/* Backdrop blue image representation */}
            <div className="w-[110%] h-[110%] bg-[radial-gradient(circle_at_center,rgba(0,102,255,0.1),transparent_70%)]" />
          </div>

          {/* 3D Dentist Image */}
          <motion.img 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            src="/dentist_hero.png" 
            alt="3D Dentist FIDA DENTAL CLINIC" 
            className="absolute bottom-4 max-h-[110%] object-contain drop-shadow-[0_20px_50px_rgba(0,102,255,0.25)] select-none pointer-events-none z-10"
          />

          {/* Floating badge inside hero illustration */}
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="absolute bottom-16 right-4 sm:right-8 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-blue-50/50 flex items-center gap-3 z-20 animate-float"
          >
            <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Shield className="w-5 h-5 fill-primary/10" />
            </div>
            <div className="text-left text-xs font-semibold text-slate-800">
              <div>Safe & Clean</div>
              <div className="text-[10px] text-slate-400 font-medium">FDA Certified</div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute top-20 left-4 sm:left-8 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-blue-50/50 flex items-center gap-3 z-20 animate-float-delayed"
          >
            <div className="w-9 h-9 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="text-left text-xs font-semibold text-slate-800">
              <div>Instant Booking</div>
              <div className="text-[10px] text-slate-400 font-medium">24/7 Available</div>
            </div>
          </motion.div>
        </div>

      </div>

      {/* Bottom Features Cards */}
      <motion.div 
        className="max-w-7xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.15 }}
      >
        {[
          {
            title: 'Modern Technology',
            description: 'Advanced equipment for precise & comfortable treatment.',
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 16c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z" />
                <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
              </svg>
            ),
            bg: 'bg-blue-50/50 text-primary border-blue-100/50',
          },
          {
            title: 'Experienced Dentists',
            description: 'Highly qualified professionals committed to your oral health.',
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            ),
            bg: 'bg-sky-50/50 text-sky-600 border-sky-100/50',
          },
          {
            title: 'Patient Comfort',
            description: 'We ensure a relaxed & stress-free experience every visit.',
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            ),
            bg: 'bg-emerald-50/50 text-emerald-600 border-emerald-100/50',
          },
          {
            title: 'Easy Online Booking',
            description: 'Book your appointment quickly & easily anytime, anywhere.',
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            ),
            bg: 'bg-indigo-50/50 text-indigo-600 border-indigo-100/50',
          },
        ].map((feat, idx) => (
          <motion.div 
            key={idx}
            variants={cardStaggerVariants}
            className="interactive-card glass-card p-6 rounded-[24px] hover:shadow-xl hover:shadow-blue-500/5 border border-white hover:border-blue-500/20 hover:-translate-y-1.5 transition-all duration-300 flex flex-col gap-4 text-left"
          >
            <div className={`w-12 h-12 ${feat.bg} rounded-xl flex items-center justify-center border`}>
              {feat.icon}
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg leading-tight mb-2">{feat.title}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{feat.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

    </section>
  );
}
