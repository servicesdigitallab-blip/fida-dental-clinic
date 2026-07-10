import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, Smile, Sparkles, Shield, Activity, Sparkle } from 'lucide-react';

const servicesData = [
  {
    title: 'General Dentistry',
    description: 'Complete dental care for you and your family.',
    image: '/service_general.png',
    icon: <Smile className="w-6 h-6 text-primary" />,
  },
  {
    title: 'Cosmetic Dentistry',
    description: 'Enhance your smile with our cosmetic treatments.',
    image: '/service_cosmetic.png',
    icon: <Sparkles className="w-6 h-6 text-primary" />,
  },
  {
    title: 'Dental Implants',
    description: 'Permanent solutions for missing teeth.',
    image: '/service_implants.png',
    icon: <Shield className="w-6 h-6 text-primary" />,
  },
  {
    title: 'Orthodontics',
    description: 'Straighten your teeth with modern braces.',
    image: '/service_ortho.png',
    icon: <Activity className="w-6 h-6 text-primary" />,
  },
  {
    title: 'Teeth Whitening',
    description: 'Brighten your smile with our whitening treatments.',
    image: '/service_whitening.png',
    icon: <Sparkle className="w-6 h-6 text-primary" />,
  },
];

export default function Services() {
  const containerRef = useRef(null);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  // 3D Perspective Rotation Effect on mouse move
  const handleMouseMove = (e, cardEl) => {
    if (!cardEl) return;
    const rect = cardEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const angleX = (yc - y) / 20; // pitch
    const angleY = (x - xc) / 20; // yaw
    cardEl.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-6px)`;
  };

  const handleMouseLeave = (cardEl) => {
    if (!cardEl) return;
    cardEl.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
  };

  return (
    <section id="services" className="relative py-24 px-6 lg:px-12 overflow-hidden bg-gradient-to-b from-blue-50/15 via-white to-white">
      
      {/* Background blobs */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-blue-300/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-sky-200/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full z-10 relative">
        
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16 flex flex-col items-center gap-4 animate-fade-in"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-2 px-4 py-1.5 bg-primary-light text-primary rounded-full text-xs font-bold uppercase tracking-wider border border-primary/5">
            <Smile className="w-3.5 h-3.5" />
            <span>OUR SERVICES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-800 leading-tight">
            Comprehensive <span className="text-primary relative inline-block">
              Dental Solutions
              <svg className="absolute -bottom-1.5 left-0 w-full h-2 text-primary/30 fill-none" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0,5 Q50,9 100,5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-xl leading-relaxed mt-2">
            We offer a wide range of dental services to meet all your oral health needs with the highest standards of care.
          </p>
        </motion.div>

        {/* Horizontal Slider Layout */}
        <div className="relative px-4 sm:px-8">
          
          {/* Navigation Arrows (Float sides) */}
          <div className="absolute top-[40%] -translate-y-1/2 left-0 z-30">
            <button 
              onClick={scrollLeft}
              className="w-12 h-12 rounded-full border border-slate-100 bg-white shadow-lg flex items-center justify-center text-slate-500 hover:text-primary hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
          
          <div className="absolute top-[40%] -translate-y-1/2 right-0 z-30">
            <button 
              onClick={scrollRight}
              className="w-12 h-12 rounded-full border border-slate-100 bg-white shadow-lg flex items-center justify-center text-slate-500 hover:text-primary hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Cards List Scroller */}
          <div 
            ref={containerRef}
            className="flex gap-6 overflow-x-auto pb-8 pt-4 px-2 snap-x snap-mandatory scroll-smooth hide-scrollbar"
          >
            {servicesData.map((service, idx) => {
              let cardEl = null;
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  onMouseMove={(e) => handleMouseMove(e, cardEl)}
                  onMouseLeave={() => handleMouseLeave(cardEl)}
                  ref={el => cardEl = el}
                  className="group relative flex-none w-[280px] sm:w-[300px] snap-start glass-card p-5 rounded-[32px] border border-white hover:border-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 flex flex-col items-center text-center cursor-pointer"
                  style={{ transformStyle: 'preserve-3d', transition: 'box-shadow 0.4s, border-color 0.4s, transform 0.4s' }}
                >
                  {/* Portrait image container (default 9:16 aspect ratio feeling) */}
                  <div className="relative w-full aspect-[9/13] group-hover:aspect-[16/10] overflow-hidden rounded-[24px] bg-slate-100 shadow-inner transition-all duration-[1s] ease-[cubic-bezier(0.22,1,0.36,1)]">
                    
                    {/* Sweep shine */}
                    <div className="absolute top-0 -inset-full h-full w-1/2 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/20 opacity-40 group-hover:animate-shine z-10 pointer-events-none" />
                    
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)]"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  </div>

                  {/* Circular Icon overlapping the bottom-center of the image */}
                  <div className="relative -mt-7 mb-4 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-50 group-hover:scale-110 group-hover:rotate-[8deg] transition-all duration-500 z-20 group-hover:shadow-blue-500/10">
                    {service.icon}
                  </div>

                  {/* Text Details */}
                  <div className="flex flex-col gap-2.5 px-1 pb-4">
                    <h3 className="font-extrabold text-slate-800 text-lg group-hover:-translate-y-0.5 transition-transform duration-500 leading-tight">
                      {service.title}
                    </h3>
                    <p className="text-slate-400 text-xs leading-relaxed max-w-[240px]">
                      {service.description}
                    </p>
                  </div>

                  {/* Learn More link */}
                  <div className="mt-auto flex items-center gap-1.5 text-primary font-bold text-xs group/link">
                    <span>Learn More</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1.5 transition-transform duration-300" />
                  </div>

                </motion.div>
              );
            })}
          </div>
        </div>

        {/* View All Services bottom button */}
        <motion.div 
          className="mt-16 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <a 
            href="#booking" 
            className="group relative flex items-center gap-2.5 px-9 py-4 bg-primary text-white rounded-full font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute top-0 -inset-full h-full w-1/2 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/20 opacity-40 group-hover:animate-shine pointer-events-none" />
            <span>View All Services</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </a>
        </motion.div>

      </div>
    </section>
  );
}
