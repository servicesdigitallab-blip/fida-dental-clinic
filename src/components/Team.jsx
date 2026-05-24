import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Sparkles, Phone, Award, Smile, Calendar, Clock, ShieldCheck, Heart } from 'lucide-react';

const teamData = [
  {
    name: 'Dr. Ali Raza',
    specialty: 'General Dentist',
    rating: 5,
    image: '/team_ali.png',
    isChief: false
  },
  {
    name: 'Dr. Usman Khan',
    specialty: 'Dental Surgeon',
    rating: 5,
    image: '/team_usman.png',
    isChief: true
  },
  {
    name: 'Dr. Sana Malik',
    specialty: 'Cosmetic Dentist',
    rating: 5,
    image: '/team_sana.png',
    isChief: false
  }
];

export default function Team() {
  const containerRef = useRef(null);

  const nextSlide = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 280, behavior: 'smooth' });
    }
  };

  const prevSlide = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -280, behavior: 'smooth' });
    }
  };

  // 3D Perspective Rotation Effect on mouse move over doctor card
  const handleMouseMove = (e, cardEl) => {
    if (!cardEl) return;
    const rect = cardEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    
    // Pitch (X-rotation) and Yaw (Y-rotation)
    const rotateY = ((x - xc) / xc) * 8; // Max 8 degrees Y rotation
    const rotateX = -((y - yc) / yc) * 5; // Max 5 degrees X rotation
    
    cardEl.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    
    // Soft shadow movement based on cursor
    const shadowX = -((x - xc) / xc) * 15;
    const shadowY = -((y - yc) / yc) * 15;
    cardEl.style.boxShadow = `${shadowX}px ${shadowY}px 35px rgba(0, 102, 255, 0.12)`;
  };

  const handleMouseLeave = (cardEl) => {
    if (!cardEl) return;
    cardEl.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    cardEl.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.02)';
  };

  return (
    <section id="team" className="relative py-24 px-6 lg:px-12 overflow-hidden bg-gradient-to-b from-white to-blue-50/20">
      
      {/* Background blobs */}
      <div className="absolute top-[25%] left-[-10%] w-[400px] h-[400px] bg-blue-300/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[25%] right-[-10%] w-[450px] h-[450px] bg-sky-200/10 rounded-full blur-3xl pointer-events-none" />

      {/* Floating 3D Orbiting Tooth on the Left */}
      <div className="absolute top-[12%] left-[4%] w-24 h-24 pointer-events-none z-10 hidden xl:block animate-float">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Orbiting Blue Ring */}
          <div className="absolute w-[120%] h-[40%] border-[3.5px] border-primary/30 rounded-full rotate-[-25deg] animate-spin-slow" style={{ animationDuration: '8s' }} />
          {/* Main Tooth Icon with Shadow */}
          <svg className="w-14 h-14 text-primary filter drop-shadow-[0_12px_24px_rgba(0,102,255,0.3)]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" stroke="#0066ff" strokeWidth="1.5">
            <path d="M12 2C8.5 2 6 4.5 6 8c0 3.5 2.5 5 4 8.5 1 2.3.5 3.5 2 3.5s1-1.2 2-3.5c1.5-3.5 4-5 4-8.5 0-3.5-2.5-6-6-6zm0 8.5c-.8 0-1.5-.7-1.5-1.5S11.2 7.5 12 7.5s1.5.7 1.5 1.5-.7 1.5-1.5 1.5z" />
          </svg>
          {/* Sparkling dots */}
          <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-secondary fill-secondary animate-pulse" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full z-10 relative">
        
        {/* Top Header Badge Row */}
        <div className="flex justify-between items-center mb-6 max-w-7xl mx-auto">
          <div className="w-1/3 hidden lg:block" />
          
          {/* Section Header */}
          <motion.div 
            className="text-center w-full lg:w-1/3 flex flex-col items-center gap-3"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-2 px-4 py-1.5 bg-primary-light text-primary rounded-full text-xs font-bold uppercase tracking-wider border border-primary/5">
              <Award className="w-3.5 h-3.5" />
              <span>OUR TEAM</span>
            </div>
          </motion.div>

          {/* Floating Right Responsibility Badge */}
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white/80 border border-slate-100 rounded-2xl shadow-sm text-xs font-bold text-slate-700 animate-float">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>Your Smile, Our Responsibility</span>
          </div>
        </div>

        {/* Header Heading */}
        <motion.div 
          className="text-center mb-16 flex flex-col items-center gap-3"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-800 leading-tight">
            Meet the Experts Behind <br />
            <span className="text-gradient relative inline-block">
              Your Healthy Smile!
              <svg className="absolute -bottom-1.5 left-0 w-full h-2 text-primary/30 fill-none" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0,5 Q50,9 100,5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-xl leading-relaxed mt-2">
            A passionate team of dental professionals dedicated to providing exceptional care with a personal touch.
          </p>
        </motion.div>

        {/* Carousel Grid Track */}
        <div className="relative px-4 sm:px-8">
          {/* Cards Display Grid - 3 Columns */}
          <div 
            ref={containerRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {teamData.map((doc, idx) => {
              let cardEl = null;
              const isUsman = doc.isChief;

              return (
                <motion.div
                  key={doc.name}
                  layout
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: isUsman ? 1.06 : 1 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.8, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  onMouseMove={(e) => handleMouseMove(e, cardEl)}
                  onMouseLeave={() => handleMouseLeave(cardEl)}
                  ref={el => cardEl = el}
                  className={`group relative glass-card p-5 rounded-[32px] border ${isUsman ? 'border-primary/25 shadow-2xl shadow-blue-500/15 bg-gradient-to-b from-blue-50/15 via-white to-white' : 'border-white'} transition-all duration-500 flex flex-col gap-4 text-center cursor-pointer`}
                  style={{ transformStyle: 'preserve-3d', transition: 'box-shadow 0.4s, border-color 0.4s, transform 0.4s' }}
                >
                  
                  {/* Photo Container */}
                  <div className="relative w-full aspect-[9/10] rounded-[22px] overflow-hidden bg-slate-50 shadow-inner">
                    <img 
                      src={doc.image} 
                      alt={doc.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)]"
                    />

                    {/* Chief badge overlay on bottom center of image */}
                    {isUsman && (
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-primary text-white font-extrabold text-[9px] uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-md z-20 flex items-center gap-1 border border-white/10">
                        <Sparkles className="w-3 h-3 fill-white/20" />
                        <span>Chief Dentist</span>
                      </div>
                    )}
                  </div>

                  {/* Overlapping white circular badge on lower right (for others) */}
                  {!isUsman && (
                    <div className="absolute top-[50%] right-8 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md border border-slate-50 z-20 group-hover:scale-115 transition-transform duration-500">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0066ff" className="w-5 h-5">
                        <path d="M12 2C8.5 2 6 4.5 6 8c0 3.5 2.5 5 4 8.5 1 2.3.5 3.5 2 3.5s1-1.2 2-3.5c1.5-3.5 4-5 4-8.5 0-3.5-2.5-6-6-6zm0 8.5c-.8 0-1.5-.7-1.5-1.5S11.2 7.5 12 7.5s1.5.7 1.5 1.5-.7 1.5-1.5 1.5z" />
                      </svg>
                    </div>
                  )}

                  {/* Text Details & Star Ratings */}
                  <div className="flex flex-col items-center gap-0.5">
                    <h3 className="font-extrabold text-slate-800 text-base group-hover:text-primary transition-colors leading-tight">
                      {doc.name}
                    </h3>
                    <p className="text-primary text-[10px] font-bold uppercase tracking-wider mb-1.5">
                      {doc.specialty}
                    </p>
                    
                    {/* Centered Rating Stars */}
                    <div className="flex gap-0.5 text-amber-400">
                      {[...Array(doc.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  {/* Blue aura behind Chief card */}
                  {isUsman && (
                    <div className="absolute inset-0 bg-primary/[0.02] rounded-[28px] blur-sm -z-10 pointer-events-none" />
                  )}

                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Staggered Row of 6 Badges */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-16 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
        >
          {[
            { label: 'Expert Care', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
            { label: 'Advanced Training', icon: <Sparkles className="w-3.5 h-3.5" /> },
            { label: 'Modern Technology', icon: <Award className="w-3.5 h-3.5" /> },
            { label: 'Patient Comfort', icon: <Heart className="w-3.5 h-3.5" /> },
            { label: 'Trusted Experience', icon: <Smile className="w-3.5 h-3.5" /> },
            { label: 'Teamwork Excellence', icon: <ShieldCheck className="w-3.5 h-3.5" /> }
          ].map((badge, i) => (
            <div 
              key={i} 
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-100 shadow-sm text-xs font-bold text-slate-700 hover:border-primary/20 transition-all duration-300"
            >
              <div className="text-primary">{badge.icon}</div>
              <span>{badge.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Bottom Booking CTA Area - Mockup exact match */}
        <div id="booking-cta" className="max-w-7xl mx-auto w-full mt-24 glass-card p-6 sm:p-10 rounded-[36px] border border-blue-500/10 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 text-left bg-gradient-to-r from-blue-50/30 via-white to-white">
          <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
          
          {/* Left Text Block */}
          <div className="relative z-10 flex flex-col gap-4 max-w-md">
            <div className="flex items-center gap-2 px-3 py-1 bg-primary-light text-primary rounded-full text-[10px] font-bold uppercase tracking-wider self-start border border-primary/5">
              <Smile className="w-3 h-3" />
              <span>READY TO GET STARTED?</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 leading-tight">
              Let's Make Your <br />
              <span className="text-gradient relative inline-block">Smile Amazing!</span>
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Book your appointment today and take the first step towards a healthier, brighter smile.
            </p>
          </div>

          {/* Middle Info Items (Horizontal columns) */}
          <div className="relative z-10 flex flex-col sm:flex-row gap-6 max-w-xl pr-0 lg:pr-4">
            <div className="flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div>
                <h4 className="font-bold text-slate-800 text-xs">Easy Online Booking</h4>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">Book appointment anytime.</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div>
                <h4 className="font-bold text-slate-800 text-xs">Flexible Scheduling</h4>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">Choose works best.</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div>
                <h4 className="font-bold text-slate-800 text-xs">Safe & Secure</h4>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">Always protected.</p>
              </div>
            </div>
          </div>

          {/* Right Button & Image Block */}
          <div className="relative z-10 flex items-center gap-6 shrink-0 flex-wrap sm:flex-nowrap">
            <a 
              href="#booking" 
              className="group relative flex items-center gap-2.5 px-6 py-4 bg-primary text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden shrink-0"
            >
              <div className="absolute top-0 -inset-full h-full w-1/2 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/20 opacity-40 group-hover:animate-shine pointer-events-none" />
              <span>Book Appointment Now</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            {/* Clinic preview room image wrapper */}
            <div className="w-28 h-20 rounded-xl overflow-hidden border border-slate-100 shadow-md shrink-0 hidden sm:block">
              <img 
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=300" 
                alt="Clinic Room Preview" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
